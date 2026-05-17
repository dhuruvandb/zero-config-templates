// This file runs before ALL tests — env vars must be set before any imports
process.env.DATABASE_URL = "file:./.test-data/test.db";
process.env.ACCESS_TOKEN_SECRET = "test-access-secret-for-jest";
process.env.REFRESH_TOKEN_SECRET = "test-refresh-secret-for-jest";
process.env.ACCESS_TOKEN_EXPIRY = "15m";
process.env.REFRESH_TOKEN_EXPIRY = "7d";
process.env.NODE_ENV = "test";
process.env.PORT = "0";

// Quiet the logger during tests
process.env.LOG_LEVEL = "silent";
