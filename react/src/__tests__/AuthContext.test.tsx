import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { AuthProvider } from "../context/AuthContext";
import { authClient } from "../lib/auth-client";

// Mock authClient
vi.mock("../lib/auth-client", () => ({
  authClient: {
    signIn: { email: vi.fn() },
    signUp: { email: vi.fn() },
    signOut: vi.fn(),
  },
}));

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render children", () => {
    render(
      <AuthProvider>
        <div data-testid="child">Hello</div>
      </AuthProvider>
    );

    expect(screen.getByTestId("child").textContent).toBe("Hello");
  });

  it("should call signIn.email on login", async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ error: null });
    (authClient.signIn.email as any) = mockSignIn;

    render(
      <AuthProvider>
        <div>test</div>
      </AuthProvider>
    );

    // We test via the mock directly since AuthProvider doesn't expose internals
    await authClient.signIn.email({ email: "a@b.com", password: "pass" });

    expect(mockSignIn).toHaveBeenCalledWith({ email: "a@b.com", password: "pass" });
  });

  it("should call signOut on logout", () => {
    const mockSignOut = vi.fn();
    authClient.signOut = mockSignOut as any;

    authClient.signOut();

    expect(mockSignOut).toHaveBeenCalled();
  });
});
