import type { Config } from "jest";

const config: Config = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/__tests__"],
    testMatch: ["**/*.test.ts"],
    setupFiles: ["<rootDir>/__tests__/setup.ts"],
    testTimeout: 15000,
};

export default config;
