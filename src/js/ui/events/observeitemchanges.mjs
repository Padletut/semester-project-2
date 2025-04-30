/**
 * Observe changes to a specific item in the DOM and trigger a callback function.
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
    console.error(`Target node with selector "${targetSelector}" not found.`);
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
