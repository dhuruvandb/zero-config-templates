import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ItemsComponent from "../components/Items/Items";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock api module helper
vi.mock("../api/api", () => ({
  default: {
    post: vi.fn(),
    authGet: vi.fn(),
    authDelete: vi.fn().mockResolvedValue({}),
  },
}));

describe("ItemsComponent", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch and display items on mount", async () => {
    const api = (await import("../api/api")).default;
    (api.authGet as any).mockResolvedValue([
      { _id: "1", name: "Item 1" },
      { _id: "2", name: "Item 2" },
    ]);

    render(<ItemsComponent accessToken="test-token" />);

    await waitFor(() => {
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
    });
  });

  it("should show empty state when no items", async () => {
    const api = (await import("../api/api")).default;
    (api.authGet as any).mockResolvedValue([]);

    render(<ItemsComponent accessToken="test-token" />);

    await waitFor(() => {
      // The list should be empty (no list items rendered)
      const listItems = screen.queryAllByRole("listitem");
      expect(listItems.length).toBe(0);
    });
  });

  it("should add a new item", async () => {
    const api = (await import("../api/api")).default;
    (api.authGet as any).mockResolvedValue([]);
    mockFetch.mockResolvedValue({
      json: () => Promise.resolve({ _id: "3", name: "New Item" }),
    });

    render(<ItemsComponent accessToken="test-token" />);

    const input = screen.getByPlaceholderText("New item name");
    await userEvent.type(input, "New Item");
    await userEvent.click(screen.getByText("Add"));

    await waitFor(() => {
      expect(screen.getByText("New Item")).toBeInTheDocument();
    });
  });

  it("should delete an item", async () => {
    const api = (await import("../api/api")).default;
    (api.authGet as any).mockResolvedValue([
      { _id: "1", name: "Item to Delete" },
    ]);
    (api.authDelete as any).mockResolvedValue({});

    render(<ItemsComponent accessToken="test-token" />);

    await waitFor(() => {
      expect(screen.getByText("Item to Delete")).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText("Delete"));

    await waitFor(() => {
      expect(screen.queryByText("Item to Delete")).not.toBeInTheDocument();
    });
  });
});
