import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: ['__tests__/**/*.spec.ts'],
        testTimeout: 15000,
        pool: 'forks',
        poolOptions: {
            forks: {
                singleFork: true,
            },
        },
        env: {
            BETTER_AUTH_SECRET: 'test-secret-at-least-32-characters-long-for-better-auth',
            BETTER_AUTH_URL: 'http://localhost:5000',
            NODE_ENV: 'test',
            PORT: '0',
        },
    },
});
