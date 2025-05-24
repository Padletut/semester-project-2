import { getProfile } from "../../API/profile/getprofile.mjs";

/**
 * Renders the credits in header of the page.
 * @memberof module:UI/shared
 * @param {object} [profile] - Optional profile object to use for credits.
 * @returns {void}
 * @example
 * ```javascript
 * renderCredits(profile);
 * renderCredits(); // will fetch profile
 * ```
 */
export async function renderCredits(profile) {
  const creditsContainer = document.querySelector(".display-credits");
  if (!creditsContainer) {
    console.error("Credits container not found");
    return;
  }

  creditsContainer.innerHTML = ""; // Clear existing credits

  try {
    let credits;
    if (profile && profile.credits !== undefined) {
      credits = profile.credits;
    } else {
      const fetchedProfile = await getProfile();
      credits = fetchedProfile.data.credits;
    }
    creditsContainer.innerHTML = `<i>${credits} Cr</i>`;
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
}
