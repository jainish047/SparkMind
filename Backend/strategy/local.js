import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy } from "passport-local";
// all strategy has "Strategy" class
import prisma from "../prisma/prismaClient.js";

export default passport.use(
  // strategy constructory can have 2 arguments (options, verifyfxn)
  new Strategy({ usernameField: "email" }, async (username, password, done) => {
    // done(err, user, info)
    // - err: Error object / null
    // - user: User object / false
    // - info: Object containing additional info about the login attempt

    try {
      // validate input
      if (!username || !password)
        throw new Error("username and passsword are required.");

      // find user by username in database
      const user = await prisma.user.findUnique({ where: { email: username } });

      if (!user) throw new Error("No user found with that email");

      // compare password
      if (!bcrypt.compare(password, user.password))
        throw new Error("Password is incorrect");

      // if everything is correct, return the user
      return done(null, user);
    } catch (err) {
      console.log("error in passport strategy:->", err);
      return done(err, null);
    }
  })
);
