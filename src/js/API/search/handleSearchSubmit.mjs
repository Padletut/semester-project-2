import { renderListingCard } from "../../ui/listings/renderlistingcard.mjs";
import { toggleLoader } from "../../ui/shared/toggleLoader.mjs";
import * as constants from "../../constants.mjs";
import { renderErrors } from "../../ui/shared/rendererrors.mjs";
import { ERROR_MESSAGES } from "../utils/errormessages.mjs";
/**
 * Handles the search form submission event.
 * This method fetches items based on the search query and updates the DOM accordingly.
 * @private
 * @param {Event} event - The form submission event.
 * @returns {Promise<void>} - A promise that resolves when the search is complete.
 * @example
 * ```javascript
 * this.searchForm.addEventListener("submit", this.handleSearchSubmit.bind(this));
 * ```
 */
export async function handleSearchSubmit(event) {
  event.preventDefault();

  const query = this.searchInput.value.trim().toLowerCase();
  const isTagActive = this.tags.length > 0;

  if (!query && !isTagActive) {
    // If both search and tags are empty, reset and rerender items
    this.isSearchOrFilterActive = false;
    this.currentPage = 1; // Reset to the first page
    this.rerenderItems(); // Fetch and display default items
    return;
  }

  this.isSearchOrFilterActive = true; // Set the flag to indicate search or filter is active

  try {
    this.currentPage = 1;
    this.isLastPage = false;
    toggleLoader(true, this.loaderContainer); // Show loader

    // Disconnect the observer if it exists
    if (window.currentObserver) {
      window.currentObserver.disconnect();
      window.currentObserver = null; // Clear the observer reference
    }

    if (isTagActive) {
      // Filter the already fetched items locally
      const filteredItems = this.uniqueItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );

      // Clear the container before rendering
      this.itemsContainer.innerHTML = "";

      // Render the filtered items
      filteredItems.forEach((item) => {
        const card = renderListingCard(item);
        if (card) {
          this.fragment.appendChild(card); // Append the card to the fragment
        } else {
          console.error("Failed to create card for item:", item);
        }
      });

      // Append the fragment to the itemsContainer
      this.itemsContainer.appendChild(this.fragment);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Construct query parameters with dynamic limit
      const queryParams = this.createQueryParams({
        ...(query && { q: query }), // Include the search query if it exists
      });
      // Construct the full search endpoint with API_BASE_URL
      const searchEndpoint = `${constants.API_BASE_URL}/auction/listings/search?${queryParams.toString()}`;
      // Fetch search results
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
      const items = data.data || [];

      // Render the search results
      items.forEach((item) => {
        const card = renderListingCard(item);
        if (card) {
          this.fragment.appendChild(card); // Append the card to the fragment
        } else {
          console.error("Failed to create card for item:", item);
        }
      });
      this.itemsContainer.innerHTML = ""; // Clear the container before rendering
      this.itemsContainer.appendChild(this.fragment);

      // Attach click event listeners to the rendered cards
      this.attachCardClickListeners();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  } catch (error) {
    renderErrors(new Error(ERROR_MESSAGES.LOADING_SEARCH_ERROR));
    console.error("Error searching items:", error);
  } finally {
    toggleLoader(false, this.loaderContainer); // Hide loader
  }
}
