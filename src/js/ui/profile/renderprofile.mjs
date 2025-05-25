import * as constants from "../../constants.mjs";
import { getProfile } from "../../API/profile/getprofile.mjs";
import { renderProfileBanner } from "./renderprofilebanner.mjs";
import { renderProfileAvatar } from "./renderprofileavatar.mjs";
import { renderProfileName } from "./renderprofilename.mjs";
import { renderProfileCredits } from "./renderprofilecredits.mjs";
import { renderProfileBio } from "./renderprofilebio.mjs";
import { setupEditProfileButton } from "./setupeditbuttons.mjs";
import { toggleLoader } from "../shared/toggleLoader.mjs";
import { renderBidsWon } from "./renderbidswon.mjs";
import { renderMyBids } from "./rendermybids.mjs";
import { renderMyListings } from "./rendermylistings.mjs";
import { renderCredits } from "../shared/rendercredits.mjs";
import { loadStorage } from "../../storage/loadstorage.mjs";
import { ERROR_MESSAGES } from "../../API/utils/errormessages.mjs";
import { handleErrors } from "../../API/utils/handleerrors.mjs";
import { renderErrors } from "../shared/rendererrors.mjs";
import { observeProfileUpdates } from "../events/observerProfileUpdated.mjs";

/**
 * Renders the profile page.
 * This function fetches the profile data, renders the profile banner, avatar, name, credits,
 * bio, and listings. It also sets up the edit profile button and handles loading states.
 * @memberof module:UI/profile
 * @returns {Promise<void>} A promise that resolves when the profile page is rendered.
 * @example
 * ```javascript
 * await renderProfile();
 * ```
 */
export async function renderProfile() {
  const name = loadStorage(constants.STORAGE_KEYS.PROFILE)?.name;
  const urlParams = new URLSearchParams(window.location.search);
  let profileName = urlParams.get("profile");
  if (profileName === null) {
    if (name) {
      profileName = name;
    } else {
      console.error("Profile name not found in URL or local storage.");
      renderErrors(
        new Error(
          "You are not authorized to perform this action. Please log in and try again.",
        ),
      );
      // Wait for 3 seconds before redirecting
      setTimeout(() => {
        window.location.pathname = "/";
      }, 3000);
      return;
    }
  }

  const loaderContainer = document.getElementById("loader");

  try {
    toggleLoader(true, loaderContainer);
    const { data: profile } = await getProfile(profileName);
    const profileContainer = document.querySelector(".card-profile");
    if (profileContainer) {
      profileContainer.setAttribute("data-profile", JSON.stringify(profile));
    }
    renderProfileBanner(profile);
    renderProfileAvatar(profile);
    renderProfileName(profile, profile.email);
    renderProfileBio(profile);
    renderMyBids();
    renderMyListings(profile);
    renderBidsWon(profile);
    setupEditProfileButton(profile);
    if (profileName?.toLowerCase() === name?.toLowerCase()) {
      renderProfileCredits(profile);
    }
    // Observe changes in the profile data
    observeProfileUpdates(profileContainer, profileName);

    // Render credits in the header
    renderCredits(name);
  } catch (error) {
    handleErrors(new Error(ERROR_MESSAGES.LOADING_PROFILE_ERROR));
    console.error("Error rendering profile data:", error);
  } finally {
    toggleLoader(false, loaderContainer);
  }
}
