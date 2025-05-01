import { createBid } from "../../API/bid/createbid.mjs";
import { validateBidInput } from "../bootstrap/validatebidinput.mjs";
import { renderBidHistory } from "./renderbidhistory.mjs";
import { renderCredits } from "../shared/rendercredits.mjs";
import { getItem } from "../../API/listings/getitem.mjs";
import { loadStorage } from "../../storage/loadstorage.mjs";
import * as constants from "../../constants.mjs";

/**
 * Initializes the "Place Bid" button functionality.
 * @param {string} itemId - The ID of the auction item.
 * @returns {void}
 * @example
 * ```javascript
 * initializePlaceBid("12345");
 * ```
 */
export function initializePlaceBid(itemId) {
  const { STORAGE_KEYS } = constants;
  const { PROFILE } = STORAGE_KEYS;
  const form = document.querySelector("form.needs-validation");
  const placeBidButton = form?.querySelector(".place-bid-button");
  const profileName = loadStorage(PROFILE).name; // Get the logged-in user's profile name
  console.log("Profile Name:", profileName);

  if (!profileName) {
    // Wrap the button in a div for the tooltip to work
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-bs-toggle", "tooltip");
    wrapper.setAttribute("title", "Please log in to place a bid");
    placeBidButton.parentNode.insertBefore(wrapper, placeBidButton);
    wrapper.appendChild(placeBidButton);

    placeBidButton.disabled = true;

    // Initialize the tooltip for the wrapper only
    new bootstrap.Tooltip(wrapper);
  }

  if (form && placeBidButton) {
    placeBidButton.addEventListener("click", async (event) => {
      event.preventDefault(); // Prevent the default form submission

      try {
        const isValid = await validateBidInput(form); // Validate the bid input
        if (!isValid) {
          return; // Exit if the input is invalid
        }

        const bidInput = form.querySelector("input[name='bid-amount']");
        const bidAmount = parseFloat(bidInput.value);

        // Call createBid, which already handles validation
        await createBid(itemId, bidAmount);

        // Clear the input field after a successful bid
        bidInput.value = "";

        // Fetch the item details again to get the updated bid history
        const updatedResponse = await getItem(itemId);
        renderBidHistory(updatedResponse); // Re-render the bid history to show the new bid
        renderCredits(); // Update credits in the header

        // Show success feedback
        const feedbackElement = form.querySelector(".valid-feedback");
        feedbackElement.classList.remove("d-none");
        feedbackElement.textContent = "Bid placed successfully!";
        console.log("Bid placed successfully:", bidAmount);
      } catch (error) {
        console.error("Error placing bid:", error);
      }
    });
  } else {
    console.error("Form or Place Bid button not found.");
  }
}
