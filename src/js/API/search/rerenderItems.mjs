import { toggleLoader } from "../../ui/shared/toggleLoader.mjs";
import { renderListingCard } from "../../ui/listings/renderListingCard.mjs";
import { renderErrors } from "../../ui/shared/rendererrors.mjs";
import { ERROR_MESSAGES } from "../utils/errormessages.mjs";

/**
 * Rerenders the items in the container based on the current search and filter state.
 * This method fetches items from the API and updates the DOM accordingly.
 * @private
 * @example
 * ```javascript
 * rerenderItems(instance);
 * ```
 */
export async function rerenderItems(instance) {
  if (instance.searchInput.value.trim() || instance.filterInput.value.trim()) {
    return;
  }

  try {
    toggleLoader(true, instance.loaderContainer); // Show loader
    const queryParams = instance.createQueryParams({ limit: "10" }); // Set limit to 10 for default items
    const items = await instance.fetchPage(queryParams);

    // Clear the container before rendering
    instance.itemsContainer.innerHTML = "";

    // Render the items
    items.forEach((item) => {
      const card = renderListingCard(item, instance.itemsContainer);
      if (card) {
        instance.fragment.appendChild(card); // Append the card to the fragment
      } else {
        console.error("Failed to create card for item:", item);
      }
    });

    // Append the fragment to the itemsContainer
    instance.itemsContainer.appendChild(instance.fragment);
    instance.initializeObserver(instance);
    instance.attachCardClickListeners();

    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    renderErrors(new Error(ERROR_MESSAGES.LOADING_PAGE_ERROR));
    console.error("Error rendering items:", error);
  } finally {
    toggleLoader(false, instance.loaderContainer); // Hide loader
  }
}
