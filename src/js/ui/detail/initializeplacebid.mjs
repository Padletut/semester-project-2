import { createBid } from "../../API/bid/createbid.mjs";
import { validateBidInput } from "../bootstrap/validatebidinput.mjs";
import { renderBidHistory } from "./renderbidhistory.mjs";
import { renderCredits } from "../shared/rendercredits.mjs";
import { getItem } from "../../API/listings/getitem.mjs";

/**
 * Initializes the "Place Bid" button functionality.
 * @param {string} itemId - The ID of the auction item.
 */
export function initializePlaceBid(itemId) {
  const form = document.querySelector("form.needs-validation");
  const placeBidButton = form?.querySelector(".place-bid-button");

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
