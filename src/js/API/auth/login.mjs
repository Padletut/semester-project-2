import * as constants from "../../constants.mjs";
import { saveStorage } from "../../storage/savestorage.mjs";
import { fetchData } from "../utils/fetchdata.mjs";
import { handleErrors } from "../utils/handleerrors.mjs";

const { API_BASE_URL, API_AUTH, API_LOGIN, STORAGE_KEYS } = constants;
const { ACCESS_TOKEN, PROFILE } = STORAGE_KEYS;

/**
 * Logs in a user with the provided email and password.
 * @memberof module:API/auth
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
export async function login(email, password, redirectUrl) {
  try {
    const response = await fetchData(
      API_BASE_URL + API_AUTH + API_LOGIN,
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
      "login",
    );

    if (response.ok) {
      const { accessToken, ...profile } = (await response.json()).data;
      saveStorage(ACCESS_TOKEN, accessToken);
      saveStorage(PROFILE, profile);

      window.location.href = redirectUrl;

      return profile;
    }
    handleErrors(response, "login");
  } catch (error) {
    console.error("Error during login:", error.message);
    handleErrors(error, "login");
    throw new Error("Login failed. Please check your credentials.");
  }
  return null;
}
