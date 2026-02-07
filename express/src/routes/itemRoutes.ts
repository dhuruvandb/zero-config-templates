import { Router, Request, Response } from "express";
import Item from "../models/item";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth";

const router = Router();

// GET all items for the authenticated user
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const items = await Item.find({ userId: req.userId });
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST a new item
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const item = new Item({ 
      name: req.body.name,
      userId: req.userId 
    });
    await item.save();
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE an item by ID
router.delete("/:id", async (req: AuthRequest, res: Response) => {
  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const deletedItem = await Item.findOneAndDelete({ 
      _id: req.params.id,
      userId: req.userId // Ensure user can only delete their own items
    });
    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
