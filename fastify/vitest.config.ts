import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        environment: "node",
        testTimeout: 15000,
        env: {
            DATABASE_URL: "file:./.test-data/test.db",
            ACCESS_TOKEN_SECRET: "test-access-secret-for-vitest",
            REFRESH_TOKEN_SECRET: "test-refresh-secret-for-vitest",
            ACCESS_TOKEN_EXPIRY: "15m",
            REFRESH_TOKEN_EXPIRY: "7d",
            NODE_ENV: "test",
            PORT: "0",
        },
    },
});
