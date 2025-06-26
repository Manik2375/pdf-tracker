import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    _id?: string;
    name: string;
    isEmailVerified: boolean;
    avatar: string;
  }
  interface Session {
    user: {
      _id?: string;
      name: string;
      isEmailVerified: boolean;
      avatar: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    name: string;
    isEmailVerified: boolean;
    avatar: string;
  }
}
