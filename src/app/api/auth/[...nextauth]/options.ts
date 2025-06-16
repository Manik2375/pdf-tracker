import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDatabase from "@/lib/db/connection";
import { User } from "@/lib/db/models/user";
import bcrypt from "bcrypt";

export const AuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "credentials",
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
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
            return user;
          }
          throw new Error("Password not valid");
        } catch (e) {
          throw new Error(e instanceof Error ? e.message : String(e));
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.name = user.name;
        token.isVerified = user.isEmailVerified;
        token.test = true;
      }
      console.log("\n\nJWT callback", user)
      return token;
    },
    async session({ session, token }) {
      console.log("SEssion ran\n\n", token)
      if (token) {
        session.user._id = token._id?.toString();
        session.user.name = token.name;
        session.user.isEmailVerified = token.isVerified;
      }
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
};
