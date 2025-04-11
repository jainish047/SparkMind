import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import passport from "passport";
import jwt from "jsonwebtoken";

import http from "http";
import { Server } from "socket.io";

import "./strategy/local.js"; // not using in project
import "./strategy/jwt.js";
import "./strategy/google.js";

import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import projectsRouter from "./routes/projectsRoutes.js";
import projectsRouter2 from "./routes/projectsRoutes2.js";
import generalRouter from "./routes/generalRoutes.js";
import listsRouter from "./routes/listsRoutes.js";
import freelancersRouter from "./routes/freelancersRoutes.js";
import messagesRouter from "./routes/messageRoutes.js";
import blogRouter from "./routes/blogRoutes.js"

import prisma from "./prisma/prismaClient.js";

import { EventEmitter } from "events";
import { getUserIfThere } from "./common/user.js";
// Increase the max listeners to 20 (or any number you find appropriate)
EventEmitter.defaultMaxListeners = 40;

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    methods: ["GET", "POST"],
    credentials: true, // Allow cookies
  },
});

const connectedUsers = new Map();

// CORS setup to allow requests from your frontend (localhost:5173)
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Replace with your frontend URL
    credentials: true, // Allow cookies
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRouter);
app.use("/api/general", generalRouter);
app.use("/api/user", getUserIfThere, userRouter);
app.use("/api/projects", getUserIfThere, projectsRouter);
app.use("/api/projects2", projectsRouter2);
app.use("/api/freelancers", freelancersRouter);
app.use(
  "/api/lists",
  (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      if (err)
        return res.status(500).json({ message: "Internal server error" });
      if (!user)
        return res
          .status(401)
          .json({ message: info?.message || "Unauthorized" });

      req.user = user;
      next(); // Proceed to listsRouter
    })(req, res, next);
  },
  listsRouter
);
app.use("/api/messages", messagesRouter);
app.use("/api/blogs", blogRouter);

// Socket.IO JWT Auth Middleware
io.use(async (socket, next) => {
  try {
    console.log("====Socket auth middleware====");
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      console.log("====User not found");
      return next(new Error("Authentication failed"));
    }
    socket.user = user;
    console.log("====Authenticated user:", user);
    next();
  } catch (err) {
    console.error("====Socket authentication error:", err);
    next(new Error("Authentication failed"));
  }
});

io.on("connection", (socket) => {
  console.log("====Socket connected:", socket.id);

  // Register event to associate a user with this socket.
  socket.on("register", (userId) => {
    connectedUsers.set(userId, socket.id);
    console.log(`====User ${userId} registered with socket ${socket.id}`);
  });

  // Listen for sendMessage event from any client
  socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
    console.log("senderId:", senderId);
    console.log("receiverId:", receiverId);
    console.log("content:", content);
    // Create message in the DB
    const message = await prisma.message.create({
      data: { senderId, receiverId, content },
      include: {
        sender: {
          select: {
            id:true,
            name: true,
          },
        },
        receiver: {
          select: {
            id:true,
            name: true,
          },
        },
      },
    });

    // Emit the new message to both sender and receiver (if connected)
    const receiverSocket = connectedUsers.get(receiverId);
    if (receiverSocket) {
      io.to(receiverSocket).emit("newMessage", message);
    }
    // Also send to sender (to update local state)
    const senderSocket = connectedUsers.get(senderId);
    if (senderSocket) {
      io.to(senderSocket).emit("newMessage", message);
    }
  });

  socket.on("disconnect", () => {
    // Clean up disconnected socket
    for (const [userId, sockId] of connectedUsers.entries()) {
      if (sockId === socket.id) {
        connectedUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// By default, Passport creates a session (for login-based authentication like username/password).
// Since JWT does not use sessions (it is stateless), we disable sessions with { session: false }.
// This ensures that Passport does not store authentication data in a session.

// app.listen(process.env.PORT);
server.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
