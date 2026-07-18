import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "../stores/auth";
import { authClient } from "../lib/auth-client";

// Mock authClient
vi.mock("../lib/auth-client", () => ({
    authClient: {
        signIn: { email: vi.fn() },
        signUp: { email: vi.fn() },
        signOut: vi.fn(),
    },
}));

describe("AuthStore", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        vi.clearAllMocks();
    });

    it("should call signIn.email on login", async () => {
        const mockSignIn = vi.fn().mockResolvedValue({ error: null });
        (authClient.signIn.email as any) = mockSignIn;

        const store = useAuthStore();
        await store.login("a@b.com", "pass");

        expect(mockSignIn).toHaveBeenCalledWith({ email: "a@b.com", password: "pass" });
    });

    it("should throw on failed login", async () => {
        (authClient.signIn.email as any) = vi.fn().mockResolvedValue({
            error: { message: "Invalid credentials" },
        });

        const store = useAuthStore();
        await expect(store.login("a@b.com", "wrong")).rejects.toThrow(
            "Invalid credentials"
        );
    });

    it("should call signUp.email on register", async () => {
        const mockSignUp = vi.fn().mockResolvedValue({ error: null });
        (authClient.signUp.email as any) = mockSignUp;

        const store = useAuthStore();
        await store.register("a@b.com", "pass");

        expect(mockSignUp).toHaveBeenCalledWith({
            email: "a@b.com",
            password: "pass",
            name: "a",
        });
    });

    it("should call signOut on logout", () => {
        const store = useAuthStore();
        store.logout();

        expect(authClient.signOut).toHaveBeenCalled();
    });
});
