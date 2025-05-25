import * as constants from "../../constants.mjs";
import { getItem } from "../../API/listings/getitem.mjs";
import { renderDetailItemCard } from "./renderdetailcard.mjs";
import { renderBidHistory } from "./renderbidhistory.mjs";
import { renderErrors } from "../shared/rendererrors.mjs";
import { toggleLoader } from "../shared/toggleLoader.mjs";
import { initializePlaceBid } from "./initializeplacebid.mjs";
import { loadStorage } from "../../storage/loadstorage.mjs";
import { ERROR_MESSAGES } from "../../API/utils/errormessages.mjs";

/**
 * Renders the details of an item in the detail view.
 * @memberof module:UI/detail
 * @param {number} itemId - The ID of the item to render.
 * @returns {Promise<void>} A promise that resolves when the rendering is complete.
 * @example
 * ```javascript
 * const itemId = 123;
 * await renderDetail(itemId);
 * ```javascript
 */
export async function renderDetail(itemId) {
  const loaderContainer = document.getElementById("loader");
  toggleLoader(true, loaderContainer);

  try {
    const { STORAGE_KEYS } = constants;
    const { PROFILE } = STORAGE_KEYS;
    const profileName = loadStorage(PROFILE)?.name; // Get the logged-in user's profile name
    const response = await getItem(itemId);
    const placeBidButton = document.querySelector(".place-bid-button");
    if (placeBidButton) {
      const endsAtDate = new Date(response.endsAt);
      const currentDate = new Date();

      if (profileName === response.seller.name || currentDate > endsAtDate) {
        const wrapper = document.createElement("div"); // Wrap the button in a div for the tooltip to work
        wrapper.setAttribute("data-bs-toggle", "tooltip");
        wrapper.setAttribute(
          "title",
          "Sorry, you can not place a bid on your own item.",
        );
        placeBidButton.parentNode.insertBefore(wrapper, placeBidButton);
        wrapper.appendChild(placeBidButton);
        placeBidButton.classList.add("disabled");
        placeBidButton.disabled = true;

        new bootstrap.Tooltip(wrapper);
      } else {
        placeBidButton.disabled = false;
        placeBidButton.classList.remove("disabled");
      }
    }
    renderDetailItemCard(response);
    renderBidHistory(response);
    initializePlaceBid(itemId);
  } catch (error) {
    renderErrors(new Error(ERROR_MESSAGES.LOADING_PAGE_ERROR));
    console.error("Error rendering item detail:", error);
  } finally {
    toggleLoader(false, loaderContainer);
  }
}
