import { describe, it, expect, vi, beforeEach } from "vitest";
import { createItem } from "../createitem.mjs";
import { fetchData } from "../../utils/fetch.mjs";
import { handleErrors } from "../../utils/handleerrors.mjs";

vi.mock("../utils/headers.mjs", () => ({
  headers: vi.fn(() => ({ "Content-Type": "application/json" })),
}));

vi.mock("../../utils/fetch.mjs", () => ({
  fetchData: vi.fn(),
}));

vi.mock("../../utils/handleerrors.mjs", () => ({
  handleErrors: vi.fn(),
}));

describe("createItem", () => {
  const mockItem = {
    title: "Auction Item",
    description: "This is a great item.",
    tags: ["tag1", "tag2"],
    media: [{ url: "https://example.com/image.jpg", alt: "Example Image" }],
    endsAt: new Date().toISOString(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create an item and return the response on success", async () => {
    // Mock fetchData to return a successful response
    const mockResponse = {
      ok: true,
      json: async () => ({ id: 1, ...mockItem }),
    };
    fetchData.mockResolvedValue(mockResponse);

    // Call the createItem function
    const result = await createItem(mockItem);

    // Assertions
    expect(fetchData).toHaveBeenCalledWith(
      "https://v2.api.noroff.dev/auction/listings",
      {
        headers: expect.any(Headers), // Match any instance of the Headers class
        method: "POST",
        body: JSON.stringify(mockItem),
      },
    );
    expect(result).toEqual({ id: 1, ...mockItem });
  });

  it("should handle errors when the API response is not ok", async () => {
    // Mock fetchData to return an error response
    const mockErrorResponse = {
      ok: false,
      status: 400,
      json: async () => ({ message: "Invalid data" }),
    };
    fetchData.mockResolvedValue(mockErrorResponse);

    // Call the createItem function and expect it to throw
    await expect(createItem(mockItem)).rejects.toThrow();

    // Ensure handleErrors was called
    expect(handleErrors).toHaveBeenCalledWith(mockErrorResponse);
  });

  it("should handle network errors", async () => {
    // Mock fetchData to throw a network error
    const mockError = new Error("Network error");
    fetchData.mockRejectedValue(mockError);

    // Call the createItem function and expect it to throw
    await expect(createItem(mockItem)).rejects.toThrow("Network error");

    // Ensure handleErrors was called
    expect(handleErrors).toHaveBeenCalledWith(mockError);
  });
});
