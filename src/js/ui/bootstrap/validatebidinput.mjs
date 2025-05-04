import { getItem } from "../../API/listings/getitem.mjs";

/**
 * Validates the bid input and checks if the bid is valid.
 * @memberof module:UI/bootstrap
 * @param {HTMLFormElement} form - The form element containing the bid input.
 * @returns {Promise<boolean>} - Returns true if the bid is valid, otherwise false.
 */
export async function validateBidInput(form) {
  if (!form) {
    console.error("Form element is not provided");
    return false;
  }

  const bidInput = form.querySelector("input[name='bid-amount']");
  const feedbackElement = form.querySelector(".invalid-feedback");
  if (!bidInput) {
    console.error("Bid input field not found in the form");
    return false;
  }

  let isValid = true;

  try {
    // Check if the bid input is a valid number and greater than zero
    const bidValue = parseFloat(bidInput.value);
    if (isNaN(bidValue) || bidValue <= 0) {
      feedbackElement.textContent = "You must enter a valid bid amount.";
      bidInput.classList.add("is-invalid");
      isValid = false;
      return isValid;
    }

    // Get the item ID from the card's data-id attribute or the URL
    const card = form.closest(".card-auction-item");
    let itemId = card?.dataset.id;

    if (!itemId) {
      // If not found in the card, try to get it from the URL
      const urlParams = new URLSearchParams(window.location.search);
      itemId = urlParams.get("id");
    }

    if (!itemId) {
      feedbackElement.textContent = "Item ID is missing.";
      bidInput.classList.add("is-invalid");
      isValid = false;
      return isValid;
    }

    // Fetch the item details to get the current highest bid
    const item = await getItem(itemId);
    const highestBid =
      item.bids?.reduce((max, bid) => Math.max(max, bid.amount), 0) || 0;

    // Check if the bid is higher than the current highest bid
    if (bidValue <= highestBid) {
      feedbackElement.textContent = `Your bid must be higher than the current highest bid of ${highestBid} credits.`;
      bidInput.classList.add("is-invalid");
      isValid = false;
      return isValid;
    }

    // If valid, remove the invalid class and clear the feedback message
    bidInput.classList.remove("is-invalid");
    feedbackElement.textContent = "";
  } catch (error) {
    console.error("Error validating bid input:", error);
    feedbackElement.textContent =
      "An error occurred while validating your bid.";
    bidInput.classList.add("is-invalid");
    isValid = false;
  }

  return isValid;
}
