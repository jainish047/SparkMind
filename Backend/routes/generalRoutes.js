import express from "express";
import { fetchSkills, fetchCountries, fetchLanguages } from "../controllers/generalController.js";

const router = express.Router()

router.get("/skills", fetchSkills)

router.get("/countries", fetchCountries)

router.get("/languages", fetchLanguages)


export default router;