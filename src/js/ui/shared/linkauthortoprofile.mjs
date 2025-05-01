import { loadStorage } from "../../storage/loadstorage.mjs";
import * as constants from "../../constants.mjs";

/**
 * @description This function adds event listeners to all author links in the card elements.
 * When a link is clicked, it prevents the default behavior and redirects to the profile page of the author.
 * It uses the text content of the link as the profile name in the URL.
 * @returns {void}
 * @example
 * linkAuthorToProfile();
 */
export function linkAuthorToProfile() {
  const { STORAGE_KEYS } = constants; // Import constants for storage keys
  const { PROFILE } = STORAGE_KEYS; // Destructure the PROFILE key from STORAGE_KEYS
  const profile = loadStorage(PROFILE); // Load the logged-in user's profile from local storage
  const authorLinks = document.querySelectorAll(".card-author"); // Select only the seller name links

  authorLinks.forEach((authorLink) => {
    const profileName = authorLink.getAttribute("name"); // Get the seller's name directly

    // Check if the user is logged in
    if (!profile) {
      // If not logged in, disable the link
      authorLink.style.pointerEvents = "none"; // Disable clicking
      authorLink.style.cursor = "default"; // Change cursor to indicate it's not clickable
      return; // Skip adding the event listener
    }

    // Add event listener if the user is logged in
    authorLink.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent the card's click event from triggering
      event.preventDefault(); // Prevent default link behavior
      window.location.href = `profile.html?profile=${profileName}`; // Redirect to the profile page
    });
  });
}
