import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

import User from "@models/user";
import { connectDB } from "@utils/database";

// stopped at 1:48:58

const handler = NextAuth({
  // oauth providers
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // callbacks will contain all the callbacks we want to make upon making an auth request
  callbacks: {
    /**
     *
     * @param {*} session auth provider user session object
     * @returns session object
     */
    async session({ session }) {
      // get user information

      // retreive user from mongodb
      const sessionUser = await User.findOne({
        email: session.user.email,
      });
      // append mongodb id to session
      if (sessionUser) {
        session.user.id = sessionUser._id.toString();
      }

      return session;
    },

    /**
     *
     * @param {*} profile this is an object of the user provider's auth selection.
     * profile.name : google profile name (usign google provider)
     * profile.email: google email (using google provider)
     * profile.image: google account image (using google provider)
     * @returns
     */
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

        return true; // user was found and authenticated
      } catch (error) {
        console.log(error);
        return false; // failed authentication
      }
    },
  },
});

export { handler as GET, handler as POST };
