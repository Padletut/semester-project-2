import { toggleLoader } from "../../ui/shared/toggleLoader.mjs";
import { renderListingCard } from "../../ui/listings/renderListingCard.mjs";
import { attachCardClickListeners } from "./attachCardClickListeners.mjs";
import { filterActiveItems } from "../utils/filterActiveItems.mjs";
import { capitalizeFirstLetter } from "../../ui/shared/capitalizefirstletter.mjs";
import { renderErrors } from "../../ui/shared/rendererrors.mjs";
import { ERROR_MESSAGES } from "../utils/errormessages.mjs";
import * as constants from "../../constants.mjs";

/**
 * Fetches items based on the current tags and search input, and renders them in the container.
 * This method handles the filtering and rendering of items based on the current state.
 * @private
 * @returns {Promise<void>} - A promise that resolves when the items are fetched and rendered.
 * @example
 * ```javascript
 * await this.fetchAndRenderFilteredItems();
 * ```javascript
 * this.itemsContainer.innerHTML = ""; // Clear the container before rendering
 * this.itemsContainer.appendChild(this.fragment); // Append the fragment to the itemsContainer
 * this.attachCardClickListeners(); // Attach click event listeners to the rendered cards
 * window.scrollTo({ top: 0, behavior: "smooth" });
 * ```
 */
export async function fetchAndRenderFilteredItems(instance) {
  let allItems = [];
  try {
    toggleLoader(true, instance.loaderContainer);

    if (window.currentObserver) {
      window.currentObserver.disconnect();
      window.currentObserver = null;
    }

    const query = instance.searchInput.value.trim().toLowerCase();

    if (instance.tags.length > 0) {
      // Fetch items for each tag
      const fetchPromises = instance.tags.flatMap((tag) => {
        const normalizedTag = tag.trim().toLowerCase();
        const capitalizedTag = capitalizeFirstLetter(normalizedTag);
        return [
          instance.fetchPage(
            instance.createQueryParams({ _tag: normalizedTag }),
          ),
          instance.fetchPage(
            instance.createQueryParams({ _tag: capitalizedTag }),
          ),
        ];
      });
      const results = await Promise.all(fetchPromises);
      allItems = results.flat();

      // If search is also present, filter client-side
      if (query) {
        allItems = allItems.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query),
        );
      }
    } else if (query) {
      // No tags, but search input: use API search endpoint!
      const queryParams = instance.createQueryParams({ q: query });
      const searchEndpoint = `${constants.API_BASE_URL}/auction/listings/search?${queryParams.toString()}`;
      const response = await fetch(searchEndpoint);
      const data = await response.json();
      allItems = data.data || [];
    } else {
      // No tags, no search: fetch all items (first page)
      allItems = await instance.fetchPage(instance.createQueryParams({}));
    }

    allItems = filterActiveItems(allItems);

    instance.uniqueItems = Array.from(
      new Set(allItems.map((item) => item.id)),
    ).map((id) => allItems.find((item) => item.id === id));

    instance.itemsContainer.innerHTML = "";
    instance.fragment.textContent = ""; // Clear fragment
    if (instance.uniqueItems.length === 0) {
      instance.itemsContainer.innerHTML = `<div class="no-results-message">No items found matching your criteria.</div>`;
    } else {
      instance.uniqueItems.forEach((item) => {
        const card = renderListingCard(item);
        if (card) {
          instance.fragment.appendChild(card);
        }
      });
      instance.itemsContainer.appendChild(instance.fragment);
    }
    attachCardClickListeners();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    renderErrors(new Error(ERROR_MESSAGES.LOADING_PAGE_ERROR));
    console.error("Error rendering items:", error);
  } finally {
    toggleLoader(false, instance.loaderContainer);
  }
}
