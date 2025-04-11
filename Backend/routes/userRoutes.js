import express from "express";
import {
  selfDetails,
  updateProfile,
  userDetails,
} from "../controllers/userController.js";
import passport from "passport";
import { upload } from "../common/multer.js";

const router = express.Router();

router.get(
  "/self",
  passport.authenticate("jwt", { session: false }),
  selfDetails
);

router.put(
  "/self",
  passport.authenticate("jwt", { session: false }),
  upload.single("profilePic"),
  updateProfile
);

router.get("/:id", userDetails);

export default router;
