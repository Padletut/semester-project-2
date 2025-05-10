import { splitName } from "../shared/splitname.mjs";
import { capitalizeFirstLetter } from "../shared/capitalizefirstletter.mjs";

/**
 * Renders the profile name in the element with id "profile-id".
 * @memberof module:UI/profile
 * @param {Object} profileName - The profile object containing name data.
 * @example
 * ```javascript
 * const profile = { data: { name: "john_doe" } };
 * await renderProfileName(profile);
 * ```
 */
export async function renderProfileName(profileName, profileEmail) {
  const profileNameElement = document.getElementById("profile-id");
  profileNameElement.innerHTML = ""; // Clear existing name
  if (!profileNameElement) {
    console.error("Profile name element not found");
    return;
  }

  try {
    const profileNameHeading = document.createElement("h2");
    profileNameHeading.classList.add("card-title");
    profileName = splitName(profileName.name);
    profileNameHeading.textContent = capitalizeFirstLetter(profileName);
    profileNameElement.appendChild(profileNameHeading);

    const smallName = document.createElement("small");
    smallName.classList.add("text-body-secondary");
    smallName.textContent = `${profileEmail}`;
    profileNameElement.appendChild(smallName);
  } catch (error) {
    console.error(error);
  }
}
