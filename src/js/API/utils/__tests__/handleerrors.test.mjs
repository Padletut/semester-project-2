import { describe, it, expect, vi } from "vitest";
import { handleErrors } from "../handleerrors.mjs";
import { renderErrors } from "../../../ui/shared/rendererrors.mjs";
import { ERROR_MESSAGES } from "../errormessages.mjs";

// Mock the renderErrors function
vi.mock("../../../ui/shared/rendererrors.mjs", () => ({
  renderErrors: vi.fn(),
}));

describe("handleErrors", () => {
  it("should return the response if response.ok is true", async () => {
    const mockResponse = { ok: true };
    const result = await handleErrors(mockResponse);
    expect(result).toBe(mockResponse);
  });

  it("should throw an error with the correct message for 401 Unauthorized in login context", async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      json: async () => ({
        errors: ["Unauthorized"],
      }),
    };

    await expect(handleErrors(mockResponse, "login")).rejects.toThrow(
      ERROR_MESSAGES.LOGIN_FAILED,
    );

    expect(renderErrors).toHaveBeenCalledWith(
      new Error(ERROR_MESSAGES.LOGIN_FAILED),
    );
  });

  it("should throw an error with the correct message for 401 Unauthorized in other contexts", async () => {
    const mockResponse = {
      ok: false,
      status: 401,
      json: async () => ({
        errors: ["Unauthorized"],
      }),
    };

    await expect(handleErrors(mockResponse)).rejects.toThrow(
      ERROR_MESSAGES.AUTHORIZATION_ERROR,
    );

    expect(renderErrors).toHaveBeenCalledWith(
      new Error(ERROR_MESSAGES.AUTHORIZATION_ERROR),
    );
  });

  it("should handle 400 Bad Request and display the appropriate error message", async () => {
    const mockResponse = {
      ok: false,
      status: 400,
      json: async () => ({
        errors: ["Bad Request"],
      }),
    };

    await expect(handleErrors(mockResponse)).rejects.toThrow(
      ERROR_MESSAGES.LOADING_PAGE_ERROR,
    );

    expect(renderErrors).toHaveBeenCalledWith(
      new Error(ERROR_MESSAGES.LOADING_PAGE_ERROR),
    );
  });

  it("should handle 429 Too Many Requests and display a rate-limiting error", async () => {
    const mockResponse = {
      ok: false,
      status: 429,
      json: async () => ({}),
    };

    await expect(handleErrors(mockResponse)).rejects.toThrow(
      ERROR_MESSAGES.TOO_MANY_REQUESTS_ERROR,
    );

    expect(renderErrors).toHaveBeenCalledWith(
      new Error(ERROR_MESSAGES.TOO_MANY_REQUESTS_ERROR),
    );
  });

  it("should handle unknown errors and display a generic error message", async () => {
    const mockResponse = {
      ok: false,
      status: 500,
      json: async () => ({}),
    };

    await expect(handleErrors(mockResponse)).rejects.toThrow(
      ERROR_MESSAGES.LOADING_PAGE_ERROR,
    );

    expect(renderErrors).toHaveBeenCalledWith(
      new Error(ERROR_MESSAGES.LOADING_PAGE_ERROR),
    );
  });
});
