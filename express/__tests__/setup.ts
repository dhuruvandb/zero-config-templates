// This file runs before ALL tests — env vars must be set before any imports
import * as path from "path";
process.env.TEST_DB_DIR = path.resolve(__dirname, "..", ".test-data");
// BASE_DATABASE_URL is a template — each test file replaces {id} with its own name
process.env.DATABASE_URL = `file:${path.resolve(process.env.TEST_DB_DIR, "test.db")}`;
process.env.BETTER_AUTH_SECRET = "test-secret-at-least-32-characters-long-for-better-auth";
process.env.BETTER_AUTH_URL = "http://localhost:5000";
process.env.NODE_ENV = "test";
process.env.PORT = "0";

// Quiet the logger during tests
process.env.LOG_LEVEL = "silent";
