import * as constants from "../../constants.mjs";
import { handleErrors } from "../utils/handleerrors.mjs";
import { headers } from "../utils/headers.mjs";

/**
 * Deletes an item from the server.
 * @memberof module:API/listings
 * @param {string} itemId - The ID of the item to delete.
 * @returns {Promise<void>} - Resolves if the deletion is successful.
 * @throws {Error} - Throws an error if the request fails.
 * @example
 * ```javascript
 * const itemId = "12345";
 * deleteItem(itemId)
 *   .then(() => console.log("Item deleted successfully"))
 *   .catch(error => console.error(error));
 * ```
 */
export async function deleteItem(itemId) {
  try {
    const response = await fetch(
      `${constants.API_BASE_URL + constants.API_LISTINGS}/${itemId}`,
      {
        method: "DELETE",
        headers: headers(true),
      },
    );

    if (!response.ok) {
      await handleErrors(response);
    }

    return;
  } catch (error) {
    handleErrors(error);
    console.error("Error deleting item:", error);
    throw error;
  }
}
