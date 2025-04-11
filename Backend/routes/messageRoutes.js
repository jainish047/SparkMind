import express from "express";
import passport from "passport";
import { getConversations, getMessages, startConversation } from "../controllers/messageControllers.js";

const router = express.Router();

router.get(
  "/:userId/conversations",
  passport.authenticate("jwt", { session: false }),
  getConversations
);

router.get(
  "/:user1/:user2",
  passport.authenticate("jwt", { session: false }),
  getMessages
);

router.post("/start", startConversation)

export default router;
