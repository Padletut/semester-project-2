import { describe, it, expect, vi, beforeEach } from "vitest";
import { createBid } from "../../createbid.mjs";
import { handleErrors } from "../../../utils/handleerrors.mjs";

vi.mock("../../../utils/headers.mjs", () => ({
  headers: vi.fn(() => ({ "Content-Type": "application/json" })),
}));

vi.mock("../../../utils/handleerrors.mjs", () => ({
  handleErrors: vi.fn(async (response) => {
    const errorData = await response.json();
    throw new Error(errorData.message || "An error occurred");
  }),
}));

describe("createBid", () => {
  const itemId = "12345";
  const amount = 100;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should create a bid successfully", async () => {
    // Mock fetch to return a successful response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        status: 204, // No Content
      }),
    );

    await expect(createBid(itemId, amount)).resolves.toBeUndefined();

    // Assertions
    expect(fetch).toHaveBeenCalledWith(
      `https://v2.api.noroff.dev/auction/listings/${itemId}/bids`, // Updated URL
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      },
    );
    expect(handleErrors).not.toHaveBeenCalled();
  });

  it("should call handleErrors if the response is not ok", async () => {
    // Mock fetch to return an unsuccessful response
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 400,
        json: async () => ({ message: "Bid amount is too low" }),
      }),
    );

    await expect(createBid(itemId, amount)).rejects.toThrow(
      "Bid amount is too low",
    );

    // Assertions
    expect(fetch).toHaveBeenCalledWith(
      `https://v2.api.noroff.dev/auction/listings/${itemId}/bids`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      },
    );
  });

  it("should handle network errors", async () => {
    // Mock fetch to throw a network error
    global.fetch = vi.fn(() => Promise.reject(new Error("Network error")));

    await expect(createBid(itemId, amount)).rejects.toThrow("Network error");

    // Assertions
    expect(fetch).toHaveBeenCalledWith(
      `https://v2.api.noroff.dev/auction/listings/${itemId}/bids`, // Corrected URL
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      },
    );
    expect(handleErrors).not.toHaveBeenCalled(); // handleErrors is not called for network errors
  });
});
