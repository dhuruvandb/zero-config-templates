import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";
import request from "supertest";

const testDbDir = process.env.TEST_DB_DIR || path.resolve(__dirname, "..", ".test-data");
if (!fs.existsSync(testDbDir)) {
    fs.mkdirSync(testDbDir, { recursive: true });
}

// Unique DB per test file — avoids EBUSY when test files run sequentially
const testDbPath = path.join(testDbDir, "items-test.db");
const testDbUrl = `file:${testDbPath}`;

// Point Prisma client to our test DB before importing the app
process.env.DATABASE_URL = testDbUrl;

// Remove stale DB from a previous test run
if (fs.existsSync(testDbPath)) {
    try { fs.unlinkSync(testDbPath); } catch { /* ignore EBUSY */ }
}

// Set required Better Auth env vars
process.env.BETTER_AUTH_SECRET = "test-secret-at-least-32-characters-long-for-better-auth";
process.env.BETTER_AUTH_URL = "http://localhost:5000";
process.env.NODE_ENV = "test";

execSync(
    `npx prisma db push --schema=prisma/schema.test.prisma --accept-data-loss`,
    {
        cwd: path.join(__dirname, ".."),
        env: { ...process.env, DATABASE_URL: testDbUrl },
        stdio: "pipe",
    }
);

import app from "../src/app";

const agent = request.agent(app);

describe("Items API (CRUD)", () => {
    let itemId: string;

    beforeAll(async () => {
        // Register + login to get a valid session
        const email = `crud-${Date.now()}@example.com`;
        await agent.post("/api/auth/sign-up/email").send({
            name: "Test User",
            email,
            password: "CrudTest1!",
        });
    });

    afterAll(() => {
        try {
            if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
            const journalPath = testDbPath + "-journal";
            if (fs.existsSync(journalPath)) fs.unlinkSync(journalPath);
        } catch {
            // ignore
        }
    });

    // ─── CREATE ────────────────────────────────────────────────

    describe("POST /api/items", () => {
        it("should create an item with auth", async () => {
            const res = await agent
                .post("/api/items")
                .send({ name: "Test Item" })
                .expect(201);

            expect(res.body).toHaveProperty("id");
            expect(res.body.name).toBe("Test Item");
            expect(res.body).toHaveProperty("createdAt");
            expect(res.body).toHaveProperty("userId");
            itemId = res.body.id;
        });

        it("should reject creation without auth", async () => {
            await request(app).post("/api/items").send({ name: "No Auth Item" }).expect(401);
        });
    });

    // ─── READ ──────────────────────────────────────────────────

    describe("GET /api/items", () => {
        it("should list items with auth", async () => {
            const res = await agent.get("/api/items").expect(200);

            expect(Array.isArray(res.body)).toBe(true);
            expect(res.body.length).toBeGreaterThanOrEqual(1);
        });

        it("should reject listing without auth", async () => {
            await request(app).get("/api/items").expect(401);
        });
    });

    // ─── UPDATE ────────────────────────────────────────────────

    describe("PUT /api/items/:id", () => {
        it("should update an item with auth", async () => {
            const res = await agent
                .put(`/api/items/${itemId}`)
                .send({ name: "Updated Item" })
                .expect(200);

            expect(res.body.name).toBe("Updated Item");
            expect(res.body.id).toBe(itemId);
        });

        it("should reject update without auth", async () => {
            await request(app).put(`/api/items/${itemId}`).send({ name: "Hacked" }).expect(401);
        });

        it("should return 404 for non-existent item", async () => {
            await agent
                .put("/api/items/nonexistent-id")
                .send({ name: "Ghost" })
                .expect(404);
        });
    });

    // ─── DELETE ────────────────────────────────────────────────

    describe("DELETE /api/items/:id", () => {
        it("should delete an item with auth", async () => {
            const res = await agent.delete(`/api/items/${itemId}`).expect(200);

            expect(res.body.message).toBe("Deleted");
        });

        it("should reject deletion without auth", async () => {
            await request(app).delete(`/api/items/${itemId}`).expect(401);
        });

        it("should return 404 for already deleted item", async () => {
            await agent.delete(`/api/items/${itemId}`).expect(404);
        });
    });
});
