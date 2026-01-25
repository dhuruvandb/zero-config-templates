// Shared in-memory storage (replace with real database in production)

interface User {
  email: string;
  password: string;
}

interface Item {
  _id: string;
  name: string;
  userId: string;
}

// Shared storage across all API routes
export const users: User[] = [];
export const items: Item[] = [];
export let itemIdCounter = 1;

export function incrementItemId() {
  return itemIdCounter++;
}
