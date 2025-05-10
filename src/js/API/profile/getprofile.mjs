import { fetchData } from "../utils/fetchdata.mjs";
import { headers } from "../utils/headers.mjs";
import { handleErrors } from "../utils/handleerrors.mjs";
import { renderErrors } from "../../ui/shared/rendererrors.mjs";
import * as constants from "../../constants.mjs";
import { loadStorage } from "../../storage/loadstorage.mjs";
import { ERROR_MESSAGES } from "../utils/errormessages.mjs";

const { API_BASE_URL, API_PROFILES, STORAGE_KEYS } = constants;
const { PROFILE } = STORAGE_KEYS;
const storedUser = loadStorage(PROFILE);
const loggedInUser = storedUser ? storedUser.name : null;

/**
 * Fetches the profile data from the API.
 * @memberof module:API/profile
 * @param {Object|string} profileName - The profile object or name.
 * @returns {Promise<Object|null>} A promise that resolves to the profile data or null if not found.
 * @example
 * ```javascript
 * const profile = await getProfile("john_doe");
 * console.log(profile);
 * ```
 */
export async function getProfile(username = loggedInUser) {
  try {
    const queryParams = new URLSearchParams({
      _listings: "true",
      _wins: "true",
    });
    if (!username) {
      throw new Error("Username is required");
    }
    const response = await fetchData(
      `${API_BASE_URL}${API_PROFILES}/${username}?${queryParams.toString()}`,
      {
        headers: headers(false),
        method: "GET",
      },
    ); 
    const data = await response.json();
    if (!response.ok) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        console.error("Unauthorized access. Redirecting to listings.");
        renderErrors(new Error(ERROR_MESSAGES.AUTHORIZATION_ERROR));
                setTimeout(() => {
          if (window.location.href === "/profile") {
            window.location.href = "/";
          }
        }, 5000);
      }
      throw new Error("Error loading profile data");
    }
    return await data;
  } catch (error) {
    console.error("Error fetching profile:", error.message);
    handleErrors(ERROR_MESSAGES.AUTHORIZATION_ERROR);
    return null;
  }
}