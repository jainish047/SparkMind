import prisma from "../prisma/prismaClient.js";
import { uploadFile } from "../common/cloudinary.js"; // adjust import as needed

export const createBlog = async (req, res) => {
  console.log("posting blogs");
  const { title, content, authorId } = req.body;
  let imageUrl = null;

  if (req.file) {
    try {
      // Upload file using Cloudinary helper function
      imageUrl = await uploadFile(req.file.path);
      // Optionally, delete the local file after upload if desired
    } catch (error) {
      console.error("Error uploading image:", error);
      return res.status(500).json({ error: "Failed to upload image" });
    }
  }

  try {
    const blog = await prisma.blog.create({
      data: { title, content, imageUrl, authorId },
    });
    res.status(201).json(blog);
  } catch (err) {
    res.status(500).json({ error: "Failed to create blog" });
  }
};


export const getBlogs = async (req, res) => {
  try {
    console.log("fetching blogs");

    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true, profilePic: true, id: true },
        },
      },
    });
    console.log("Fetched blogs:", blogs);
    res.status(200).json({blogs});
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};
