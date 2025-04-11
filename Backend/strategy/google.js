import { Strategy } from "passport-google-oauth20";
import passport from "passport";
import dotenv from "dotenv"
import prisma from "../prisma/prismaClient.js";
dotenv.config();

export default passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // From .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // From .env
      callbackURL: process.env.CALLBACK_URI,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Upsert user: if the user with this email already exists, update; otherwise, create a new record.
        const user = await prisma.user.upsert({
          where: { email: profile.emails[0].value },
          update: {
            // Optionally update the Google ID or other fields on subsequent logins.
            googleId: profile.id,
            // name: profile.displayName,
            // profilePic: profile.photos[0].value,
            provider: "google",
            emailVerified: true,
          },
          create: {
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            profilePic: profile.photos[0].value,
            provider: "google", // Mark user as Google-authenticated
            role: "WORK", // Set a default role (adjust as needed)
            emailVerified: true,
          },
        });

        return done(null, user); // Pass user to callback
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

