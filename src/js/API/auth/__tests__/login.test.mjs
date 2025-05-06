import { describe, it, expect, vi } from "vitest";
import { login } from "../login.mjs";
import { fetchData } from "../../utils/fetchdata.mjs";
import { saveStorage } from "../../../storage/savestorage.mjs";
import { handleErrors } from "../../utils/handleerrors.mjs";

// Mock the dependencies
vi.mock("../../utils/fetchdata.mjs", () => ({
  fetchData: vi.fn(),
}));

vi.mock("../../../storage/savestorage.mjs", () => ({
  saveStorage: vi.fn(),
}));

vi.mock("../../utils/handleerrors.mjs", () => ({
  handleErrors: vi.fn(() => {
    throw new Error("Mocked error from handleErrors");
  }),
}));

describe("login", () => {
  const email = "user@example.com";
  const password = "password123";
  const mockAccessToken = "mockAccessToken";
  const mockProfile = { id: 1, name: "John Doe", email };

  it("should save access token and profile to storage and return the profile on successful login", async () => {
    // Mock fetchData to return a successful response
    fetchData.mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { accessToken: mockAccessToken, ...mockProfile },
      }),
    });

    const profile = await login(email, password);

    // Assertions
    expect(fetchData).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );
    expect(saveStorage).toHaveBeenCalledWith("accessToken", mockAccessToken);
    expect(saveStorage).toHaveBeenCalledWith("profile", mockProfile);
    expect(profile).toEqual(mockProfile);
  });

  it("should call handleErrors if the response is not ok", async () => {
    // Mock fetchData to return an unsuccessful response
    const mockResponse = { ok: false };
    fetchData.mockResolvedValue(mockResponse);

    // Mock handleErrors to throw an error
    handleErrors.mockImplementation(() => {
      throw new Error("Mocked error from handleErrors");
    });

    await expect(login(email, password)).rejects.toThrow(
      "Mocked error from handleErrors",
    );

    // Assertions
    expect(handleErrors).toHaveBeenCalledWith(mockResponse, "login");
  });
});
