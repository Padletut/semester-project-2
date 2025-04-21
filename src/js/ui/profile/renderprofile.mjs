import { getProfile } from "../../API/profile/getprofile.mjs";
import { renderProfileBanner } from "./renderprofilebanner.mjs";
import { renderProfileAvatar } from "./renderprofileavatar.mjs";
import { renderProfileName } from "./renderprofilename.mjs";
import { renderProfileBio } from "./renderprofilebio.mjs";
//import { renderProfileCounters } from "./renderprofilecounters.mjs";
import { renderErrors } from "../shared/rendererrors.mjs";
//import { renderPosts } from "../feed/renderposts.mjs";
//import { setupEditButtons } from "./setupeditbuttons.mjs";
//import { setupFollowButton } from "./setupfollowbutton.mjs";
import { toggleLoader } from "../shared/toggleLoader.mjs";
//import { handleFollowSection } from "./handlefollowsection.mjs";

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
  const urlParams = new URLSearchParams(window.location.search);
  let profileName = urlParams.get("profile");
  console.log("Profile name from URL:", profileName);
  if (profileName === null) {
    profileName = undefined;
  }

  const loaderContainer = document.getElementById("loader-container");

  try {
    toggleLoader(true, loaderContainer);
    const { data: profile } = await getProfile(profileName);
    //  if (document.title === "Profile | ConnectSphere") {
    renderProfileBanner(profile);
    renderProfileAvatar(profile);
    renderProfileName(profile);
    renderProfileBio(profile);
    await handleFollowSection(profile);
    await renderPosts(profile.name);
    renderProfileCounters(profile);

    setupEditButtons(profile);
    setupFollowButton(profile);

    //   }
  } catch (error) {
    renderErrors(new Error("An error occurred while loading the profile page"));
    console.error("Error rendering profile data:", error);
  } finally {
    toggleLoader(false, loaderContainer);
  }
}
