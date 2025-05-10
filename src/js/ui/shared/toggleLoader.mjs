/**
 * Toggles the visibility of the loading container.
 * This function is typically used to show or hide a loading spinner or overlay
 * while waiting for an asynchronous operation to complete.
 * @memberof module:UI/shared
 * @param {boolean} isLoading - If true, the loader will be shown; if false, it will be hidden.
 * @param {HTMLElement} loaderContainer - The HTML element representing the loader container.
 * @example
 * ```javascript
 * const loaderContainer = document.getElementById("loader");
 * toggleLoader(true, loaderContainer); // Show the loader
 * // Perform some async operation
 * toggleLoader(false, loaderContainer); // Hide the loader
 * ```
 * @returns {void}
 */
export function toggleLoader(isLoading, loaderContainer) {
  if (loaderContainer) {
    loaderContainer.style.display = isLoading ? "flex" : "none";
    loaderContainer.style.zIndex = "1000";
  }
}
