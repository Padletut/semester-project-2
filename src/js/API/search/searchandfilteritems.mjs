import { getItems } from "../../API/listings/getitems.mjs";
import { renderListingCard } from "../../ui/listings/renderlistingcard.mjs";
import { renderErrors } from "../../ui/shared/rendererrors.mjs";
import { debounce } from "../utils/debounce.mjs";
import * as constants from "../../constants.mjs";
import { ERROR_MESSAGES } from "../utils/errormessages.mjs";
import { toggleLoader } from "../../ui/shared/toggleLoader.mjs";
import { fetchAndRenderFilteredItems } from "./fetchAndRenderFilteredItems.mjs";

/**
 * Class representing a search and filter functionality for items.
 * This class handles fetching, rendering, and filtering items based on search queries and tags.
 * It also manages pagination and lazy loading of items as the user scrolls.
 * @memberof module:API/search
 * @class
 * @param {HTMLElement} itemsContainer - The container element for the items.
 * @property {string[]} tags - An array of tags to filter the items by.
 * @property {Object[]} uniqueItems - A list of unique items fetched from the API.
 * @property {number} currentPage - The current page number for pagination.
 * @property {boolean} isLastPage - A flag indicating if the last page has been reached.
 * @property {boolean} isSearchOrFilterActive - A flag indicating if a search or filter is active.
 * @property {DocumentFragment} fragment - A document fragment used for efficient DOM updates.
 * @property {HTMLElement} loaderContainer - The loader element for showing loading states.
 * @property {HTMLFormElement} searchForm - The search form element.
 * @property {HTMLInputElement} searchInput - The search input element.
 * @property {HTMLInputElement} filterInput - The filter input element.
 * @property {HTMLElement} sentinel - The sentinel element for lazy loading.
 * @example
 * ```javascript
 * const itemsContainer = document.getElementById("items-container");
 * const searchAndFilter = new SearchAndFilterItems(itemsContainer);
 * ```
 */
export class SearchAndFilterItems {
  constructor(itemsContainer) {
    this.itemsContainer = itemsContainer;
    this.tags = [];
    this.uniqueItems = [];
    this.currentPage = 1;
    this.isLastPage = false;
    this.isSearchOrFilterActive = false; // Flag to track if search or filter is active
    this.fragment = document.createDocumentFragment();
    this.loaderContainer = document.getElementById("loader");

    // Update selectors to match index.html
    this.searchForm = document.querySelector('form[role="search"]');
    this.searchInput = document.querySelector('input[name="search"]');
    this.filterInput = document.querySelector('input[name="filter-tags"]');
    this.sentinel = document.getElementById("sentinel");

    this.fetchAndRenderFilteredItems = () => fetchAndRenderFilteredItems(this);
    this.setupEventListeners();
  }
  /**
   * Creates query parameters for fetching items from the API.
   * @private
   * @param {Object} additionalParams - Additional query parameters to include.
   * @returns {URLSearchParams} - The constructed query parameters.
   * @example
   * ```javascript
   * const queryParams = this.createQueryParams({ _tag: "electronics" });
   * ```
   */
  createQueryParams(additionalParams = {}) {
    const activeSwitch = document.getElementById("switchCheckChecked");
    const isActive = activeSwitch.checked;
    // Include the search query if it exists
    const searchQuery = this.searchInput.value.trim();
    // Include the first tag if tags are active, or leave it empty
    const tag = this.tags.length > 0 ? this.tags[0] : "";

    return new URLSearchParams({
      _seller: "true",
      _bids: "true",
      _active: isActive.toString(),
      limit: "100", // Fetch more items at once
      sort: "created",
      ...(searchQuery && { q: searchQuery }), // Add search query if it exists
      ...(tag && { _tag: tag }), // Add _tag if it exists
      ...additionalParams, // Add additional parameters like `_tag`
    });
  }

