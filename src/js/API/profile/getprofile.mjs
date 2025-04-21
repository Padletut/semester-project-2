import { fetchData } from "../utils/fetch.mjs";
import { headers } from "../utils/headers.mjs";
import { renderErrors } from "../../ui/shared/rendererrors.mjs";
import * as global from "../../constants.mjs";
import { loadStorage } from "../../storage/loadstorage.mjs";

const { API_BASE_URL, API_PROFILES } = global;
const loggedInUser = loadStorage("profile");

/**
 * Fetches the profile data from the API.
 * @memberof module:Profile
 * @param {Object|string} profileName - The profile object or name.
 * @returns {Promise<Object|null>} A promise that resolves to the profile data or null if not found.
 * @example
 * ```javascript
 * const profile = await getProfile("john_doe");
 * console.log(profile);
 * ```
 */
export async function getProfile(profileName = loggedInUser) {
  const queryParams = new URLSearchParams({
    _following: "true",
    _followers: "true",
    _posts: "true",
  });

  // Determine the profile name based on the structure of the profileName parameter
  const name =
    typeof profileName === "string"
      ? profileName
      : profileName.data
        ? profileName.data.name
        : profileName.name;

  // Fetch the profile data from the API
  const response = await fetchData(
    `${API_BASE_URL}${API_PROFILES}/${name}?${queryParams.toString()}`,
    {
      headers: headers(false),
      method: "GET",
    },
  );

  if (response.ok) {
    const data = await response.json();
    console.log("Profile data:", data);
    return data;
  }

  // Render error if profile not found with both original and lowercase names
  renderErrors(new Error("We couldn't find the profile you were looking for"));
  console.error(
    `Error fetching profile data: ${response.status} - ${response.statusText}`,
  );
}
