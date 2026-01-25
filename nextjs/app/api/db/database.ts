import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ITEMS_FILE = path.join(DATA_DIR, "items.json");

interface User {
  id: string;
  email: string;
  password: string;
}

interface Item {
  _id: string;
  name: string;
  userId: string;
}

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Read users from file
export function getUsers(): User[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}

// Save users to file
export function saveUsers(users: User[]) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Add a new user
export function addUser(email: string, password: string): User {
  const users = getUsers();
  const user: User = {
    id: Date.now().toString(),
    email,
    password,
  };
  users.push(user);
  saveUsers(users);
  return user;
}

// Find user by email and password
export function findUser(email: string, password: string): User | null {
  const users = getUsers();
  return users.find((u) => u.email === email && u.password === password) || null;
}

// Check if user exists
export function userExists(email: string): boolean {
  const users = getUsers();
  return users.some((u) => u.email === email);
}

// Read items from file
export function getItems(): Item[] {
  ensureDataDir();
  if (!fs.existsSync(ITEMS_FILE)) {
    fs.writeFileSync(ITEMS_FILE, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(ITEMS_FILE, "utf-8"));
}

// Save items to file
export function saveItems(items: Item[]) {
  ensureDataDir();
  fs.writeFileSync(ITEMS_FILE, JSON.stringify(items, null, 2));
}

// Add a new item
export function addItem(name: string, userId: string): Item {
  const items = getItems();
  const item: Item = {
    _id: Date.now().toString(),
    name,
    userId,
  };
  items.push(item);
  saveItems(items);
  return item;
}

// Get items by user ID
export function getItemsByUserId(userId: string): Item[] {
  const items = getItems();
  return items.filter((item) => item.userId === userId);
}

// Delete item by ID
export function deleteItem(itemId: string, userId: string): boolean {
  const items = getItems();
  const index = items.findIndex((i) => i._id === itemId && i.userId === userId);
  if (index === -1) return false;
  items.splice(index, 1);
  saveItems(items);
  return true;
}
