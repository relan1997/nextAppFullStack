import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

// 'session.user' is possibly 'undefined'.ts(18048) aisa kuch error agar aata hai toh pls change the session object in the module

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }, // basically on taking these details the next auth creates a form for the signin details
      },
      async authorize(credentials: any): Promise<any> {
        // ab jo crednetials waala object hai usse hum username aur password jo user ne enter kia hai woh access kar sakte hai
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) throw new Error("no user found this credentials");
          if (!user.isVerified)
            throw new Error("pls verify your account first");
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) return user;
          else throw new Error("password is not correct");
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],
  pages: {
    // now that we have provided an over-written route for sign-in, next will automatically create a form for this route, sign-up ki tarah custom page banane ki ab zaroorat nahi hai
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      // now what will we try to do is, enter the maximum amount of data into the token so that we dont need to make req to the data base
      if (token) {
        session.user._id = token._id;
        (session.user.isVerified = token.isVerified),
          (session.user.isAcceptingMessages = token.isAcceptingMessages),
          (session.user.username = token.username);
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        (token._id = user._id?.toString()),
          (token.isVerified = user.isVerified),
          (token.isAcceptingMessages = user.isAcceptingMessages),
          (token.username = user.username);
      }
      return token;
      // ab inn dono callbacks se fayde yeh hua hai ki session,token, aur user , teeno objects mai saara ka saara data exist karta hai
    },
  },
};
