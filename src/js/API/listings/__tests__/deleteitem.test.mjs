import { describe, it, expect, vi, beforeEach } from "vitest";
import { deleteItem } from "../deleteitem.mjs";
import { handleErrors } from "../../utils/handleerrors.mjs";

vi.mock("../utils/headers.mjs", () => ({
  headers: vi.fn(() => ({ "Content-Type": "application/json" })),
}));

vi.mock("../../utils/handleerrors.mjs", () => ({
  handleErrors: vi.fn(),
}));

global.fetch = vi.fn();

describe("deleteItem", () => {
  const mockItemId = "12345";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should delete an item successfully", async () => {
    // Mock fetch to return a successful response
    fetch.mockResolvedValue({ ok: true });

    // Call the deleteItem function
    await deleteItem(mockItemId);

    // Assertions
    expect(fetch).toHaveBeenCalledWith(
      `https://v2.api.noroff.dev/auction/listings/${mockItemId}`,
      {
        headers: expect.any(Headers), // Match any instance of the Headers class
        method: "DELETE",
      },
    );
    expect(handleErrors).not.toHaveBeenCalled();
  });

  it("should handle errors when the API response is not ok", async () => {
    // Mock fetch to return an error response
    const mockErrorResponse = {
      ok: false,
      status: 404,
      json: async () => ({ message: "Item not found" }),
    };
    fetch.mockResolvedValue(mockErrorResponse);

    // Call the deleteItem function and expect it to throw
    await expect(deleteItem(mockItemId)).rejects.toThrow();

    // Ensure handleErrors was called
    expect(handleErrors).toHaveBeenCalledWith(mockErrorResponse);
  });

  it("should handle network errors", async () => {
    // Mock fetch to throw a network error
    const mockError = new Error("Network error");
    fetch.mockRejectedValue(mockError);

    // Call the deleteItem function and expect it to throw
    await expect(deleteItem(mockItemId)).rejects.toThrow("Network error");

    // Ensure handleErrors was called
    expect(handleErrors).toHaveBeenCalledWith(mockError);
  });
});
