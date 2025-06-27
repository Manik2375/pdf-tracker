// noinspection ExceptionCaughtLocallyJS,JSUnusedGlobalSymbols

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import connectToDatabase from "@/lib/db/connection";
import {User} from "@/lib/db/models/user";
import bcrypt from "bcrypt";

export const {auth, handlers, signIn, signOut} = NextAuth({
      providers: [
        CredentialsProvider({
          name: "Credentials",
          id: "credentials",
          credentials: {
            username: {label: "Email", type: "text"},
            password: {label: "Password", type: "password"},
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          async authorize(credentials: any): Promise<any> {
            await connectToDatabase();
            try {
              const user = await User.findOne({
                email: credentials.email,
              });
              if (!user) {
                throw new Error("No User found with this email");
              }
              if (!user.isEmailVerified) {
                throw new Error("Please verify the account first");
              }
              const isPasswordValid = await bcrypt.compare(
                  credentials.password,
                  user.password
              );
              if (isPasswordValid) {
                user.lastLoginAt = new Date();
                return user;
              }
              throw new Error("Password not valid");
            } catch (e) {
              throw new Error(e instanceof Error ? e.message : String(e));
            }
          },
        }),
        GoogleProvider({
          authorization: {
            params: {
              prompt: "consent",
              access_type: "offline",
              response_type: "code"
            }
          },
        }),
        GitHubProvider
      ],
      session: {
        strategy: "jwt",
      },
      jwt: {
        maxAge: 60 * 60 * 24 * 30
      },
      callbacks: {
        async signIn({user, account}) {
          if (!account) return false

          await connectToDatabase();

          const existingUser = await User.findOne({email: user.email})
          if (existingUser) {
            user._id = existingUser._id;
            user.isEmailVerified = existingUser.isEmailVerified;
            return true;
          }
          if (account?.provider != "credentials") {
            const newUser = await User.create({
              email: user.email,
              avatar: user.image,
              providerID: account.providerAccountId,
              provider: account.provider,
              name: user.name,
              isEmailVerified: true,
              lastLoginAt: new Date()
            })
            await newUser.save()
          }
          return true;
        },
        async jwt({token, user}) {
          if (user) {
            token._id = user._id?.toString();
            token.name = user.name;
            token.isEmailVerified = user.isEmailVerified;
            token.avatar = user.avatar ?? user.image;
          }
          console.log("USER", user);
          return token;
        },
        async session({session, token}) {
          if (token) {
            session.user._id = token._id?.toString();
            session.user.name = token.name;
            session.user.isEmailVerified = token.isEmailVerified;
            session.user.avatar = token.avatar ?? token.image;
          }
          return session;
        },
      },
      pages:
          {
            signIn: "/",
          }
      ,
    })
;
