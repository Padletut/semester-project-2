import { loadStorage } from "../../storage/loadstorage.mjs";
import * as constants from "../../constants.mjs";

const { PROFILE } = constants.STORAGE_KEYS;
const loggedInUser = loadStorage(PROFILE);

/**
 * Check if the logged in user is the owner of the profile and add the edit button
 * @memberof module:API/profile
 * @param {Object} profile - The profile object.
 * @example
 * ```javascript
 * const profile = { data: { name: "john_doe" } };
 * checkProfileOwner(profile);
 * ```
 */
export function checkProfileOwner(profile) {
  const { name: profileName = {} } = profile;
  const { name: loggedInUserName } = loggedInUser;

  return profileName === loggedInUserName;
}
