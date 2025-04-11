// When a request comes in, Passport will:
// Extract the token from the Authorization header.
// Verify the token using the secret key (JWT_SECRET).
// Decode the payload and find the user.
// If valid, it will attach the user to req.user and allow access.

import passport from "passport";
import { Strategy } from "passport-jwt";
import { ExtractJwt } from "passport-jwt";
import prisma from "../prisma/prismaClient.js";

import dotenv from "dotenv";
dotenv.config();

const options = {
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

// Registers a new JWT authentication strategy with Passport
export default passport.use(
  // jwtPayload -> decoded token data.
  new Strategy(options, async (jwtPayload, done) => {
    // The function that runs when a token is found
    try {
      if (Date.now() >= jwtPayload.exp * 1000) {
        return done(null, false, { message: "Session expired" });
      }
      const user = await prisma.user.findUnique({
        where: {
          email: jwtPayload.email,
        },
      });

      if (!user) return done(null, false, { message: "User not found" });

      done(null, user); // If user exists, continue to the next middleware
    } catch (err) {
      console.error("Error in JWT strategy: ", err);
      done(err, false); // If user doesn't exist, reject the token
    }
  })
);
