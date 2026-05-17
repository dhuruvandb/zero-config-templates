import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";
import type { FastifyInstance } from "fastify";

const TEST_DB_DIR = path.join(__dirname, "..", ".test-data");
const TEST_DB_PATH = path.join(TEST_DB_DIR, "test.db");

export function setupTestDb(): void {
    if (!fs.existsSync(TEST_DB_DIR)) {
        fs.mkdirSync(TEST_DB_DIR, { recursive: true });
    }

    // Remove old DB if exists
    try { fs.unlinkSync(TEST_DB_PATH); } catch { /* ok */ }
    try { fs.unlinkSync(TEST_DB_PATH + "-journal"); } catch { /* ok */ }

    execSync(
        `npx prisma db push --schema=prisma/schema.test.prisma --accept-data-loss`,
        {
            cwd: path.join(__dirname, ".."),
            env: { ...process.env, DATABASE_URL: `file:${TEST_DB_PATH}` },
            stdio: "pipe",
        }
    );
}

export function teardownTestDb(): void {
    try { fs.unlinkSync(TEST_DB_PATH); } catch { /* ok */ }
    try { fs.unlinkSync(TEST_DB_PATH + "-journal"); } catch { /* ok */ }
}

// Helper to make authed requests easier
export function authHeader(token: string): Record<string, string> {
    return { Authorization: `Bearer ${token}` };
}
