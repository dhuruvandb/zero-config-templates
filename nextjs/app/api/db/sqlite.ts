import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import bcrypt from "bcrypt";

const dbPath = path.join(process.cwd(), ".data", "app.db");

let db: Database | null = null;

export function getDb(): Database {
  if (!db) {
    // Create .data directory if it doesn't exist
    const dataDir = path.dirname(dbPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
    initializeDatabase();
  }
  return db;
}

export function initializeDatabase() {
  const db = getDb();

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create items table
  db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      _id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      userId TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
}

// User operations
export async function validateUserCredentials(email: string, password: string) {
  const db = getDb();
  const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
  const user = stmt.get(email) as { id: string; email: string; password: string } | undefined;
  
  if (!user) {
    return null;
  }
  
  const isValid = await bcrypt.compare(password, user.password);
  return isValid ? user : null;
}

export function userExists(email: string) {
  const db = getDb();
  const stmt = db.prepare("SELECT id FROM users WHERE email = ?");
  return stmt.get(email) !== undefined;
}

export function getUserIdByEmail(email: string) {
  const db = getDb();
  const stmt = db.prepare("SELECT id FROM users WHERE email = ?");
  const user = stmt.get(email);
  return user ? user.id : null;
}

export async function createUser(email: string, password: string) {
  const db = getDb();
  const id = Date.now().toString();
  const hashedPassword = await bcrypt.hash(password, 10);
  
  try {
    const stmt = db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)");
    stmt.run(id, email, hashedPassword);
    return { id, email };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Item operations
export function getItemsByUserId(userId: string) {
  const db = getDb();
  const stmt = db.prepare("SELECT _id, name FROM items WHERE userId = ?");
  return stmt.all(userId);
}

export function createItem(userId: string, name: string) {
  const db = getDb();
  const _id = Date.now().toString();
  try {
    const stmt = db.prepare("INSERT INTO items (_id, name, userId) VALUES (?, ?, ?)");
    stmt.run(_id, name, userId);
    return { _id, name, userId };
  } catch (error) {
    console.error("Error creating item:", error);
    throw error;
  }
}

export function deleteItem(_id: string, userId: string) {
  const db = getDb();
  const stmt = db.prepare("DELETE FROM items WHERE _id = ? AND userId = ?");
  const result = stmt.run(_id, userId);
  return result.changes > 0;
}

export function updateItem(_id: string, userId: string, name: string) {
  const db = getDb();
  try {
    const stmt = db.prepare("UPDATE items SET name = ? WHERE _id = ? AND userId = ?");
    const result = stmt.run(name, _id, userId);
    return result.changes > 0;
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
}
