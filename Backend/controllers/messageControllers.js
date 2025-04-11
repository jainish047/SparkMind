import prisma from "../prisma/prismaClient.js";

export async function getMessages(req, res) {
  const { user1, user2 } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ],
      },
      orderBy: { createdAt: "asc" },
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getConversations(req, res) {
  const { userId } = req.params;

  // Step 1: Fetch messages with sender and receiver details
  const messages = await prisma.message.findMany({
    where: {
      OR: [{ senderId: userId }, { receiverId: userId }],
    },
    orderBy: { createdAt: "desc" },
    include: {
      sender: { select: { id: true, name: true, profilePic:true } },
      receiver: { select: { id: true, name: true, profilePic:true } },
    },
  });

  // Step 2: Group by the other user
  const conversations = {};
  messages.forEach((msg) => {
    const otherUser = msg.senderId === userId ? msg.receiverId : msg.senderId;
    if (!conversations[otherUser]) conversations[otherUser] = msg;
  });

  // Step 3: Prepare response
  const response = Object.values(conversations).map((msg) => {
    const otherUser = msg.senderId === userId ? msg.receiver : msg.sender;

    return {
      user: { id: otherUser.id, name: otherUser.name, profilePic:otherUser.profilePic },
      lastMessage: {
        id: msg.id,
        content: msg.content,
        createdAt: msg.createdAt,
        sender: msg.sender, // full sender info
      },
    };
  });

  res.json(response);
}

export async function startConversation(req, res) {
  const { senderId, receiverId } = req.body;

  if (!senderId || !receiverId) {
    return res
      .status(400)
      .json({ error: "senderId and receiverId are required" });
  }

  try {
    // Optional: Check if any message already exists between them
    const existing = await prisma.message.findFirst({
      where: {
        OR: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      },
    });

    if (!existing) {
      // Insert a starter message
      await prisma.message.create({
        data: {
          senderId,
          receiverId,
          content: "👋", // Or "hi", or "Let's chat"
        },
      });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Error starting conversation:", err);
    return res
      .status(500)
      .json({
        message:
          "something went wrong in backend in starting conversation between you 2",
        error: "Internal Server Error",
      });
  }
}
