import {
  getAssignedProjects,
  getMyProjects,
} from "../controllers/projectsController.js";
import express from "express";
import passport from "passport";
import "../strategy/jwt.js";

const router = express.Router();

router.get(
  "/my",
  passport.authenticate("jwt", { session: false }),
  getMyProjects
);

router.get(
  "/assigned",
  passport.authenticate("jwt", { session: false }),
  getAssignedProjects
);

export default router;
