import * as constants from "../../constants.mjs";
import { headers } from "../utils/headers.mjs";
import { fetchData } from "../utils/fetch.mjs";
import { handleErrors } from "../utils/handleerrors.mjs";
import { validateEmail } from "../utils/validateemail.mjs";

const { API_BASE_URL, API_AUTH, API_REGISTER } = constants;

/**
 * Registers a new user with the provided name, email, and password.
 * @memberof module:API/auth
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
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
export async function register(name, emailInput, password) {
  try {
    // Validate email format
    validateEmail(emailInput);

    // Convert name and email to lowercase
    const lowerCaseName = name.toLowerCase();
    const lowerCaseEmail = emailInput.value.toLowerCase();
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

    // Handle the response
    if (response.ok) {
      return await response.json();
    }

    // Handle HTTP errors
    await handleErrors(response);
  } catch (error) {
    // Log the error and rethrow it
    console.error("Error during registration:", error);
    throw error;
  }
}
