import prisma from "../prisma/prismaClient.js";

export async function fetchLists(req, res) {
  try {
    const { id } = req.user;
    console.log("getting lists for user: ", id);
    const lists = await prisma.list.findMany({
      where: { userId: id },
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({ lists });
  } catch (error) {
    console.error("Error getting lists in backend", error);
    return res.status(500).send({ message: "Error getting lists in backend" });
  }
}

export async function fetchItems(req, res) {
  try {
    const { listId } = req.params;
    const { id } = req.user;

    if (!listId) {
      return res.status(400).json({ error: "List ID is required" });
    }

    console.log("fetching items for list: ", listId, " for user ", id);

    let items = [];
    if (listId === "follow") {
      // Get follow items where the current user is the follower.
      items = await prisma.follow.findMany({
        where: { followerId: id },
        include: { following: true },
        orderBy: { createdAt: "desc" },
      });
      // Append boolean flag.
      items = items.map((item) => ({ ...item, isFollowed: true }));
    } else if (listId === "followers") {
      // Get follow items where the current user is the follower.
      items = await prisma.follow.findMany({
        where: { followingId: id },
        include: { follower: true },
        orderBy: { createdAt: "desc" },
      });
      // Append boolean flag.
      items = items.map((item) => ({ ...item, isFollowed: true }));
    } else if (listId === "bookmark") {
      items = await prisma.bookmark.findMany({
        where: { userId: id },
        include: {
          project: {
            include: {
              user: true, // includes the project owner details
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
      // Append boolean flag.
      items = items.map((item) => ({ ...item, isBookmarked: true }));
    } else {
      items = await prisma.listItem.findMany({
        where: { listId },
        include: { project: true },
        orderBy: { createdAt: "desc" },
      });
    }
    console.log("fetched data: ", items);
    res.status(200).json({ items });
  } catch (error) {
    console.error("Error getting items in backend", error);
    return res.status(500).send({ message: "Error getting items in backend" });
  }
}

export async function createNewList(req, res) {
  try {
    const { name, type } = req.body;
    const { id: userId } = req.user;

    console.log("creating list ", name, " of ", type, " for user ", userId);

    if (!name || !type) {
      return res.status(400).json({ message: "Name and type are required" });
    }

    const validTypes = ["PROJECT", "USER"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ error: "Invalid list type provided" });
    }

    await prisma.list.create({
      data: { name, type, userId },
    });

    const lists = await prisma.list.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    res.status(201).json({ lists, message: "list created successfully" });
  } catch (error) {
    console.error("Error creating new list in backend", error);
    return res
      .status(500)
      .send({ message: "Error creating new list in backend" });
  }
}

export async function addToList(req, res) {
  try {
    const { listId, type, entityId } = req.body;
    const { id: userId } = req.user;

    if (!listId || !entityId) {
      return res
        .status(400)
        .json({ error: "List ID and entityId are required." });
    }

    let newItem;
    if (listId === "follow") {
      newItem = await prisma.follow.create({
        data: { followerId: userId, followingId: entityId },
      });
      newItem = { ...newItem, isFollowing: true };
    } else if (listId === "bookmark") {
      newItem = await prisma.bookmark.create({
        data: { userId, projectId: entityId },
      });
      newItem = { ...newItem, isBookmarked: true };
    } else {
      const list = await prisma.list.findUnique({ where: { id: listId } });
      if (!list || list.userId !== userId) {
        return res
          .status(403)
          .json({ error: "You are not authorized to add items to this list." });
      }
      newItem = await prisma.listItem.create({
        data: { listId, projectId: entityId },
      });
    }
    res.status(201).json({ message: "Added to list successfully", ...newItem });
  } catch (error) {
    console.error("Error adding to list in backend", error);
    return res.status(500).send({ message: "Error adding to list in backend" });
  }
}

export async function removeItemFromList(req, res) {
  try {
    const { listId, entityId } = req.params;
    const { id: userId } = req.user;

    if (!listId || !entityId) {
      return res
        .status(400)
        .json({ error: "List ID and entityId are required." });
    }

    let deletedResult;
    if (listId === "follow") {
      deletedResult = await prisma.follow.deleteMany({
        where: { followerId: userId, followingId: entityId },
      });
    } else if (listId === "bookmark") {
      deletedResult = await prisma.bookmark.deleteMany({
        where: { userId, projectId: entityId },
      });
    } else {
      deletedResult = await prisma.listItem.deleteMany({
        where: { listId, projectId: entityId },
      });
    }
    res
      .status(200)
      .json({ message: "Removed from list successfully", item: deletedResult });
  } catch (error) {
    console.error("Error removing item", error);
    return res.status(500).send({ message: "Error removing item" });
  }
}

export async function deleteList(req, res) {
  try {
    const { listId } = req.params;
    const { id: userId } = req.user;

    if (listId === "follow" || listId === "bookmark") {
      return res.status(400).json({ error: "Cannot delete special lists." });
    }

    const list = await prisma.list.findUnique({ where: { id: listId } });
    if (!list || list.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this list." });
    }

    await prisma.list.delete({ where: { id: listId } });
    res.status(200).json({ message: "List deleted successfully." });
  } catch (error) {
    console.error("Error deleting list", error);
    return res.status(500).send({ message: "Error deleting list" });
  }
}
