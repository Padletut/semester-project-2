/**
 * Toggles the visibility of the loading container.
 * @param {boolean} isLoading - Whether to show or hide the loading container.
 * @example
 * ```javascript
 * toggleLoader(true); // Show the loader
 * toggleLoader(false); // Hide the loader
 * ```
 */
export function toggleLoader(isLoading, loaderContainer) {
  if (loaderContainer) {
    loaderContainer.style.display = isLoading ? "flex" : "none";
    loaderContainer.style.zIndex = "1000";
  }
}
