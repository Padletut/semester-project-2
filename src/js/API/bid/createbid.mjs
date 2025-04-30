import * as constants from "../../constants.mjs";
import { headers } from "../utils/headers.mjs";
import { handleErrors } from "../utils/handleerrors.mjs";

/**
 * Function to call API to create a bid for an item.
 * @param {string} itemId - The ID of the item to bid on.
 * @param {number} amount - The bid amount.
 * @returns {Promise<void>} - Resolves if the bid is created successfully.
 * @throws {Error} - Throws an error if the request fails.
 * @example
 * ```javascript
 * const itemId = "12345";
 * const amount = 100;
 */
export async function createBid(itemId, amount) {
  try {
    const response = await fetch(
      `${constants.API_BASE_URL + constants.API_LISTINGS}/${itemId}/bids`,
      {
        method: "POST",
        headers: headers(true),
        body: JSON.stringify({ amount }),
      },
    );

    if (!response.ok) {
      await handleErrors(response);
    }

    console.log("Bid created successfully"); // Debugging log
    return; // No content to return for 204 No Content
  } catch (error) {
    handleErrors(error);
    console.error("Error creating bid:", error);
    throw error;
  }
}
