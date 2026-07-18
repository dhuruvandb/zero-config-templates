import { execSync } from "child_process";
import * as path from "path";
import * as fs from "fs";

const TEST_DB_DIR = path.join(__dirname, "..", ".test-data");

export function setupTestDb(): string {
    // Create temp directory for test DB
    if (!fs.existsSync(TEST_DB_DIR)) {
        fs.mkdirSync(TEST_DB_DIR, { recursive: true });
    }

    const dbPath = path.join(TEST_DB_DIR, `test-${Date.now()}.db`);
    const dbUrl = `file:${dbPath}`;

    // Push the schema to the SQLite database
    execSync(
        `npx prisma db push --schema=prisma/schema.test.prisma --accept-data-loss`,
        {
            cwd: path.join(__dirname, ".."),
            env: { ...process.env, DATABASE_URL: dbUrl },
            stdio: "pipe",
        }
    );

    return dbUrl;
}

export function teardownTestDb(dbUrl: string): void {
    // Extract the file path from the URL
    const filePath = dbUrl.replace("file:", "");
    if (fs.existsSync(filePath)) {
        try {
            fs.unlinkSync(filePath);
        } catch {
            // Ignore cleanup errors
        }
    }
}

// Helper to extract cookie from supertest response
export function extractCookie(res: any, name: string): string | null {
    const setCookieHeader = res.headers["set-cookie"];
    if (!setCookieHeader) return null;

    const cookies = Array.isArray(setCookieHeader)
        ? setCookieHeader
        : [setCookieHeader];

    for (const cookie of cookies) {
        const match = cookie.match(new RegExp(`${name}=([^;]+)`));
        if (match) return match[1];
    }
    return null;
}
