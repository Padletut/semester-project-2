import { describe, it, expect, vi, beforeEach } from "vitest";
import { getMyBids } from "../getmybids.mjs";
import { fetchData } from "../../utils/fetch.mjs";
import { renderErrors } from "../../../ui/shared/rendererrors.mjs";
import { loadStorage } from "../../../storage/loadstorage.mjs";

vi.mock("../../utils/fetch.mjs", () => ({
  fetchData: vi.fn(),
}));

vi.mock("../../../ui/shared/rendererrors.mjs", () => ({
  renderErrors: vi.fn(),
}));

vi.mock("../../../storage/loadstorage.mjs", () => ({
  loadStorage: vi.fn(),
}));

vi.mock("../utils/headers.mjs", () => ({
  headers: vi.fn(() => ({
    Authorization: "Bearer mock-access-token",
    "Content-Type": "application/json",
  })),
}));

describe("getMyBids", () => {
  const mockProfileName = "john_doe";
  const mockBids = [
    { id: 1, amount: 100, listing: { title: "Item 1" } },
    { id: 2, amount: 200, listing: { title: "Item 2" } },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch bids for the logged-in user", async () => {
    // Mock loadStorage to return the logged-in user's profile and token
    loadStorage.mockImplementation((key) => {
      if (key === "profile") return { name: mockProfileName };
      if (key === "accessToken") return "mock-access-token"; // Mock token
      return null;
    });

    // Mock fetchData to return a successful response
    fetchData.mockResolvedValue({
      ok: true,
      json: async () => mockBids,
    });

    const result = await getMyBids(mockProfileName);

    // Assertions
    expect(fetchData).toHaveBeenCalledWith(
      `https://v2.api.noroff.dev/auction/profiles/${mockProfileName}/bids?_listings=true`,
      {
        headers: expect.any(Headers), // Match any instance of the Headers class
        method: "GET",
      },
    );
    expect(result).toEqual(mockBids);
    expect(renderErrors).not.toHaveBeenCalled();
  });

  it("should fetch bids for a specific profile name", async () => {
    // Mock fetchData to return a successful response
    fetchData.mockResolvedValue({
      ok: true,
      json: async () => mockBids,
    });

    const result = await getMyBids("specific_user");

    // Assertions
    expect(fetchData).toHaveBeenCalledWith(
      `https://v2.api.noroff.dev/auction/profiles/specific_user/bids?_listings=true`,
      {
        headers: expect.any(Headers),
        method: "GET",
      },
    );
    expect(result).toEqual(mockBids);
    expect(renderErrors).not.toHaveBeenCalled();
  });

  it("should handle API errors gracefully", async () => {
    // Mock fetchData to return an unsuccessful response
    fetchData.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
    });

    const result = await getMyBids(mockProfileName);

    // Assertions
    expect(fetchData).toHaveBeenCalledWith(
      `https://v2.api.noroff.dev/auction/profiles/${mockProfileName}/bids?_listings=true`,
      {
        headers: expect.any(Headers),
        method: "GET",
      },
    );
    expect(result).toBeUndefined();
    expect(renderErrors).toHaveBeenCalledWith(
      new Error("We couldn't find the profile you were looking for."),
    );
  });

  it("should handle cases where the user is not logged in", async () => {
    // Mock loadStorage to return null (user not logged in)
    loadStorage.mockReturnValue(null);

    const result = await getMyBids();

    // Assertions
    expect(fetchData).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
    expect(renderErrors).toHaveBeenCalledWith(
      new Error("We couldn't find the profile you were looking for."),
    );
  });
});
