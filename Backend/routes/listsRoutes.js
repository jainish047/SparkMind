import express from "express";
import { addToList, createNewList, deleteList, fetchItems, fetchLists, removeItemFromList } from "../controllers/listsController.js";

const router = express.Router()

// const checkUser = (req, res) =>{
//     if(!req.user)
//         return res.status(401).send({message:"please login first"})
// }

// router.use(checkUser)

router.get("/", fetchLists)

router.get("/:listId", fetchItems)

router.post("/create", createNewList)

router.post("/add", addToList)

router.delete("/:listId/:entityId", removeItemFromList)

router.delete("/:listId", deleteList)

export default router;