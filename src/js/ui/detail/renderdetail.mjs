import { getItem } from "../../API/listings/getitem.mjs";
import { createItemCard } from "./createdetailcard.mjs";
import { renderErrors } from "../shared/rendererrors.mjs";
import { toggleLoader } from "../shared/toggleLoader.mjs";

/**
 * * Renders the details of an item in the detail view.
 * @param {number} itemId - The ID of the item to render.
 * @param {HTMLElement} container - The container element to render the item into.
 * @param {HTMLElement} loaderContainer - The loading container element.
 * * @returns {Promise<void>}
 * @example
 * ```javascript
 * const itemId = 123;
 * const container = document.querySelector('.item-detail-container');
 * const loaderContainer = document.getElementById('loader');
 * renderItemDetail(itemId, container, loaderContainer);
 * ```
 */
export async function renderDetail(itemId) {
  console.log("Rendering item detail for ID:", itemId); // Debugging line to check the itemId
  const loaderContainer = document.getElementById("loader");
  toggleLoader(true, loaderContainer);

  try {
    const response = await getItem(itemId);
    console.log(response); // Debugging line to check the item data
    createItemCard(response);
  } catch (error) {
    renderErrors(error);
    console.error("Error rendering item detail:", error);
  } finally {
    toggleLoader(false, loaderContainer); // Hide the loader
  }
}
