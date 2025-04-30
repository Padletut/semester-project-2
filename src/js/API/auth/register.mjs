import * as constants from "../../constants.mjs";
import { headers } from "../utils/headers.mjs";
import { fetchData } from "../utils/fetch.mjs";
import { handleErrors } from "../utils/handleerrors.mjs";

const { API_BASE_URL, API_AUTH, API_REGISTER } = constants;

/**
 * Registers a new user with the provided name, email, and password.
 * @memberof module:Authorization
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
export async function register(name, email, password) {
  // Convert name and email to lowercase
  const lowerCaseName = name.toLowerCase();
  const lowerCaseEmail = email.toLowerCase();
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
    return await response.json();
  }

  await handleErrors(response);
}
