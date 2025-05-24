import { renderProfileBanner } from "../profile/renderprofilebanner.mjs";
import { renderProfileAvatar } from "../profile/renderprofileavatar.mjs";
import { renderProfileName } from "../profile/renderprofilename.mjs";
import { renderProfileBio } from "../profile/renderprofilebio.mjs";
import { renderProfileCredits } from "../profile/renderprofilecredits.mjs";

// Set up an observer to watch for changes in the profile data
export async function observeProfileUpdates(profileContainer, profileName) {
  if (profileContainer) {
    const observer = new MutationObserver(async (mutationsList) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-profile"
        ) {
          const updatedProfile = JSON.parse(
            profileContainer.getAttribute("data-profile"),
          );
          // Update specific profile elements dynamically
          renderProfileBanner(updatedProfile);
          renderProfileAvatar(updatedProfile);
          renderProfileName(updatedProfile, updatedProfile.email);
          if (profileName === name || profileName === undefined) {
            renderProfileCredits(updatedProfile);
          }
          renderProfileBio(updatedProfile);
        }
      }
    });

    // Observe changes to the `data-profile` attribute
    observer.observe(profileContainer, { attributes: true });
  }
}
