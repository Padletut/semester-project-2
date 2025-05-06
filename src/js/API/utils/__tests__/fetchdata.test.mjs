import { describe, it, expect, vi, afterEach } from "vitest";
import { fetchData } from "../fetchdata.mjs";
import { headers } from "../headers.mjs";
import { handleErrors } from "../handleerrors.mjs";

// Mock the `fetch` function globally
global.fetch = vi.fn();

vi.mock("../headers.mjs", () => ({
  headers: vi.fn((hasBody) =>
    hasBody ? { "Content-Type": "application/json" } : undefined,
  ),
}));

// Mock the `handleErrors` function
vi.mock("../handleerrors.mjs", () => ({
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

    // Mock handleErrors to return the response
    handleErrors.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });

    const response = await fetchData(mockUrl);

    // Assertions
    expect(fetch).toHaveBeenCalledWith(mockUrl, {
      headers: { "Content-Type": "application/json" },
    });
    expect(headers).toHaveBeenCalledWith(false); // No body for GET request
    expect(handleErrors).toHaveBeenCalledWith(expect.any(Object)); // Ensure handleErrors is called
    expect(response.ok).toBe(true);
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

    // Mock handleErrors to return the response
    handleErrors.mockResolvedValue({
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
    expect(handleErrors).toHaveBeenCalledWith(expect.any(Object)); // Ensure handleErrors is called
    expect(response.ok).toBe(true);
  });

  vi.mock("../headers.mjs", () => ({
    headers: vi.fn((hasBody) =>
      hasBody ? { "Content-Type": "application/json" } : undefined,
    ),
  }));

  it("should throw an error for non-2xx responses", async () => {
    // Mock the fetch response
    fetch.mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => ({ message: "Internal Server Error" }),
    });

    // Mock handleErrors to throw an error
    handleErrors.mockImplementation(() => {
      throw new Error(
        "Fetch request failed with status: 500 Internal Server Error",
      );
    });

    // Mock the headers function to return the expected headers
    headers.mockReturnValue({
      authorization: "Bearer <token>",
      "x-noroff-api-key": "<api-key>",
    });

    await expect(fetchData(mockUrl)).rejects.toThrow(
      "Fetch request failed with status: 500 Internal Server Error",
    );

    // Assertions
    expect(fetch).toHaveBeenCalledWith(mockUrl, {
      headers: {
        authorization: "Bearer <token>",
        "x-noroff-api-key": "<api-key>",
      },
    });
    expect(handleErrors).toHaveBeenCalledWith(expect.any(Object)); // Ensure handleErrors is called
  });
});
