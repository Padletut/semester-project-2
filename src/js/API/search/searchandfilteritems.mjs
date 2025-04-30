import { getItems } from "../../API/listings/getitems.mjs";
import { createItemCard } from "../../ui/listings/createitemcard.mjs";
import { renderErrors } from "../../ui/shared/rendererrors.mjs";
import { debounce } from "../utils/debounce.mjs";
import * as constants from "../../constants.mjs";

export class SearchAndFilterItems {
  constructor(itemsContainer) {
    this.itemsContainer = itemsContainer;
    this.tags = [];
    this.uniqueItems = [];
    this.currentPage = 1;
    this.isLastPage = false;
    this.isSearchOrFilterActive = false; // Flag to track if search or filter is active

    // Update selectors to match index.html
    this.searchForm = document.querySelector('form[role="search"]');
    this.searchInput = document.querySelector('input[name="search"]');
    this.filterInput = document.querySelector('input[name="filter-tags"]');
    this.sentinel = document.getElementById("sentinel");

    this.setupEventListeners();
    this.setupIntersectionObserver();
  }
  createQueryParams(additionalParams = {}) {
    const activeSwitch = document.getElementById("switchCheckChecked");
    const isActive = activeSwitch.checked;
    // Include the search query if it exists
    const searchQuery = this.searchInput.value.trim();
    // Include the tags if they exist
    const tags = this.tags.length > 0 ? this.tags : null;
    return new URLSearchParams({
      _seller: "true",
      _bids: "true",
      _active: isActive.toString(),
      limit: "10",
      sort: "created",
      ...(searchQuery && { q: searchQuery }), // Add search query if it exists
      ...(tags && { _tags: tags.join(",") }), // Add tags if they exist
      ...additionalParams,
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

  async rerenderItems() {
    if (this.searchInput.value.trim() || this.filterInput.value.trim()) {
      return;
    }

    try {
      const queryParams = this.createQueryParams();
      const items = await this.fetchPage(queryParams);

      this.itemsContainer.innerHTML = "";
      items.forEach((item) => createItemCard(item, this.itemsContainer));

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      renderErrors(new Error("Failed to load items " + error));
      console.error("Error rendering items:", error);
    }
  }

  async handleSearchSubmit(event) {
    event.preventDefault();

    const query = this.searchInput.value.trim();
    if (!query) {
      this.isSearchOrFilterActive = false; // Reset the flag if the search input is empty
      this.rerenderItems(); // Fetch and display default items
      return;
    }

    this.isSearchOrFilterActive = true; // Set the flag to indicate search is active

    try {
      this.currentPage = 1;
      this.isLastPage = false;

      // Construct query parameters
      const queryParams = new URLSearchParams({
        _seller: "true",
        _bids: "true",
        _active: "true",
        limit: "10",
        sort: "created",
        q: query,
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
      this.itemsContainer.innerHTML = "";
      items.forEach((item) => createItemCard(item, this.itemsContainer));
    } catch (error) {
      renderErrors(new Error("Failed to load search results"));
      console.error("Error searching items:", error);
    }
  }

  async handleFilterChange() {
    const tags = this.filterInput.value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    this.tags = tags;
    this.currentPage = 1;
    this.isLastPage = false;

    if (this.tags.length === 0) {
      this.isSearchOrFilterActive = false; // Reset the flag if no tags are selected
      this.rerenderItems(); // Fetch and display default items
    }

    if (this.tags.length > 0) {
      await this.fetchAndRenderFilteredItems();
    }
  }

  async fetchAndRenderFilteredItems() {
    let allItems = [];
    try {
      // Disconnect the observer to prevent interference
      if (window.currentObserver) {
        window.currentObserver.disconnect();
        window.currentObserver = null;
      }

      // Fetch items for each tag
      const fetchPromises = this.tags.map(async (tag) => {
        const queryParams = this.createQueryParams({ _tag: tag });
        const items = await this.fetchPage(queryParams);
        return items;
      });
      // Wait for all fetches to complete
      const results = await Promise.all(fetchPromises);

      // Flatten the results into a single array
      allItems = results.flat();

      // Filter items to ensure they match all selected tags
      const filteredItems = allItems.filter((item) =>
        this.tags.every((tag) => item.tags.includes(tag)),
      );

      // Remove duplicates
      this.uniqueItems = Array.from(
        new Set(filteredItems.map((item) => item.id)),
      ).map((id) => filteredItems.find((item) => item.id === id));

      // Clear the container before rendering
      this.itemsContainer.innerHTML = "";

      // Render the filtered items

      this.uniqueItems.forEach((item) =>
        createItemCard(item, this.itemsContainer),
      );

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      renderErrors(new Error("Failed to load items " + error));
      console.error("Error rendering items:", error);
    }
  }

  async fetchNextPage() {
    if (this.isLastPage || this.isSearchOrFilterActive) return;

    try {
      const queryParams = this.createQueryParams();
      const items = await this.fetchPage(queryParams);

      items.forEach((item) => createItemCard(item, this.itemsContainer));
    } catch (error) {
      renderErrors(new Error("Failed to load more items " + error));
      console.error("Error fetching next page:", error);
    }
  }

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

  setupIntersectionObserver() {
    if (!this.sentinel) return;

    const observer = new IntersectionObserver(
      async (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          await this.fetchNextPage(); // Fetch the next page when the sentinel is visible
        }
      },
      {
        root: null, // Use the viewport as the root
        rootMargin: "0px 0px 40% 0px",
        threshold: 0, // Trigger when the sentinel is fully visible
      },
    );

    observer.observe(this.sentinel);
  }
}
