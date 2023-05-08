import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectDB } from "@utils/database";

// stopped at 1:48:58

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  async session({ session }) {
    // get user information
    const sessionUser = await User.findOne({
      email: session.user.email,
    });

    // append userId to session
    session.user.id = sessionUser._id.toString();

    return session;
  },

  async signIn({ profile }) {
    try {
      // serverless -> Lambda -> dynamodb
      // have to connect to DB on every request
      await connectDB();

      // check if user already exist
      const userExist = await User.findOne({ email: profile.email });

      // if not, create new user and save to db
      if (!userExist) {
        await User.create({
          email: profile.email,
          username: profile.name.replace(" ", "").toLowerCase(),
          image: profile.picture,
        });
      }

      return true; // user authenticated
    } catch (error) {
      console.log(error);
      return false; // failed authentication
    }
  },
});

export { handler as GET, handler as POST };
