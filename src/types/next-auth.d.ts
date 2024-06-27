// we will introduce some new data types in this folder for the next auth or precisely, we will modify the existing data types here
import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  // hum basically jo jo data types ya jo kehl lo, suppose objects ke saath ched chad kar rhe hai
  interface User {
    // we have basically told next auth ki jo tumahara user hai , usme hum changes kar rhe hai toh pls tum bhi yeh karne dena
    _id?: string; // a custom field added to the user object in the next-auth module
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultSession["user"]; // this tells us that jab bhi ek default session banega toh usme user ka ek key rahega hi rahega
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: boolean;
    username?: string;
  }
}
