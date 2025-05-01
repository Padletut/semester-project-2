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
  }
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
          items.forEach((item) => createItemCard(item, this.itemsContainer));
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

  async rerenderItems() {
    if (this.searchInput.value.trim() || this.filterInput.value.trim()) {
      return;
    }

    try {
      const queryParams = this.createQueryParams({ limit: "10" }); // Set limit to 10 for default items
      const items = await this.fetchPage(queryParams);

      this.itemsContainer.innerHTML = "";
      items.forEach((item) => createItemCard(item, this.itemsContainer));

      this.initializeObserver(); // Initialize the observer for lazy loading

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      renderErrors(new Error("Failed to load items " + error));
      console.error("Error rendering items:", error);
    }
  }

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
        filteredItems.forEach((item) =>
          createItemCard(item, this.itemsContainer),
        );

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
        this.itemsContainer.innerHTML = "";
        items.forEach((item) => createItemCard(item, this.itemsContainer));

        // Attach click event listeners to the rendered cards
        this.attachCardClickListeners();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
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

    // Disconnect the observer if it exists
    if (window.currentObserver) {
      window.currentObserver.disconnect();
      window.currentObserver = null;
    }

    if (this.tags.length === 0) {
      this.isSearchOrFilterActive = false; // Reset the flag if no tags are selected

      this.rerenderItems(); // Fetch and display default items
      return;
    }

    this.isSearchOrFilterActive = true; // Set the flag

    // Fetch and render items with local search filtering
    await this.fetchAndRenderFilteredItems();
  }

  async fetchAndRenderFilteredItems() {
    let allItems = [];
    try {
      // Disconnect the observer if it exists
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

      // Filter items locally by the search query
      const query = this.searchInput.value.trim().toLowerCase();
      if (query) {
        allItems = allItems.filter(
          (item) =>
            item.title.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query),
        );
      }

      // Remove duplicates
      this.uniqueItems = Array.from(
        new Set(allItems.map((item) => item.id)),
      ).map((id) => allItems.find((item) => item.id === id));

      // Clear the container before rendering
      this.itemsContainer.innerHTML = "";

      // Render the filtered items
      this.uniqueItems.forEach((item) =>
        createItemCard(item, this.itemsContainer),
      );

      this.attachCardClickListeners(); // Attach click event listeners to the rendered cards

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      renderErrors(new Error("Failed to load items " + error));
      console.error("Error rendering items:", error);
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

  attachCardClickListeners() {
    const auctionItems = document.querySelectorAll(".card-auction-item");
    auctionItems.forEach((card) => {
      card.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent default behavior
        const itemId = card.dataset.id; // Assuming each card has a data-id attribute

        if (itemId) {
          window.location.href = `detail.html?id=${itemId}`;
        }
      });
    });
  }
}
