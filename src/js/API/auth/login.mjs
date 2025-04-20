import * as global from "../../constants.mjs";
import { saveStorage } from "../../storage/savestorage.mjs";
import { fetchData } from "../utils/fetch.mjs";
import { handleErrors } from "../utils/handleerrors.mjs";

const { API_BASE_URL, API_AUTH, API_LOGIN } = global;

/**
 * Logs in a user with the provided email and password.
 * @memberof module:Authorization
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<Object>} A promise that resolves to the user's profile data.
 * @example
 * ```javascript
 * const email = "user@example.com";
 * const password = "password123";
 * const profile = await login(email, password);
 * console.log(profile);
 * ```
 */
export async function login(email, password) {
  const response = await fetchData(API_BASE_URL + API_AUTH + API_LOGIN, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const { accessToken, ...profile } = (await response.json()).data;
    saveStorage("accessToken", accessToken);
    saveStorage("profile", profile);
    return profile;
  }

  await handleErrors(response);
}
