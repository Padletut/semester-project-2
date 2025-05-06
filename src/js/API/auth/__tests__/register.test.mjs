import { describe, it, expect, vi, beforeEach } from "vitest";
import { register } from "../register.mjs";
import { fetchData } from "../../utils/fetchdata.mjs";
import { validateEmail } from "../../utils/validateemail.mjs";

vi.mock("../utils/headers.mjs", () => ({
  headers: vi.fn(() => ({ "Content-Type": "application/json" })),
}));

vi.mock("../../utils/fetchdata.mjs", () => ({
  fetchData: vi.fn(),
}));

vi.mock("../../utils/handleerrors.mjs", () => ({
  handleErrors: vi.fn(),
}));

vi.mock("../utils/headers.mjs", () => ({
  headers: vi.fn(() => ({ "Content-Type": "application/json" })),
}));

vi.mock("../../utils/validateemail.mjs", async () => {
  const actual = await vi.importActual("../../utils/validateemail.mjs");
  return {
    ...actual,
    validateEmail: vi.fn(),
  };
});

describe("register", () => {
  const name = "John Doe";
  const password = "password123";
  const lowerCaseName = "john doe";

  let emailInput;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock emailInput object
    emailInput = {
      value: "john.doe@example.com",
      setCustomValidity: vi.fn(),
    };
  });

  it("should register a user and return user data on success", async () => {
    // Mock fetchData to return a successful response
    const mockResponse = {
      ok: true,
      json: async () => ({
        id: 1,
        name: lowerCaseName,
        email: emailInput.value,
      }),
    };
    fetchData.mockResolvedValue(mockResponse);

    // Call the register function
    const userData = await register(name, emailInput, password);

    // Assertions
    expect(fetchData).toHaveBeenCalledWith(
      "https://v2.api.noroff.dev/auth/register",
      {
        headers: expect.any(Headers), // Match any instance of the Headers class
        method: "POST",
        body: JSON.stringify({
          name: lowerCaseName,
          email: emailInput.value.toLowerCase(),
          password,
        }),
      },
    );
    expect(userData).toEqual({
      id: 1,
      name: lowerCaseName,
      email: emailInput.value,
    });
  });

  it("should throw an error if the email is invalid", async () => {
    // Mock validateEmail to throw an error for invalid email
    emailInput.value = "john.doe@gmail.com";
    validateEmail.mockImplementation(() => {
      throw new Error(
        "Sorry, only users with email ending @stud.noroff.no can register",
      );
    });

    await expect(register(name, emailInput, password)).rejects.toThrow(
      "Sorry, only users with email ending @stud.noroff.no can register",
    );

    // Ensure validateEmail was called with the invalid email
    expect(validateEmail).toHaveBeenCalledWith(emailInput);
  });
});
