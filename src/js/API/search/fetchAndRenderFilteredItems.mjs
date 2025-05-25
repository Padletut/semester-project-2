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
    const {
      loaderContainer,
      tags,
      searchInput,
      itemsContainer,
      fragment,
      attachCardClickListeners,
      renderListingCard,
      toggleLoader,
    } = instance;

    toggleLoader(true, loaderContainer);

    if (window.currentObserver) {
      window.currentObserver.disconnect();
      window.currentObserver = null;
    }

    const fetchPromises = tags.map((tag) => {
      const normalizedTag = tag.trim().toLowerCase();
      return instance.fetchPage(
        instance.createQueryParams({ _tag: normalizedTag }),
      );
    });
    const results = await Promise.all(fetchPromises);
    allItems = results.flat();

    const query = searchInput.value.trim().toLowerCase();
    if (query) {
      allItems = allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query),
      );
    }

    instance.uniqueItems = Array.from(
      new Set(allItems.map((item) => item.id)),
    ).map((id) => allItems.find((item) => item.id === id));

    itemsContainer.innerHTML = "";
    instance.uniqueItems.forEach((item) => {
      const card = renderListingCard(item);
      if (card) {
        fragment.appendChild(card);
      }
    });
    itemsContainer.appendChild(fragment);
    attachCardClickListeners();
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    instance.renderErrors(
      new Error(instance.ERROR_MESSAGES.LOADING_PAGE_ERROR),
    );
    console.error("Error rendering items:", error);
  } finally {
    instance.toggleLoader(false, instance.loaderContainer);
  }
}
