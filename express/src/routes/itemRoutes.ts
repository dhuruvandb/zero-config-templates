import { Router, Request, Response } from "express";
import { getAllItems, createItem, deleteItem, updateItem } from "../services/item.service";

const router = Router();

// GET all items
router.get("/", async (_req: Request, res: Response) => {
  try {
    const items = await getAllItems();
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST a new item
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const item = await createItem(name);
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE an item by ID
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const item = await updateItem(req.params.id, name);
    res.json(item);
  } catch (error: any) {
    if (error.message === "Item not found") {
      return res.status(404).json({ message: "Item not found" });
    }
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE an item by ID
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await deleteItem(req.params.id);
    res.json({ message: "Deleted" });
  } catch (error: any) {
    if (error.message === "Item not found") {
      return res.status(404).json({ message: "Item not found" });
    }
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;