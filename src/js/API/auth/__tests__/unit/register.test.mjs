import { describe, it, expect, vi, beforeEach } from "vitest";
import { register } from "../../register.mjs";
import { fetchData } from "../../../utils/fetchdata.mjs";
import { validateEmail } from "../../../utils/validateemail.mjs";

vi.mock("../../utils/headers.mjs", () => ({
  headers: vi.fn(() => ({ "Content-Type": "application/json" })),
}));

vi.mock("../../../utils/fetchdata.mjs", () => ({
  fetchData: vi.fn(),
}));

vi.mock("../../../utils/handleerrors.mjs", () => ({
  handleErrors: vi.fn(),
}));

vi.mock("../../../utils/validateemail.mjs", async () => {
  const actual = await vi.importActual("../../../utils/validateemail.mjs");
  return {
    ...actual,
    validateEmail: vi.fn(),
  };
});

describe("register", () => {
  const name = "John Doe";
  const password = "password123";
  const lowerCaseName = "john doe";
  let email = "john.doe@stud.noroff.no";

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should register a user and return true on success", async () => {
    const mockResponse = {
      ok: true,
      json: async () => ({
        id: 1,
        name: lowerCaseName,
        email: email,
      }),
    };
    fetchData.mockResolvedValue(mockResponse);

    // Pass emailInput as an object with a value property
    const confirmPassword = password; // Ensure confirmPassword matches password
    const result = await register(name, email, password, confirmPassword);

    // Assertions
    expect(fetchData).toHaveBeenCalledWith(
      "https://v2.api.noroff.dev/auth/register",
      {
        headers: expect.any(Headers), // Match any instance of the Headers class
        method: "POST",
        body: JSON.stringify({
          name: lowerCaseName,
          email: email.toLowerCase(),
          password,
        }),
      },
    );
    expect(result).toBe(true); // Expect true instead of user data
  });

  it("should throw an error if the email is invalid", async () => {
    // Mock validateEmail to throw an error for invalid email
    email = "john.doe@gmail.com";
    validateEmail.mockImplementation(() => {
      throw new Error(
        "Sorry, only users with email ending @stud.noroff.no can register",
      );
    });

    await expect(register(name, email, password)).rejects.toThrow(
      "Sorry, only users with email ending @stud.noroff.no can register",
    );

    // Ensure validateEmail was called with the invalid email
    expect(validateEmail).toHaveBeenCalledWith(email);
  });
});
