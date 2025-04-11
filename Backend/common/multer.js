// ./common/multerConfig.js
import fs from "fs";
import path from "path";
import multer from "multer";

// Define the uploads directory relative to your project root.
const uploadDir = path.join(process.cwd(), "uploads");

// Check if the directory exists; if not, create it.
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log(`Created folder: ${uploadDir}`);
}

// Configure Multer storage using the uploadDir
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });
