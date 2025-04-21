import { splitName } from "../shared/splitname.mjs";
import { capitalizeFirstLetter } from "../shared/capitalizefirstletter.mjs";

/**
 * Renders the profile name in the element with id "profile-id".
 * @memberof module:Profile
 * @param {Object} profileName - The profile object containing name data.
 * @example
 * ```javascript
 * const profile = { data: { name: "john_doe" } };
 * await renderProfileName(profile);
 * ```
 */
export async function renderProfileName(profileName) {
    const profileNameElement = document.getElementById("profile-id");
    if (!profileNameElement) {
        console.error("Profile name element not found");
        return;
    }

    try {
        const profileNameHeading = document.createElement("h2");
        profileNameHeading.classList.add("fw-semibold", "fs-2");
        profileName = splitName(profileName.name);
        profileNameHeading.textContent = capitalizeFirstLetter(profileName);
        profileNameElement.appendChild(profileNameHeading);

        const smallName = document.createElement("small");
        smallName.classList.add("text-body-secondary");
        smallName.textContent = `@${profileName}`;
        profileNameElement.appendChild(smallName);

    } catch (error) {
        console.error(error);
    }
}