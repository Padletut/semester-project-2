import { loadStorage } from "../../storage/loadstorage.mjs";
import * as constants from "../../constants.mjs";

/**
 * This function adds event listeners to all author links in the card elements.
 * When a link is clicked, it prevents the default behavior and redirects to the profile page of the author.
 * It uses the text content of the link as the profile name in the URL.
 * @memberof module:UI/shared
 * @returns {void}
 * @example
 * ```javascript
 * linkAuthorToProfile();
 * ```
 */
export function linkAuthorToProfile() {
  const { STORAGE_KEYS } = constants;
  const { PROFILE } = STORAGE_KEYS;
  const profile = loadStorage(PROFILE);
  const authorLinks = document.querySelectorAll(".card-author");

  authorLinks.forEach((authorLink) => {
    const profileName = authorLink.getAttribute("name");

    // Check if the user is logged in
    if (!profile) {
      authorLink.style.pointerEvents = "none";
      authorLink.style.cursor = "default";
      return;
    }

    authorLink.addEventListener("click", (event) => {
      event.stopPropagation();
      event.preventDefault();
      window.location.assign(`/profile?profile=${profileName}`);
    });
  });
}
