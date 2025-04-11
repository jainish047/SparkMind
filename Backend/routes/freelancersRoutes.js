import express from "express";
import passport from "passport";
import "../strategy/jwt.js";
import { filterFreelancers } from "../controllers/freelancersController.js";

const router = express.Router();

router.get("/", filterFreelancers);

export default router;
