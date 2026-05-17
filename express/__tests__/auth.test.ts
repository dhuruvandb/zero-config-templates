import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";
import request from "supertest";

// Push test DB schema before importing app (which creates Prisma client)
const testDbPath = path.join(__dirname, "..", ".test-data", "test.db");
const testDbDir = path.dirname(testDbPath);
if (!fs.existsSync(testDbDir)) {
    fs.mkdirSync(testDbDir, { recursive: true });
}

execSync(
    `npx prisma db push --schema=prisma/schema.test.prisma --accept-data-loss`,
    {
        cwd: path.join(__dirname, ".."),
        env: { ...process.env, DATABASE_URL: `file:${testDbPath}` },
        stdio: "pipe",
    }
);

// Now import app (Prisma client will use the SQLite URL from env)
import app from "../src/app";

const agent = request.agent(app);

describe("Auth API", () => {
    const testUser = {
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

    // ─── Register ───────────────────────────────────────────────

    describe("POST /api/auth/register", () => {
        it("should register a new user and return access token", async () => {
            const res = await agent
                .post("/api/auth/register")
                .send(testUser)
                .expect(200);

            expect(res.body).toHaveProperty("accessToken");
            expect(typeof res.body.accessToken).toBe("string");
            // Should set refresh token cookie
            const cookies = res.headers["set-cookie"];
            expect(cookies).toBeDefined();
            expect(cookies.some((c: string) => c.startsWith("jid="))).toBe(true);
        });

        it("should reject duplicate email", async () => {
            const res = await agent
                .post("/api/auth/register")
                .send(testUser)
                .expect(400);

            expect(res.body).toHaveProperty("message");
            expect(res.body.message).toMatch(/already exists/i);
        });

        it("should reject weak password (no uppercase)", async () => {
            const res = await agent
                .post("/api/auth/register")
                .send({ email: "weak@example.com", password: "weakpass1!" })
                .expect(400);

            expect(res.body.errors || res.body.message).toBeDefined();
        });

        it("should reject weak password (too short)", async () => {
            const res = await agent
                .post("/api/auth/register")
                .send({ email: "short@example.com", password: "Sh1!" })
                .expect(400);

            expect(res.body.errors || res.body.message).toBeDefined();
        });

        it("should reject invalid email", async () => {
            const res = await agent
                .post("/api/auth/register")
                .send({ email: "not-an-email", password: "ValidPass1!" })
                .expect(400);

            expect(res.body.errors || res.body.message).toBeDefined();
        });
    });

    // ─── Login ──────────────────────────────────────────────────

    describe("POST /api/auth/login", () => {
        it("should login with correct credentials", async () => {
            const res = await agent
                .post("/api/auth/login")
                .send(testUser)
                .expect(200);

            expect(res.body).toHaveProperty("accessToken");
            const cookies = res.headers["set-cookie"];
            expect(cookies).toBeDefined();
            expect(cookies.some((c: string) => c.startsWith("jid="))).toBe(true);
        });

        it("should reject wrong password", async () => {
            const res = await agent
                .post("/api/auth/login")
                .send({ email: testUser.email, password: "WrongPass1!" })
                .expect(400);

            expect(res.body.message).toMatch(/invalid credentials/i);
        });

        it("should reject non-existent email", async () => {
            const res = await agent
                .post("/api/auth/login")
                .send({ email: "nobody@example.com", password: "SomePass1!" })
                .expect(400);

            expect(res.body.message).toMatch(/invalid credentials/i);
        });

        it("should reject missing fields", async () => {
            await agent.post("/api/auth/login").send({}).expect(400);
        });
    });

    // ─── Protected Route ────────────────────────────────────────

    describe("GET /api/items (protected)", () => {
        it("should reject requests without a token (401)", async () => {
            await agent.get("/api/items").expect(401);
        });

        it("should reject requests with an invalid token (403)", async () => {
            await agent
                .get("/api/items")
                .set("Authorization", "Bearer invalid-token")
                .expect(403);
        });

        it("should accept requests with a valid token", async () => {
            // Login to get a fresh token
            const loginRes = await agent.post("/api/auth/login").send(testUser);
            const token = loginRes.body.accessToken;

            const res = await agent
                .get("/api/items")
                .set("Authorization", `Bearer ${token}`)
                .expect(200);

            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    // ─── Refresh Token ──────────────────────────────────────────

    describe("POST /api/auth/refresh", () => {
        it("should refresh the token and rotate", async () => {
            // Login to get the refresh cookie
            const loginRes = await agent.post("/api/auth/login").send(testUser);
            const cookies = loginRes.headers["set-cookie"];

            const res = await agent
                .post("/api/auth/refresh")
                .set("Cookie", cookies)
                .expect(200);

            expect(res.body).toHaveProperty("accessToken");
            // New cookie should be set
            const newCookies = res.headers["set-cookie"];
            expect(newCookies).toBeDefined();
        });

        it("should reject without a refresh cookie", async () => {
            await agent.post("/api/auth/refresh").expect(401);
        });
    });

    // ─── Logout ─────────────────────────────────────────────────

    describe("POST /api/auth/logout", () => {
        it("should logout and clear cookie", async () => {
            const loginRes = await agent.post("/api/auth/login").send(testUser);
            const cookies = loginRes.headers["set-cookie"];

            const res = await agent
                .post("/api/auth/logout")
                .set("Cookie", cookies)
                .expect(200);

            expect(res.body.message).toMatch(/logged out/i);
        });
    });

    // ─── Full Auth Flow ─────────────────────────────────────────

    describe("Full auth flow", () => {
        it("register → login → access → refresh → access again → logout", async () => {
            const user = {
                email: "flow@example.com",
                password: "FlowTest1!",
            };

            // Register
            const regRes = await agent.post("/api/auth/register").send(user);
            expect(regRes.status).toBe(200);
            const regCookies = regRes.headers["set-cookie"];

            // Login
            const loginRes = await agent.post("/api/auth/login").send(user);
            expect(loginRes.status).toBe(200);
            let token = loginRes.body.accessToken;
            let cookies = loginRes.headers["set-cookie"];

            // Access protected route
            const accessRes = await agent
                .get("/api/items")
                .set("Authorization", `Bearer ${token}`);
            expect(accessRes.status).toBe(200);

            // Refresh
            const refreshRes = await agent
                .post("/api/auth/refresh")
                .set("Cookie", cookies);
            expect(refreshRes.status).toBe(200);
            token = refreshRes.body.accessToken;
            cookies = refreshRes.headers["set-cookie"];

            // Access with new token
            const access2Res = await agent
                .get("/api/items")
                .set("Authorization", `Bearer ${token}`);
            expect(access2Res.status).toBe(200);

            // Logout
            const logoutRes = await agent
                .post("/api/auth/logout")
                .set("Cookie", cookies);
            expect(logoutRes.status).toBe(200);
        });
    });
});
