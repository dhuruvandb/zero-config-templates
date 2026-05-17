import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, AuthContext } from "../context/AuthContext";
import { useContext } from "react";

// Mock the api module
vi.mock("../api/api", () => ({
  default: {
    post: vi.fn(),
    authGet: vi.fn(),
    authDelete: vi.fn(),
  },
}));

// Test component that reads context
function TestConsumer() {
  const auth = useContext(AuthContext);
  if (!auth) return <div>No auth context</div>;

  return (
    <div>
      <div data-testid="token">{auth.accessToken ?? "null"}</div>
      <button onClick={() => auth.login("a@b.com", "pass")}>Login</button>
      <button onClick={() => auth.register("a@b.com", "pass")}>Register</button>
      <button onClick={() => auth.logout()}>Logout</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should initialize with null token when localStorage is empty", () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("token").textContent).toBe("null");
  });

  it("should restore token from localStorage on mount", () => {
    localStorage.setItem("token", "saved-token");

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("token").textContent).toBe("saved-token");
  });

  it("should update token after login", async () => {
    const api = (await import("../api/api")).default;
    (api.post as any).mockResolvedValue({ accessToken: "new-token" });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByTestId("token").textContent).toBe("new-token");
    });
    expect(localStorage.getItem("token")).toBe("new-token");
  });

  it("should clear token after logout", async () => {
    localStorage.setItem("token", "existing-token");

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    expect(screen.getByTestId("token").textContent).toBe("existing-token");

    await userEvent.click(screen.getByText("Logout"));

    expect(screen.getByTestId("token").textContent).toBe("null");
    expect(localStorage.getItem("token")).toBeNull();
  });

  it("should throw error on failed login", async () => {
    const api = (await import("../api/api")).default;
    (api.post as any).mockResolvedValue({ message: "Invalid credentials" });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>
    );

    await userEvent.click(screen.getByText("Login"));

    await waitFor(() => {
      expect(screen.getByTestId("token").textContent).toBe("null");
    });
  });
});
