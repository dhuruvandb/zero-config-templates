import { describe, it, expect, vi, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useAuthStore } from "../stores/auth";

// Mock the api module
vi.mock("../api/api", () => ({
    default: {
        post: vi.fn(),
        authGet: vi.fn(),
        authDelete: vi.fn(),
    },
}));

describe("AuthStore", () => {
    beforeEach(() => {
        setActivePinia(createPinia());
        localStorage.clear();
    });

    it("should initialize with null token when localStorage is empty", () => {
        const store = useAuthStore();
        expect(store.accessToken).toBeNull();
    });

    it("should restore token from localStorage", () => {
        localStorage.setItem("token", "saved-token");

        const store = useAuthStore();
        expect(store.accessToken).toBe("saved-token");
    });

    it("should set token after login", async () => {
        const api = (await import("../api/api")).default;
        (api.post as any).mockResolvedValue({ accessToken: "new-token" });

        const store = useAuthStore();
        await store.login("a@b.com", "pass");

        expect(store.accessToken).toBe("new-token");
        expect(localStorage.getItem("token")).toBe("new-token");
    });

    it("should throw on failed login", async () => {
        const api = (await import("../api/api")).default;
        (api.post as any).mockResolvedValue({ message: "Invalid credentials" });

        const store = useAuthStore();
        await expect(store.login("a@b.com", "wrong")).rejects.toThrow(
            "Invalid credentials"
        );
        expect(store.accessToken).toBeNull();
    });

    it("should clear token after logout", () => {
        localStorage.setItem("token", "existing-token");

        const store = useAuthStore();
        store.accessToken = "existing-token";
        store.logout();

        expect(store.accessToken).toBeNull();
        expect(localStorage.getItem("token")).toBeNull();
    });
});
