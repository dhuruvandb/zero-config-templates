import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/__tests__"],
    testMatch: ["**/*.test.ts"],
    setupFiles: ["<rootDir>/__tests__/setup.ts"],
    testTimeout: 15000,
    transform: {
        "^.+\\.tsx?$": ["ts-jest", { useESM: true }],
        "^.+\\.m?js$": ["ts-jest", { useESM: true }],
    },
    transformIgnorePatterns: [
        "node_modules/(?!(better-auth|better-call|@better-auth)/)",
    ],
    moduleNameMapper: {
        "^(\\.{1,2}/.*)\\.js$": "$1",
    },
    // Run tests serially — test files share a SQLite database
    maxWorkers: 1,
};

export default config;
