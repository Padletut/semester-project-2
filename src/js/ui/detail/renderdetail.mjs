import { getItem } from "../../API/listings/getitem.mjs";
import { createItemCard } from "./createdetailcard.mjs";
import { renderErrors } from "../shared/rendererrors.mjs";
import { toggleLoader } from "../shared/toggleLoader.mjs";

/**
 * * Renders the details of an item in the detail view.
 * @param {number} itemId - The ID of the item to render.
 * @param {HTMLElement} container - The container element to render the item into.
 * @param {HTMLElement} loaderContainer - The loading container element.
 * * @returns {Promise<void>}
 * @example
 * ```javascript
 * const itemId = 123;
 * const container = document.querySelector('.item-detail-container');
 * const loaderContainer = document.getElementById('loader');
 * renderItemDetail(itemId, container, loaderContainer);
 * ```
 */
export async function renderDetail(itemId) {
  console.log("Rendering item detail for ID:", itemId); // Debugging line to check the itemId
  const loaderContainer = document.getElementById("loader");
  toggleLoader(true, loaderContainer);

  try {
    const response = await getItem(itemId);
    console.log(response); // Debugging line to check the item data

    // Render the item details
    createItemCard(response);

    // Render the bid history
    const bidHistoryContainer = document.querySelector(
      ".bid-history-list-body ul",
    );
    if (bidHistoryContainer) {
      bidHistoryContainer.innerHTML = ""; // Clear existing bid history

      if (response.bids && response.bids.length > 0) {
        response.bids.forEach((bid) => {
          const bidDate = new Date(bid.created).toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
          });

          const bidItem = document.createElement("li");
          bidItem.classList.add("d-flex", "justify-content-between");
          bidItem.innerHTML = `
            <div class="bid-list-name flex-grow-1">${bid.bidder.name}</div>
            <div class="bid-list-date flex-grow-1">${bidDate}</div>
            <div class="bid-list-amount flex-grow-1 text-end">${bid.amount} Cr</div>
          `;
          bidHistoryContainer.appendChild(bidItem);
        });
      } else {
        bidHistoryContainer.innerHTML = "<li>No bids yet</li>";
      }
    }
  } catch (error) {
    renderErrors(error);
    console.error("Error rendering item detail:", error);
  } finally {
    toggleLoader(false, loaderContainer); // Hide the loader
  }
}
