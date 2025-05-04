/**
 * Observe changes to a specific item in the DOM and trigger a callback function.
 * This function uses the MutationObserver API to watch for changes in the attributes of the target element.
 * When a change is detected, it retrieves the updated item data from the target element's `data-item` attribute
 * @memberof module:UI/events
 * @param {string} targetSelector - The CSS selector for the target element to observe.
 * @param {function} callback - The callback function to execute when changes are detected.
 * @example
 * ```javascript
 * const targetSelector = "#item-detail-container";
 * const callback = (updatedItem) => {
 *   console.log("Item updated:", updatedItem);
 * };
 * observeItemChanges(targetSelector, callback);
 * ```
 */
export function observeItemChanges(targetSelector, callback) {
  const targetNode = document.querySelector(targetSelector);
  if (!targetNode) {
    return;
  }

  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "data-item"
      ) {
        const updatedItem = JSON.parse(targetNode.getAttribute("data-item"));
        callback(updatedItem); // Call the provided callback with the updated data
      }
    }
  });

  observer.observe(targetNode, { attributes: true }); // Observe attribute changes
}
