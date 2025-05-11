/**
 * Updates the item detail in the specified container.
 * This function sets the updated item data in the target container's `data-item` attribute.
 * It is typically used to refresh the item detail after an update or modification.
 * @memberof module:UI/events
 * @param {string} targetSelector - The CSS selector for the target container.
 * @param {Object} updatedItem - The updated item data to set in the container.
 * @example
 * ```javascript
 * const updatedItem = {
 *  title: "Updated Auction Item",
 * description: "Updated description",
 * bids: [{ amount: 150 }, { amount: 250 }],
 * endsAt: "2023-11-01T00:00:00Z",
 * };
 * updateItemDetail("#item-detail-container", updatedItem);
 * ```
 **/
export function updateItemDetail(targetSelector, updatedItem) {
  const container = document.querySelector(targetSelector);
  if (container) {
    if (updatedItem && typeof updatedItem === "object") {
      container.setAttribute("data-item", JSON.stringify(updatedItem)); // Update the data-item attribute
    } else {
      console.error("Invalid updatedItem provided:", updatedItem);
    }
  } else {
    console.error(`Container with selector "${targetSelector}" not found.`);
  }
}
