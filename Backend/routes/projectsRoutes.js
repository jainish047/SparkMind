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

const router = express.Router();

router.get("/", filterProjects);

router.post("/assign-project", async (req, res) => {
  const { projectId, freelancerId } = req.body;

  try {
    const result = await assignProjectToFreelancer(projectId, freelancerId);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


router.post("/", passport.authenticate("jwt", { session: false }), postProject);

router.get("/:projectId", getProjectDetails);

router.post(
  "/:projectId/bid",
  passport.authenticate("jwt", { session: false }),
  bidOnProject
);

export default router;
