import { renderErrors } from "../shared/rendererrors.mjs";
import { ERROR_MESSAGES } from "../../API/utils/errormessages.mjs";
/**
 * Renders the profile bio in the element with id "profile-bio".
 * @memberof module:UI/profile
 * @param {Object} profile - The profile object containing bio data.
 * @example
 * ```javascript
 * const profile = { data: { bio: "This is the bio" } };
 * renderProfileBio(profile);
 * ```
 */
export async function renderProfileBio(profile) {
  try {
    const bioContainer = document.getElementById("profile-bio");
    bioContainer.innerHTML = profile.bio;
  } catch (error) {
    renderErrors(new Error(ERROR_MESSAGES.LOADING_PROFILE_ERROR));
    console.error(`Error rendering profile bio: ${error.message}`);
  }
}
