import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../src/app";
import { setupTestDb, teardownTestDb, authHeader } from "./helpers";
import type { FastifyInstance } from "fastify";

let app: FastifyInstance;
let authToken: string;
let itemId: string;

beforeAll(async () => {
    setupTestDb();
    app = await buildApp({ logger: false });
    await app.ready();

    // Register + login
    const email = `crud-${Date.now()}@example.com`;
    await app.inject({
        method: "POST",
        url: "/api/auth/register",
        payload: { email, password: "CrudTest1!" },
    });

    const loginRes = await app.inject({
        method: "POST",
        url: "/api/auth/login",
        payload: { email, password: "CrudTest1!" },
    });
    authToken = JSON.parse(loginRes.body).accessToken;
});

afterAll(async () => {
    await app.close();
    teardownTestDb();
});

describe("Items API (CRUD)", () => {
    // ─── CREATE ──────────────────────────────────────────

    describe("POST /api/items", () => {
        it("should create an item with auth", async () => {
            const res = await app.inject({
                method: "POST",
                url: "/api/items",
                headers: authHeader(authToken),
                payload: { name: "Test Item" },
            });

            expect(res.statusCode).toBe(201);
            const body = JSON.parse(res.body);
            expect(body).toHaveProperty("id");
            expect(body.name).toBe("Test Item");
            expect(body).toHaveProperty("createdAt");
            itemId = body.id;
        });

        it("should reject creation without auth", async () => {
            const res = await app.inject({
                method: "POST",
                url: "/api/items",
                payload: { name: "No Auth" },
            });
            expect(res.statusCode).toBe(401);
        });

        it("should reject creation with empty body", async () => {
            const res = await app.inject({
                method: "POST",
                url: "/api/items",
                headers: authHeader(authToken),
                payload: {},
            });
            expect(res.statusCode).toBe(400);
        });
    });

    // ─── READ ────────────────────────────────────────────

    describe("GET /api/items", () => {
        it("should list items with auth", async () => {
            const res = await app.inject({
                method: "GET",
                url: "/api/items",
                headers: authHeader(authToken),
            });

            expect(res.statusCode).toBe(200);
            const body = JSON.parse(res.body);
            expect(Array.isArray(body)).toBe(true);
            expect(body.length).toBeGreaterThanOrEqual(1);
        });

        it("should reject listing without auth", async () => {
            const res = await app.inject({
                method: "GET",
                url: "/api/items",
            });
            expect(res.statusCode).toBe(401);
        });
    });

    // ─── UPDATE ──────────────────────────────────────────

    describe("PUT /api/items/:id", () => {
        it("should update an item with auth", async () => {
            const res = await app.inject({
                method: "PUT",
                url: `/api/items/${itemId}`,
                headers: authHeader(authToken),
                payload: { name: "Updated Item" },
            });

            expect(res.statusCode).toBe(200);
            const body = JSON.parse(res.body);
            expect(body.name).toBe("Updated Item");
            expect(body.id).toBe(itemId);
        });

        it("should reject update without auth", async () => {
            const res = await app.inject({
                method: "PUT",
                url: `/api/items/${itemId}`,
                payload: { name: "Hacked" },
            });
            expect(res.statusCode).toBe(401);
        });

        it("should return 404 for non-existent item", async () => {
            const res = await app.inject({
                method: "PUT",
                url: "/api/items/nonexistent-id",
                headers: authHeader(authToken),
                payload: { name: "Ghost" },
            });
            expect(res.statusCode).toBe(404);
        });
    });

    // ─── DELETE ──────────────────────────────────────────

    describe("DELETE /api/items/:id", () => {
        it("should delete an item with auth", async () => {
            const res = await app.inject({
                method: "DELETE",
                url: `/api/items/${itemId}`,
                headers: authHeader(authToken),
            });

            expect(res.statusCode).toBe(204);
        });

        it("should reject deletion without auth", async () => {
            const res = await app.inject({
                method: "DELETE",
                url: `/api/items/${itemId}`,
            });
            expect(res.statusCode).toBe(401);
        });
    });
});
