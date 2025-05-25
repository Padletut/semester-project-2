import * as constants from "../../constants.mjs";
import { headers } from "../utils/headers.mjs";
import { renderSuccess } from "../../ui/shared/rendersuccess.mjs";
import { handleItemDeletionNavigation } from "../../ui/shared/handleitemdeletionnavigation.mjs";
import { ERROR_MESSAGES } from "../utils/errormessages.mjs";
import { renderErrors } from "../../ui/shared/rendererrors.mjs";

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
      renderErrors(new Error(ERROR_MESSAGES.ITEM_DELETION_FAILED));
      throw new Error(ERROR_MESSAGES.ITEM_DELETION_FAILED);
    }

    renderSuccess({ message: "Listing deleted successfully!" });
    setTimeout(() => {
      handleItemDeletionNavigation(itemId);
    }, 5000);
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
}
