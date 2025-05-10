import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchData } from "../../fetchdata.mjs";
import { headers } from "../../headers.mjs";

// Mock the `fetch` function globally
global.fetch = vi.fn();

vi.mock("../../headers.mjs", () => ({
  headers: vi.fn((hasBody) =>
    hasBody ? { "Content-Type": "application/json" } : undefined,
  ),
}));

// Mock the `handleErrors` function
vi.mock("../../handleerrors.mjs", () => ({
  handleErrors: vi.fn(),
}));

describe("fetchData", () => {
  const mockUrl = "https://api.example.com/data";

  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks after each test
  });

  it("should make a GET request with the correct headers", async () => {
    // Mock the headers function
    headers.mockReturnValue({ "Content-Type": "application/json" });

    // Mock the fetch response
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const response = await fetchData(mockUrl);

    // Assertions
    expect(fetch).toHaveBeenCalledWith(mockUrl, {
      headers: { "Content-Type": "application/json" },
    });
    expect(headers).toHaveBeenCalledWith(false); // No body for GET request
    expect(response.ok).toBe(true); // Ensure the response is successful
  });

  it("should handle POST requests with a body", async () => {
    const mockBody = { key: "value" };

    // Mock the headers function
    headers.mockReturnValue({ "Content-Type": "application/json" });

    // Mock the fetch response
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const response = await fetchData(mockUrl, {
      method: "POST",
      body: JSON.stringify(mockBody),
    });

    // Assertions
    expect(fetch).toHaveBeenCalledWith(mockUrl, {
      method: "POST",
      body: JSON.stringify(mockBody),
      headers: { "Content-Type": "application/json" },
    });
    expect(headers).toHaveBeenCalledWith(true); // Body is present for POST request
    expect(response.ok).toBe(true); // Ensure the response is successful
  });

  vi.mock("../headers.mjs", () => ({
    headers: vi.fn((hasBody) =>
      hasBody ? { "Content-Type": "application/json" } : undefined,
    ),
  }));

  it("should handle non-2xx responses gracefully", async () => {
    // Mock the fetch response
    const mockErrorResponse = {
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ message: "Internal Server Error" }),
    };
    fetch.mockResolvedValue(mockErrorResponse);

    // Mock the headers function to return the expected headers
    headers.mockReturnValue({
      authorization: "Bearer <token>",
      "x-noroff-api-key": "<api-key>",
    });

    const response = await fetchData(mockUrl);

    // Assertions
    expect(fetch).toHaveBeenCalledWith(mockUrl, {
      headers: {
        authorization: "Bearer <token>",
        "x-noroff-api-key": "<api-key>",
      },
    });
    expect(response).toEqual(mockErrorResponse); // Ensure the response is returned as-is
  });
});
