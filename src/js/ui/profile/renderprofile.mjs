import * as constants from "../../constants.mjs";
import { getProfile } from "../../API/profile/getprofile.mjs";
import { renderProfileBanner } from "./renderprofilebanner.mjs";
import { renderProfileAvatar } from "./renderprofileavatar.mjs";
import { renderProfileName } from "./renderprofilename.mjs";
import { renderProfileCredits } from "./renderprofilecredits.mjs";
import { renderProfileBio } from "./renderprofilebio.mjs";
import { renderErrors } from "../shared/rendererrors.mjs";
import { setupEditProfileButton } from "./setupeditbuttons.mjs";
import { toggleLoader } from "../shared/toggleLoader.mjs";
import { renderBidsWon } from "./renderbidswon.mjs";
import { renderMyBids } from "./rendermybids.mjs";
import { renderMyListings } from "./rendermylistings.mjs";
import { renderCredits } from "../shared/rendercredits.mjs";
import { loadStorage } from "../../storage/loadstorage.mjs";

/**
 * @module Profile
 */

/**
 * Renders the profile page.
 * @memberof module:Profile
 * @returns {Promise<void>} A promise that resolves when the profile page is rendered.
 * @example
 * ```javascript
 * await renderProfile();
 * ```
 */
export async function renderProfile() {
  const { STORAGE_KEYS } = constants;
  const { PROFILE } = STORAGE_KEYS;
  const loggedInUser = loadStorage(PROFILE);
  const urlParams = new URLSearchParams(window.location.search);
  let profileName = urlParams.get("profile");
  if (profileName === null) {
    profileName = undefined;
  }

  const loaderContainer = document.getElementById("loader");

  try {
    toggleLoader(true, loaderContainer);
    const { data: profile } = await getProfile(profileName);
    console.log(profile); // Debugging line to check the profile data
    renderProfileBanner(profile);
    renderProfileAvatar(profile);
    renderProfileName(profile, profile.email);
    if (profileName === loggedInUser) {
      renderProfileCredits(profile);
    }
    renderProfileBio(profile);
    renderMyBids();
    renderMyListings(profile);
    renderBidsWon(profile);
    setupEditProfileButton(profile);

    const creditsContainer = document.querySelector(".display-credits");
    if (creditsContainer && profileName === loggedInUser) {
      creditsContainer.innerHTML = `<i>${profile.credits} Cr</i>`;
    } else if (creditsContainer && profileName !== loggedInUser) {
      renderCredits();
    } else {
      console.error("Credits container not found or profile name mismatch.");
    }
  } catch (error) {
    renderErrors(new Error("An error occurred while loading the profile page"));
    console.error("Error rendering profile data:", error);
  } finally {
    toggleLoader(false, loaderContainer);
  }
}
