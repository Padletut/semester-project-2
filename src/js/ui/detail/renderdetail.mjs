import { getItem } from "../../API/listings/getitem.mjs";
import { createItemCard } from "./createdetailcard.mjs";
import { renderBidHistory } from "./renderbidhistory.mjs";
import { renderErrors } from "../shared/rendererrors.mjs";
import { toggleLoader } from "../shared/toggleLoader.mjs";
import { initializePlaceBid } from "./initializeplacebid.mjs";
import { loadStorage } from "../../storage/loadstorage.mjs";

/**
 * Renders the details of an item in the detail view.
 * @param {number} itemId - The ID of the item to render.
 * @param {HTMLElement} container - The container element to render the item into.
 * @param {HTMLElement} loaderContainer - The loading container element.
 * @returns {Promise<void>}
 */
export async function renderDetail(itemId) {
  console.log("Rendering item detail for ID:", itemId); // Debugging line to check the itemId
  const loaderContainer = document.getElementById("loader");
  toggleLoader(true, loaderContainer);

  try {
    const profileName = loadStorage("profile")?.name; // Get the logged-in user's profile name
    const response = await getItem(itemId);
    console.log(response); // Debugging line to check the item data
    console.log("EndsAt:", response.endsAt); // Debugging line to check the endsAt date

    // If profileName = itemId.seller or auction has ended, disable the "Place Bid" button
    const placeBidButton = document.querySelector(".place-bid-button");
    if (placeBidButton) {
      const endsAtDate = new Date(response.endsAt);
      const currentDate = new Date();

      if (profileName === response.seller.name || currentDate > endsAtDate) {
        placeBidButton.disabled = true; // Disable the button
        placeBidButton.classList.add("disabled"); // Add a disabled class for styling
      } else {
        placeBidButton.disabled = false; // Enable the button
        placeBidButton.classList.remove("disabled"); // Remove the disabled class
      }
    }

    // Render the item details
    createItemCard(response);

    // Render the bid history
    renderBidHistory(response);

    // Initialize the "Place Bid" button functionality
    initializePlaceBid(itemId);
    //
  } catch (error) {
    renderErrors(error);
    console.error("Error rendering item detail:", error);
  } finally {
    toggleLoader(false, loaderContainer); // Hide the loader
  }
}
