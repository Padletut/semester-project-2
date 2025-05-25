import { renderListingCard } from "../../ui/listings/renderListingCard.mjs";
import { toggleLoader } from "../../ui/shared/toggleLoader.mjs";
import * as constants from "../../constants.mjs";
import { renderErrors } from "../../ui/shared/rendererrors.mjs";
import { ERROR_MESSAGES } from "../utils/errormessages.mjs";
import { rerenderItems } from "./rerenderItems.mjs";
import { attachCardClickListeners } from "./attachCardClickListeners.mjs";
import { filterActiveItems } from "../utils/filterActiveItems.mjs";
/**
 * Handles the search form submission event.
 * instance method fetches items based on the search query and updates the DOM accordingly.
 * @private
 * @param {Object} instance - The instance of the class handling the search.
 * @returns {Promise<void>} - A promise that resolves when the search is complete.
 * @example
 * ```javascript
 * instance.searchForm.addEventListener("submit", instance.handleSearchSubmit.bind(instance));
 * ```
 */
export async function handleSearchSubmit(instance) {
  const query = instance.searchInput.value.trim().toLowerCase();
  const isTagActive = instance.tags.length > 0;

  if (!query && !isTagActive) {
    instance.isSearchOrFilterActive = false; // If both search and tags are empty, reset and rerender items
    instance.currentPage = 1; // Reset to the first page
    rerenderItems(instance);
    return;
  }

  instance.isSearchOrFilterActive = true; // Set the flag to indicate search or filter is active

  try {
    instance.currentPage = 1;
    instance.isLastPage = false;
    toggleLoader(true, instance.loaderContainer); // Show loader

    if (window.currentObserver) {
      window.currentObserver.disconnect();
      window.currentObserver = null; // Clear the observer reference
    }

    if (isTagActive) {
      const filteredItems = instance.uniqueItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );

      instance.itemsContainer.innerHTML = "";

      filteredItems.forEach((item) => {
        const card = renderListingCard(item);
        if (card) {
          instance.fragment.appendChild(card); // Append the card to the fragment
        } else {
          console.error("Failed to create card for item:", item);
        }
      });

      instance.itemsContainer.appendChild(instance.fragment);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const queryParams = instance.createQueryParams({
        ...(query && { q: query }), // Include the search query if it exists
      });
      const searchEndpoint = `${constants.API_BASE_URL}/auction/listings/search?${queryParams.toString()}`;
      console.log("Search endpoint:", searchEndpoint);
      const response = await fetch(searchEndpoint);
      if (!response.ok) {
        console.error(`HTTP Error: ${response.status} ${response.statusText}`);
        const responseText = await response.text(); // Log raw response for debugging
        console.error("Raw Response:", responseText);
        throw new Error(
          `Failed to fetch search results: ${response.statusText}`,
        );
      }

      const data = await response.json();
      let items = data.data || [];
      items = filterActiveItems(items);
      const activeSwitch = document.getElementById("switchCheckChecked");
      if (activeSwitch && activeSwitch.checked) {
        const now = new Date();
        items = items.filter((item) => new Date(item.endsAt) > now);
      }

      if (items.length === 0) {
        instance.itemsContainer.innerHTML = `<div class="no-results-message">No items found matching your criteria.</div>`;
        return;
      }

      items.forEach((item) => {
        const card = renderListingCard(item);
        if (card) {
          instance.fragment.appendChild(card); // Append the card to the fragment
        } else {
          console.error("Failed to create card for item:", item);
        }
      });
      instance.itemsContainer.innerHTML = ""; // Clear the container before rendering
      instance.itemsContainer.appendChild(instance.fragment);
      attachCardClickListeners();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (error) {
    renderErrors(new Error(ERROR_MESSAGES.LOADING_SEARCH_ERROR));
    console.error("Error searching items:", error);
  } finally {
    toggleLoader(false, instance.loaderContainer); // Hide loader
  }
}