  async fetchPage(queryParams) {
    queryParams.set("page", this.currentPage);

    const response = await getItems(queryParams);

    if (response && response.data) {
      this.isLastPage = response.meta.isLastPage;
      this.currentPage = response.meta.nextPage;
      return response.data;
    } else {
      this.isLastPage = true;
      return [];
    }
  }
  /**
   * Initializes the Intersection Observer for lazy loading items.
   * This method sets up an observer that triggers when the sentinel element is in view.
   * @private
   * @example
   * ```javascript
   * this.initializeObserver();
   * ```
   */
  initializeObserver() {
    if (!this.sentinel) {
      console.error("Sentinel element not found for observer.");
      return;
    }

    // Disconnect any existing observer
    if (window.currentObserver) {
      window.currentObserver.disconnect();
      window.currentObserver = null;
    }

    // Create a new observer
    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !this.isLastPage) {
          const queryParams = this.createQueryParams({ limit: "10" }); // Ensure limit is consistent
          const items = await this.fetchPage(queryParams);

          // Render the new items
          items.forEach((item) => renderListingCard(item, this.itemsContainer));
        }
      },
      {
        root: null, // Use the viewport as the root
        rootMargin: "0px 0px 40% 0px", // Adjust margin for earlier triggering
        threshold: 0, // Trigger when the sentinel is fully visible
      },
    );

    // Save the observer globally so it can be disconnected later
    window.currentObserver = observer;

    observer.observe(this.sentinel); // Start observing the sentinel
  }
  /**
   * Rerenders the items in the container based on the current search and filter state.
   * This method fetches items from the API and updates the DOM accordingly.
   * @private
   * @example
   * ```javascript
   * this.rerenderItems();
   * ```
   */
  async rerenderItems() {
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
  async handleSearchSubmit(event) {
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
          console.error(
            `HTTP Error: ${response.status} ${response.statusText}`,
          );
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
  /**
   * Handles the filter input change event.
   * This method updates the tags based on the filter input and fetches items accordingly.
   * * @private
   * @returns {Promise<void>} - A promise that resolves when the filter change is complete.
   * @example
   * ```javascript
   * this.filterInput.addEventListener("input", this.handleFilterChange.bind(this));
   * ```
   */
  async handleFilterChange() {
    const tags = this.filterInput.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    this.tags = tags;
    this.currentPage = 1;
    this.isLastPage = false;

    // Disconnect the observer if it exists
    if (window.currentObserver) {
      window.currentObserver.disconnect();
      window.currentObserver = null;
    }

    if (this.tags.length === 0 && !this.searchInput.value.trim()) {
      this.isSearchOrFilterActive = false; // Reset the flag if no tags are selected

      this.rerenderItems(); // Fetch and display default items
      return;
    }

    this.isSearchOrFilterActive = true; // Set the flag

    // Fetch and render items with local search filtering
    await this.fetchAndRenderFilteredItems();
  }

  /**
   * Sets up event listeners for the search and filter inputs.
   * This method attaches event listeners to handle user interactions with the search form and filter input.
   * @private
   * @example
   * ```javascript
   * this.setupEventListeners();
   * ```
   */
  setupEventListeners() {
    // Search form submit listener
    if (this.searchForm) {
      this.searchForm.addEventListener(
        "submit",
        this.handleSearchSubmit.bind(this),
      );
    }

    // Search input change listener
    if (this.searchInput) {
      this.searchInput.addEventListener(
        "input",
        debounce(async () => {
          const query = this.searchInput.value.trim();
          if (!query) {
            this.currentPage = 1;
            this.isLastPage = false;
            await this.rerenderItems(); // Fetch and display default items
          }
        }, 300),
      );
    }

    // Filter input change listener
    if (this.filterInput) {
      this.filterInput.addEventListener(
        "input",
        debounce(this.handleFilterChange.bind(this), 300),
      );
    }
  }
  /**
   * Attaches click event listeners to the item cards.
   * This method adds event listeners to each card to handle navigation to the item detail page.
   * @private
   * @example
   * ```javascript
   * this.attachCardClickListeners();
   * ```
   */
  attachCardClickListeners() {
    const auctionItems = document.querySelectorAll(".card-auction-item");
    auctionItems.forEach((card) => {
      card.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default behavior
        const itemId = card.dataset.id; // Assuming each card has a data-id attribute

        if (itemId) {
          window.location.assign(`/detail?id=${itemId}`);
        }
      });
    });
  }
}
