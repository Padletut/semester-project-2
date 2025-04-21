import { loadStorage } from "../../storage/loadstorage.mjs";

const loggedInUser = loadStorage("profile");

/**
 * Check if the logged in user is the owner of the profile and add the edit button
 * @memberof module:Profile
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