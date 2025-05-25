import { renderListingCard } from "../../ui/listings/renderListingCard.mjs";

/**
 * Initializes the Intersection Observer for lazy loading items.
 * instance method sets up an observer that triggers when the sentinel element is in view.
 * @private
 * @example
 * ```javascript
 * instance.initializeObserver();
 * ```
 */
export function initializeObserver(instance) {
  if (!instance.sentinel) {
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
      if (entry.isIntersecting && !instance.isLastPage) {
        const queryParams = instance.createQueryParams({ limit: "10" }); // Ensure limit is consistent
        const items = await instance.fetchPage(queryParams);
        items.forEach((item) => {
          const card = renderListingCard(item, instance.itemsContainer);
          if (card) {
            instance.itemsContainer.appendChild(card);
          } else {
            console.error("Failed to create card for item:", item);
          }
        });
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

  observer.observe(instance.sentinel); // Start observing the sentinel
}
