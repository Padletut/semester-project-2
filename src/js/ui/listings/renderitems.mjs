import { getItems } from "../../API/listings/getitems.mjs";
import { createItemCard } from "./createcard.mjs";
import { renderErrors } from "../shared/rendererrors.mjs";
import { toggleLoader } from "../shared/toggleLoader.mjs";

let nextPage;
let isLastPage = false;
let isSearch = false;

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
  const itemsContainer = document.querySelector(".items-container");
  const loaderContainer = document.getElementById("loader");

  if (!itemsContainer) return;

  if (!append) {
    itemsContainer.innerHTML = ""; // Clear existing items
  }

  try {
    toggleLoader(true, loaderContainer);

    if (!nextPage) nextPage = 1;

    const queryParams = new URLSearchParams({
      _author: "true",
      _comments: "true",
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
        const card = createItemCard(item, itemsContainer);
      });
    }
  } catch (error) {
    renderErrors(error);
    console.error("Error rendering items:", error);
  } finally {
    toggleLoader(false, loaderContainer);
  }
}
