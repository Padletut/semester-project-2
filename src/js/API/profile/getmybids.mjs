import { fetchData } from "../utils/fetchdata.mjs";
import { headers } from "../utils/headers.mjs";
import { renderErrors } from "../../ui/shared/rendererrors.mjs";
import * as constants from "../../constants.mjs";
import { loadStorage } from "../../storage/loadstorage.mjs";
import { ERROR_MESSAGES } from "../utils/errormessages.mjs";

const { API_BASE_URL, API_PROFILES, STORAGE_KEYS } = constants;
const { PROFILE } = STORAGE_KEYS;
const loggedInUser = loadStorage(PROFILE);

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
export async function getMyBids(profileName = loggedInUser) {
  // Determine the profile name based on the structure of the profileName parameter
  try {
    const name =
      typeof profileName === "string"
        ? profileName
        : profileName.data
          ? profileName.data.name
          : profileName.name;

    if (!name) {
      throw new Error("Error loading profile data");
    }
    // Fetch the profile data from the API
    const response = await fetchData(
      `${API_BASE_URL}${API_PROFILES}/${name}/bids?_listings=true`,
      {
        headers: headers(false),
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error("Error loading profile data");
    }

    const data = await response.json();
    return data;

    // Handle errors if the response is not ok
  } catch (error) {
    console.error(`Error fetching profile data: ${error.message}`);
    renderErrors(new Error(ERROR_MESSAGES.LOADING_PROFILE_ERROR));
  }
}
