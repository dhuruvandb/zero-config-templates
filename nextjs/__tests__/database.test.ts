import { describe, it, expect, beforeAll, afterAll } from "vitest";
import * as path from "path";
import * as fs from "fs";
import Database from "better-sqlite3";

let db: any;

beforeAll(() => {
    // Use in-memory database for testing — no file cleanup needed
    db = new Database(":memory:");
    db.pragma("foreign_keys = ON");

    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
    db.exec(`
    CREATE TABLE IF NOT EXISTS items (
      _id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      userId TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);
});

afterAll(() => {
    if (db) db.close();
});

// Helper: generate timestamp-based IDs
const id = () => Date.now().toString() + Math.random().toString(36).slice(2);

describe("Next.js Database Operations", () => {
    let userId: string;

    // ─── User Operations ──────────────────────────────

    describe("User operations", () => {
        it("should create a user", () => {
            const uid = id();
            const stmt = db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)");
            stmt.run(uid, "test@example.com", "password123");

            const user = db.prepare("SELECT * FROM users WHERE email = ?").get("test@example.com");
            expect(user).toBeDefined();
            expect(user.email).toBe("test@example.com");
            userId = uid;
        });

        it("should detect existing user", () => {
            const result = db.prepare("SELECT id FROM users WHERE email = ?").get("test@example.com");
            expect(result).toBeDefined();
        });

        it("should return null for non-existent user", () => {
            const result = db.prepare("SELECT id FROM users WHERE email = ?").get("nobody@example.com");
            expect(result).toBeUndefined();
        });

        it("should get user by email and password", () => {
            const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?")
                .get("test@example.com", "password123");
            expect(user).toBeDefined();
            expect(user.id).toBe(userId);
        });

        it("should reject wrong password", () => {
            const user = db.prepare("SELECT * FROM users WHERE email = ? AND password = ?")
                .get("test@example.com", "wrongpass");
            expect(user).toBeUndefined();
        });

        it("should reject duplicate email", () => {
            const uid = id();
            expect(() => {
                db.prepare("INSERT INTO users (id, email, password) VALUES (?, ?, ?)")
                    .run(uid, "test@example.com", "anotherpass");
            }).toThrow();
        });

        it("should get user ID by email", () => {
            const user = db.prepare("SELECT id FROM users WHERE email = ?").get("test@example.com");
            expect(user.id).toBe(userId);
        });
    });

    // ─── Item Operations ──────────────────────────────

    describe("Item CRUD", () => {
        let itemId: string;

        it("should create an item", () => {
            itemId = id();
            db.prepare("INSERT INTO items (_id, name, userId) VALUES (?, ?, ?)")
                .run(itemId, "Test Item", userId);

            const item = db.prepare("SELECT * FROM items WHERE _id = ?").get(itemId);
            expect(item).toBeDefined();
            expect(item.name).toBe("Test Item");
            expect(item.userId).toBe(userId);
        });

        it("should list items by user", () => {
            const items = db.prepare("SELECT _id, name FROM items WHERE userId = ?").all(userId);
            expect(Array.isArray(items)).toBe(true);
            expect(items.length).toBeGreaterThanOrEqual(1);
            expect(items[0]).toHaveProperty("name");
        });

        it("should return empty list for user with no items", () => {
            const items = db.prepare("SELECT _id, name FROM items WHERE userId = ?")
                .all("nonexistent-user");
            expect(items).toEqual([]);
        });

        it("should update an item", () => {
            const result = db.prepare("UPDATE items SET name = ? WHERE _id = ? AND userId = ?")
                .run("Updated Item", itemId, userId);
            expect(result.changes).toBe(1);
        });

        it("should not update other user's item", () => {
            const result = db.prepare("UPDATE items SET name = ? WHERE _id = ? AND userId = ?")
                .run("Hacked", itemId, "other-user");
            expect(result.changes).toBe(0);
        });

        it("should delete an item", () => {
            const result = db.prepare("DELETE FROM items WHERE _id = ? AND userId = ?")
                .run(itemId, userId);
            expect(result.changes).toBe(1);
        });

        it("should not delete other user's item", () => {
            // Create item
            const id2 = id();
            db.prepare("INSERT INTO items (_id, name, userId) VALUES (?, ?, ?)")
                .run(id2, "Another", userId);

            // Try to delete as other user
            const result = db.prepare("DELETE FROM items WHERE _id = ? AND userId = ?")
                .run(id2, "other-user");
            expect(result.changes).toBe(0);

            // Clean up as owner
            db.prepare("DELETE FROM items WHERE _id = ? AND userId = ?").run(id2, userId);
        });
    });
});
