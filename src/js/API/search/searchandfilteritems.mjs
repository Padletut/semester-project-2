import { fetchAndRenderFilteredItems } from "./fetchAndRenderFilteredItems.mjs";
import { rerenderItems } from "./rerenderItems.mjs";
import { handleSearchSubmit } from "./handleSearchSubmit.mjs";
import { handleFilterChange } from "./handleFilterChange.mjs";
import { createQueryParams } from "./createQueryParams.mjs";
import { fetchPage } from "./fetchPage.mjs";
import { initializeObserver } from "./initializeObserver.mjs";
import { attachCardClickListeners } from "./attachCardClickListeners.mjs";
import { setupEventListeners } from "./setupEventListeners.mjs";

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
    this.rerenderItems = () => rerenderItems(this);
    this.handleSearchSubmit = (event) => handleSearchSubmit.call(this, event);
    this.handleFilterChange = () => handleFilterChange(this);
    this.createQueryParams = (params) => createQueryParams(this, params);
    this.fetchPage = (params) => fetchPage(this, params);
    this.initializeObserver = () => initializeObserver(this);
    this.attachCardClickListeners = () => attachCardClickListeners();
    this.setupEventListeners = () => setupEventListeners(this);
    this.setupEventListeners();
  }
}
