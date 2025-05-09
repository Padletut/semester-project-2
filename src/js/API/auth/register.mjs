import * as constants from "../../constants.mjs";
import { headers } from "../utils/headers.mjs";
import { fetchData } from "../utils/fetchdata.mjs";
import { handleErrors } from "../utils/handleerrors.mjs";
import { ERROR_MESSAGES } from "../utils/errormessages.mjs";
import { validateEmail } from "../utils/validateemail.mjs";

const { API_BASE_URL, API_AUTH, API_REGISTER } = constants;

/**
 * Registers a new user with the provided name, email, and password.
 * @memberof module:API/auth
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @param {string} confirmPassword - The password confirmation.
 * @throws {Error} Throws an error if the registration fails or if the passwords do not match.
 * @returns {Promise<Object>} A promise that resolves to the registered user's data.
 * @example
 * ```javascript
 * const name = "John Doe";
 * const email = "john.doe@example.com";
 * const password = "password123";
 * const userData = await register(name, email, password);
 * console.log(userData);
 * ```
 */
export async function register(name, email, password, confirmPassword) {
  try {
    // Validate the email using the validateEmail utility
    validateEmail(email);

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      throw new Error(ERROR_MESSAGES.INVALID_CONFIRM_PASSWORD);
    }

    // Convert name and email to lowercase
    const lowerCaseName = name.toLowerCase();
    const lowerCaseEmail = email.toLowerCase();
    // Make the API request
    const response = await fetchData(API_BASE_URL + API_AUTH + API_REGISTER, {
      headers: headers(true),
      method: "POST",
      body: JSON.stringify({
        name: lowerCaseName,
        email: lowerCaseEmail,
        password,
      }),
    });

    if (response.ok) {
      return true;
    }
    await handleErrors(response, "register");
  } catch (error) {
    console.error("Error during registration:", error);
    handleErrors(error, "register");
    throw error;
  }
}
