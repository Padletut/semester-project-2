import { debounce } from "../utils/debounce.mjs";

/**
 * Sets up event listeners for the search and filter inputs.
 * instance method attaches event listeners to handle user interactions with the search form and filter input.
 * @private
 * @example
 * ```javascript
 * instance.setupEventListeners();
 * ```
 */
export function setupEventListeners(instance) {
  // Search form submit listener
  if (instance.searchForm) {
    instance.searchForm.addEventListener("submit", function (event) {
      event.preventDefault();
      if (typeof instance.handleSearchSubmit === "function") {
        instance.handleSearchSubmit(event);
      }
    });
  }

  // Search input change listener
  if (instance.searchInput) {
    instance.searchInput.addEventListener(
      "input",
      debounce(async () => {
        const query = instance.searchInput.value.trim();
        if (!query) {
          instance.currentPage = 1;
          instance.isLastPage = false;
          await instance.rerenderItems(); // Fetch and display default items
          instance.initializeObserver();
        }
      }, 300),
    );
  }

  // Filter input change listener
  if (instance.filterInput) {
    instance.filterInput.addEventListener(
      "input",
      debounce(instance.handleFilterChange.bind(instance), 300),
    );
  }
}
