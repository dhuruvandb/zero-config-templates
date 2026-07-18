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
const testDbPath = path.join(testDbDir, "auth-test.db");
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

let app: any;
let agent: any;

beforeAll(async () => {
    // Dynamic import ensures env vars are set before app initialization
    const mod = await import("../src/app");
    app = mod.default || mod.app;
    agent = request.agent(app);
});

describe("Auth API (Better Auth)", () => {
    const testUser = {
        name: "Test User",
        email: "test@example.com",
        password: "TestPass123!",
    };

    afterAll(() => {
        // Clean up test DB
        try {
            if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
            const journalPath = testDbPath + "-journal";
            if (fs.existsSync(journalPath)) fs.unlinkSync(journalPath);
        } catch {
            // ignore cleanup errors
        }
    });

    // ─── Sign Up ──────────────────────────────────────────────

    describe("POST /api/auth/sign-up/email", () => {
        it("should register a new user and return session cookie", async () => {
            const res = await agent
                .post("/api/auth/sign-up/email")
                .send({
                    name: testUser.name,
                    email: testUser.email,
                    password: testUser.password,
                })
                .expect(200);

            expect(res.body).toHaveProperty("user");
            expect(res.body.user.email).toBe(testUser.email);
            expect(res.body.user.name).toBe(testUser.name);
            // Better Auth sets session cookie
            const cookies = res.headers["set-cookie"];
            expect(cookies).toBeDefined();
        });

        it("should reject duplicate email", async () => {
            const res = await agent
                .post("/api/auth/sign-up/email")
                .send({
                    name: testUser.name,
                    email: testUser.email,
                    password: testUser.password,
                })
                .expect(422);

            expect(res.body).toHaveProperty("message");
        });
    });

    // ─── Sign In ──────────────────────────────────────────────

    describe("POST /api/auth/sign-in/email", () => {
        it("should sign in with correct credentials", async () => {
            const res = await agent
                .post("/api/auth/sign-in/email")
                .send({
                    email: testUser.email,
                    password: testUser.password,
                })
                .expect(200);

            expect(res.body).toHaveProperty("user");
            expect(res.body.user.email).toBe(testUser.email);
            const cookies = res.headers["set-cookie"];
            expect(cookies).toBeDefined();
        });

        it("should reject wrong password", async () => {
            const res = await agent
                .post("/api/auth/sign-in/email")
                .send({ email: testUser.email, password: "WrongPass1!" })
                .expect(401);

            expect(res.body).toHaveProperty("message");
        });

        it("should reject non-existent email", async () => {
            const res = await agent
                .post("/api/auth/sign-in/email")
                .send({ email: "nobody@example.com", password: "SomePass1!" })
                .expect(401);

            expect(res.body).toHaveProperty("message");
        });
    });

    // ─── Protected Route ──────────────────────────────────────

    describe("GET /api/items (protected)", () => {
        it("should reject requests without a session (401)", async () => {
            await request(app).get("/api/items").expect(401);
        });

        it("should accept requests with a valid session", async () => {
            // Login to get session cookie
            await agent.post("/api/auth/sign-in/email").send({
                email: testUser.email,
                password: testUser.password,
            });

            const res = await agent.get("/api/items").expect(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    // ─── Session ──────────────────────────────────────────────

    describe("GET /api/auth/get-session", () => {
        it("should return the current session", async () => {
            const res = await agent.get("/api/auth/get-session").expect(200);

            expect(res.body).toHaveProperty("user");
            expect(res.body.user.email).toBe(testUser.email);
            expect(res.body).toHaveProperty("session");
        });
    });

    // ─── Sign Out ─────────────────────────────────────────────

    describe("POST /api/auth/sign-out", () => {
        it("should sign out and clear session", async () => {
            const res = await agent.post("/api/auth/sign-out").expect(200);

            expect(res.body).toHaveProperty("success", true);
        });

        it("should reject access after sign out", async () => {
            await agent.get("/api/items").expect(401);
        });
    });
});
