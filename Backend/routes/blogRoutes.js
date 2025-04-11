import express from "express";
import { createBlog, getBlogs } from "../controllers/blogController.js";
import { upload } from "../common/multer.js";

const router = express.Router();

router.get("/", getBlogs);

router.post("/", upload.single("image"), createBlog);

export default router;
