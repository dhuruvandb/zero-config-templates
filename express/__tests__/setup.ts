// This file runs before ALL tests — env vars must be set before any imports
import * as path from "path";
process.env.TEST_DB_DIR = path.resolve(__dirname, "..", ".test-data");
// BASE_DATABASE_URL is a template — each test file replaces {id} with its own name
process.env.DATABASE_URL = `file:${path.resolve(process.env.TEST_DB_DIR, "test.db")}`;
process.env.ACCESS_TOKEN_SECRET = "test-access-secret-for-jest";
process.env.REFRESH_TOKEN_SECRET = "test-refresh-secret-for-jest";
process.env.ACCESS_TOKEN_EXPIRY = "15m";
process.env.REFRESH_TOKEN_EXPIRY = "7d";
process.env.NODE_ENV = "test";
process.env.PORT = "0";

// Quiet the logger during tests
process.env.LOG_LEVEL = "silent";
