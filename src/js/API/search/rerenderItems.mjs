import { toggleLoader } from "../../ui/shared/toggleLoader.mjs";
import { renderListingCard } from "../../ui/listings/renderlistingcard.mjs";
import { renderErrors } from "../../ui/shared/rendererrors.mjs";
import { ERROR_MESSAGES } from "../utils/errormessages.mjs";
/**
 * Rerenders the items in the container based on the current search and filter state.
 * This method fetches items from the API and updates the DOM accordingly.
 * @private
 * @example
 * ```javascript
 * this.rerenderItems();
 * ```
 */
export async function rerenderItems() {
  if (this.searchInput.value.trim() || this.filterInput.value.trim()) {
    return;
  }

  try {
    toggleLoader(true, this.loaderContainer); // Show loader
    const queryParams = this.createQueryParams({ limit: "10" }); // Set limit to 10 for default items
    const items = await this.fetchPage(queryParams);

    // Clear the container before rendering
    this.itemsContainer.innerHTML = "";

    // Render the items
    items.forEach((item) => {
      const card = renderListingCard(item, this.itemsContainer);
      if (card) {
        this.fragment.appendChild(card); // Append the card to the fragment
      } else {
        console.error("Failed to create card for item:", item);
      }
    });

    // Append the fragment to the itemsContainer
    this.itemsContainer.appendChild(this.fragment);
    this.initializeObserver();
    this.attachCardClickListeners();

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    renderErrors(new Error(ERROR_MESSAGES.LOADING_PAGE_ERROR));
    console.error("Error rendering items:", error);
  } finally {
    toggleLoader(false, this.loaderContainer); // Hide loader
  }
}
