import { createAuthClient } from 'better-auth';

export const authClient = createAuthClient({
    baseURL: 'http://localhost:5000',
});
