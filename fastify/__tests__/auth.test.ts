import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../src/app";
import { setupTestDb, teardownTestDb, authHeader } from "./helpers";
import type { FastifyInstance } from "fastify";

let app: FastifyInstance;

beforeAll(async () => {
    setupTestDb();
    app = await buildApp({ logger: false });
    await app.ready();
});

afterAll(async () => {
    await app.close();
    teardownTestDb();
});

const testUser = {
    email: "auth-test@example.com",
    password: "TestPass123!",
};

describe("Auth API", () => {
    // ─── Register ────────────────────────────────────────

    describe("POST /api/auth/register", () => {
        it("should register a new user", async () => {
            const res = await app.inject({
                method: "POST",
                url: "/api/auth/register",
                payload: testUser,
            });

            expect(res.statusCode).toBe(200);
            const body = JSON.parse(res.body);
            expect(body).toHaveProperty("accessToken");
            expect(typeof body.accessToken).toBe("string");
            expect(res.cookies.some((c) => c.name === "jid")).toBe(true);
        });

        it("should reject duplicate email", async () => {
            const res = await app.inject({
                method: "POST",
                url: "/api/auth/register",
                payload: testUser,
            });

            expect(res.statusCode).toBe(400);
            const body = JSON.parse(res.body);
            expect(body.message).toMatch(/already exists/i);
        });

        it("should reject weak password", async () => {
            const res = await app.inject({
                method: "POST",
                url: "/api/auth/register",
                payload: { email: "weak@example.com", password: "short" },
            });

            expect(res.statusCode).toBe(400);
        });
    });

    // ─── Login ───────────────────────────────────────────

    describe("POST /api/auth/login", () => {
        it("should login with correct credentials", async () => {
            const res = await app.inject({
                method: "POST",
                url: "/api/auth/login",
                payload: testUser,
            });

            expect(res.statusCode).toBe(200);
            const body = JSON.parse(res.body);
            expect(body).toHaveProperty("accessToken");
            expect(res.cookies.some((c) => c.name === "jid")).toBe(true);
        });

        it("should reject wrong password", async () => {
            const res = await app.inject({
                method: "POST",
                url: "/api/auth/login",
                payload: { email: testUser.email, password: "WrongPass1!" },
            });

            expect(res.statusCode).toBe(401);
        });
    });

    // ─── Protected Route ─────────────────────────────────

    describe("GET /api/items (protected)", () => {
        it("should reject without token (401)", async () => {
            const res = await app.inject({
                method: "GET",
                url: "/api/items",
            });
            expect(res.statusCode).toBe(401);
        });

        it("should accept with valid token", async () => {
            const loginRes = await app.inject({
                method: "POST",
                url: "/api/auth/login",
                payload: testUser,
            });
            const token = JSON.parse(loginRes.body).accessToken;

            const res = await app.inject({
                method: "GET",
                url: "/api/items",
                headers: authHeader(token),
            });
            expect(res.statusCode).toBe(200);
            expect(Array.isArray(JSON.parse(res.body))).toBe(true);
        });
    });

    // ─── Refresh ─────────────────────────────────────────

    describe("POST /api/auth/refresh", () => {
        it("should refresh token", async () => {
            const loginRes = await app.inject({
                method: "POST",
                url: "/api/auth/login",
                payload: testUser,
            });
            const jid = loginRes.cookies.find((c) => c.name === "jid")?.value;

            const res = await app.inject({
                method: "POST",
                url: "/api/auth/refresh",
                cookies: { jid: jid! },
            });

            expect(res.statusCode).toBe(200);
            const body = JSON.parse(res.body);
            expect(body).toHaveProperty("accessToken");
        });

        it("should reject without cookie", async () => {
            const res = await app.inject({
                method: "POST",
                url: "/api/auth/refresh",
            });
            expect(res.statusCode).toBe(401);
        });
    });

    // ─── Logout ──────────────────────────────────────────

    describe("POST /api/auth/logout", () => {
        it("should logout successfully", async () => {
            const loginRes = await app.inject({
                method: "POST",
                url: "/api/auth/login",
                payload: testUser,
            });
            const jid = loginRes.cookies.find((c) => c.name === "jid")?.value;

            const res = await app.inject({
                method: "POST",
                url: "/api/auth/logout",
                cookies: { jid: jid! },
            });

            expect(res.statusCode).toBe(200);
        });
    });

    // ─── Full Flow ───────────────────────────────────────

    describe("Full auth flow", () => {
        it("register → login → access → refresh → access → logout", async () => {
            const user = {
                email: "flow-test@example.com",
                password: "FlowTest1!",
            };

            // Register
            const regRes = await app.inject({
                method: "POST",
                url: "/api/auth/register",
                payload: user,
            });
            expect(regRes.statusCode).toBe(200);

            // Login
            const loginRes = await app.inject({
                method: "POST",
                url: "/api/auth/login",
                payload: user,
            });
            expect(loginRes.statusCode).toBe(200);
            let token = JSON.parse(loginRes.body).accessToken;
            const jid = loginRes.cookies.find((c) => c.name === "jid")?.value;

            // Access
            const accessRes = await app.inject({
                method: "GET",
                url: "/api/items",
                headers: authHeader(token!),
            });
            expect(accessRes.statusCode).toBe(200);

            // Refresh
            const refreshRes = await app.inject({
                method: "POST",
                url: "/api/auth/refresh",
                cookies: { jid: jid! },
            });
            expect(refreshRes.statusCode).toBe(200);
            token = JSON.parse(refreshRes.body).accessToken;

            // Access again
            const access2Res = await app.inject({
                method: "GET",
                url: "/api/items",
                headers: authHeader(token!),
            });
            expect(access2Res.statusCode).toBe(200);

            // Logout
            const logoutRes = await app.inject({
                method: "POST",
                url: "/api/auth/logout",
                cookies: { jid: jid! },
            });
            expect(logoutRes.statusCode).toBe(200);
        });
    });
});
