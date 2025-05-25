import { renderErrors } from "../../ui/shared/rendererrors.mjs";
import { fetchAndRenderFilteredItems } from "./fetchAndRenderFilteredItems.mjs";

/**
 * Handles the filter input change event.
 * instance method updates the tags based on the filter input and fetches items accordingly.
 * * @private
 * @returns {Promise<void>} - A promise that resolves when the filter change is complete.
 * @example
 * ```javascript
 * instance.filterInput.addEventListener("input", instance.handleFilterChange.bind(instance));
 * ```
 */
export async function handleFilterChange(instance) {
  try {
    const tags = instance.filterInput.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    instance.tags = tags;
    instance.currentPage = 1;
    instance.isLastPage = false;

    // Disconnect the observer if it exists
    if (window.currentObserver) {
      window.currentObserver.disconnect();
      window.currentObserver = null;
    }

    if (instance.tags.length === 0 && !instance.searchInput.value.trim()) {
      instance.isSearchOrFilterActive = false;
      instance.rerenderItems();
      return;
    }

    instance.isSearchOrFilterActive = true;

    await fetchAndRenderFilteredItems(instance);
  } catch (error) {
    renderErrors(
      error,
      "An error occurred while handling the filter change. Please try again later.",
    );
    console.error("Error in handleFilterChange:", error);
  }
}
