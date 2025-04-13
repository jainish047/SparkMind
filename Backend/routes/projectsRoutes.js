import express from "express";
import {
  filterProjects,
  getProjectDetails,
  bidOnProject,
  postProject,
  assignProjectToFreelancer,
} from "../controllers/projectsController.js";
import passport from "passport";
import "../strategy/jwt.js";
import { initiatePayment } from "../controllers/paymentController.js";

const router = express.Router();

router.get("/", filterProjects);

router.post(
  "/assign-project",
  passport.authenticate("jwt", { session: false }),
  assignProjectToFreelancer,
  initiatePayment
);

router.post("/", passport.authenticate("jwt", { session: false }), postProject);

router.get("/:projectId", getProjectDetails);

router.post(
  "/:projectId/bid",
  passport.authenticate("jwt", { session: false }),
  bidOnProject
);

export default router;
