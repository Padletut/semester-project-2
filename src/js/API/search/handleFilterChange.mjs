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
export async function handleFilterChange() {
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
