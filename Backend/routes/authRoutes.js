import express from "express";
import {
  login,
  signup,
  verifyEmail,
  resendVerificationEMail,
  loginGoogle,
  getMe,
  forgotPWEmail,
  resetPassword,
  setPassword,
} from "../controllers/authControllers.js";
import passport from "passport";

const router = express.Router();

router.get("/getMe", getMe);

router.post("/login", login);

router.post("/signup", signup);

router.post("/verifyEmail", verifyEmail);

router.get("/resendVerificationEMail", resendVerificationEMail);

router.post("/forgotPWEmail", forgotPWEmail);

router.post("/resetPW", resetPassword);

router.post(
  "/setPW",
  passport.authenticate("jwt", { session: false }),
  setPassword
);

router.post("/logout", (req, res) => {
  res.clearCookie("authToken", { path: "/" });
  res.status(200).send({ message: "Logged out successfully" });
});

// Google OAuth Login, when google login button is clicked
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// When the user clicks "Login with Google" on the frontend, the request is sent to http://localhost:5000/auth/google.
// passport.authenticate("google", { scope: ["profile", "email"] }) tells Passport to redirect the user to Google's authentication page.
// The scope defines what data we want from Google (profile, email).
// Google asks the user for permission to access their profile and email.

// Google OAuth Callback, for token creation after verification by google
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }), //-> this (passport.authenticate("google")) calls google strategy
  loginGoogle
);
// After the user logs in on Google, Google redirects the user to your backend route /google/callback (Authorized Redirect URI).
// passport.authenticate("google", { session: false }) processes the Google response.
// If authentication is successful, the user info is available in req.user.
// A JWT token is generated using the user’s Google ID and email.
// The backend redirects the user to the frontend (http://localhost:3000) with the JWT token in the URL.

export default router;
