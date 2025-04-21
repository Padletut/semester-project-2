import { getItems } from "../../API/listings/getitems.mjs";
import { createItemCard } from "./createcard.mjs";
import { renderErrors } from "../shared/rendererrors.mjs";
import { toggleLoader } from "../shared/toggleLoader.mjs";

//let isSearch = false;

/**
 * Render items in the listings view.
 * @param {Array} items - The array of items to render.
 * @param {HTMLElement} container - The container element to render the items into.
 * @param {HTMLElement} loaderContainer - The loading container element.
 * * @param {boolean} isLoading - Whether to show the loading state.
 * @param {boolean} isSearch - Whether the items are being searched.
 * @returns {Promise<void>}
 * @example
 * ```javascript
 * const items = await getItems(queryParams, isSearch);
 * renderItems(items, container, loaderContainer, isLoading, isSearch);
 * ```javascript
 */

export async function renderItems(
  profileName = null,
  append = false,
  tag = null,
) {
  let nextPage = 1; // Start with page 1
  let isLastPage = false;
  const itemsContainer = document.querySelector(".items-container");
  const loaderContainer = document.getElementById("loader");
  const activeSwitch = document.getElementById("switchCheckChecked");
  const sentinel = document.getElementById("sentinel"); // The sentinel element for lazy loading

  if (!sentinel) return; // Ensure the sentinel element exists
  if (!itemsContainer) return;

  if (!append) {
    itemsContainer.innerHTML = ""; // Clear existing items
  }

  // Disconnect any existing observer
  if (window.currentObserver) {
    window.currentObserver.disconnect();
  }

  const loadItems = async () => {
    if (isLastPage) return; // Stop fetching if it's the last page

    try {
      toggleLoader(true, loaderContainer);

      const isActive = activeSwitch.checked;

      const queryParams = new URLSearchParams({
        _seller: "true",
        _bids: "true",
        _active: isActive.toString(), // Use the value of the activeSwitch
        limit: "10",
        page: nextPage,
      });

      const response = await getItems(queryParams, profileName, tag);

      if (response.data.length > 0) {
        const items = response.data;
        const meta = response.meta;
        nextPage = meta.nextPage;
        isLastPage = meta.isLastPage;

        items.forEach((item) => {
          createItemCard(item, itemsContainer);
        });
      }
    } catch (error) {
      renderErrors(error);
      console.error("Error rendering items:", error);
    } finally {
      toggleLoader(false, loaderContainer);
    }
  };

  // Create a new observer
  const observer = new IntersectionObserver(
    async (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        await loadItems(); // Fetch the next page when the sentinel is visible
      }
    },
    {
      root: null, // Use the viewport as the root
      rootMargin: "0px 0px 200px 0px",
      threshold: 0, // Trigger when the sentinel is fully visible
    },
  );

  // Save the observer globally so it can be disconnected later
  window.currentObserver = observer;

  observer.observe(sentinel); // Start observing the sentinel
}
