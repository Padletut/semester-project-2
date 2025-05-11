import { renderErrors } from "../shared/rendererrors.mjs";
import { ERROR_MESSAGES } from "../../API/utils/errormessages.mjs";
/**
 * Renders the profile credits in the element with id "profile-credits".
 * @memberof module:UI/profile
 * @param {Object} profile - The profile object containing credits data.
 * @example
 * ```javascript
 * const profile = { data: { credits: "This is the credits" } };
 * renderProfilecredits(profile);
 * ```
 */
export async function renderProfileCredits(profile) {
  try {
    const creditsContainer = document.getElementById("profile-credits");
    creditsContainer.innerHTML = `${profile.credits} Cr`;
  } catch (error) {
    renderErrors(new Error(ERROR_MESSAGES.LOADING_PROFILE_ERROR));
    console.error(`Error rendering profile credits: ${error.message}`);
  }
}
