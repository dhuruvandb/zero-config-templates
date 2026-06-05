import { Router, Request, Response } from "express";
import { auth, fromNodeHeaders } from "../app";
import { getAllItems, createItem, deleteItem, updateItem } from "../services/item.service";

const router = Router();

/** Extract authenticated user ID from the request via Better Auth session. */
async function getUserId(req: Request): Promise<string | null> {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  return session?.user?.id ?? null;
}

/** Require authentication — returns 401 if not authenticated. */
async function requireAuth(req: Request, res: Response): Promise<string | null> {
  const userId = await getUserId(req);
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return null;
  }
  return userId;
}

// GET all items for the authenticated user
router.get("/", async (req: Request, res: Response) => {
  const userId = await requireAuth(req, res);
  if (!userId) return;

  try {
    const items = await getAllItems(userId);
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// POST a new item (owned by the authenticated user)
router.post("/", async (req: Request, res: Response) => {
  const userId = await requireAuth(req, res);
  if (!userId) return;

  try {
    const { name } = req.body;
    const item = await createItem(name, userId);
    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// UPDATE an item by ID (ownership verified)
router.put("/:id", async (req: Request, res: Response) => {
  const userId = await requireAuth(req, res);
  if (!userId) return;

  try {
    const { name } = req.body;
    const item = await updateItem(req.params.id, name, userId);
    res.json(item);
  } catch (error: any) {
    if (error.message === "Item not found") {
      return res.status(404).json({ message: "Item not found" });
    }
    if (error.message === "Forbidden") {
      return res.status(403).json({ message: "Forbidden" });
    }
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

// DELETE an item by ID (ownership verified)
router.delete("/:id", async (req: Request, res: Response) => {
  const userId = await requireAuth(req, res);
  if (!userId) return;

  try {
    await deleteItem(req.params.id, userId);
    res.json({ message: "Deleted" });
  } catch (error: any) {
    if (error.message === "Item not found") {
      return res.status(404).json({ message: "Item not found" });
    }
    if (error.message === "Forbidden") {
      return res.status(403).json({ message: "Forbidden" });
    }
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;