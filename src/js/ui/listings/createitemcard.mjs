import * as constants from "../../constants.mjs";
import { createBid } from "../../API/bid/createbid.mjs";
import { validateBidInput } from "../bootstrap/validatebidinput.mjs";
import { handleErrors } from "../../API/utils/handleerrors.mjs";
import { loadStorage } from "../../storage/loadstorage.mjs";
import { renderCredits } from "../shared/rendercredits.mjs";

/**
 * Creates a post card element and appends it to the listings container.
 * @memberof module:UI/listings
 * @param {Object} item - The item object containing details of the auction item.
 * @param {HTMLElement} container - The container element to render the item into.
 * @example
 * ```javascript
 *  const item = {
 *   media: [{ url: "https://example.com/image.jpg", alt: "Item Image" }],
 *  title: "Auction Item",
 *  description: "Description of the item",
 *  seller: { name: "Seller Name" },
 *  bids: [{ amount: 100 }, { amount: 200 }],
 *  endsAt: "2023-10-01T00:00:00Z",
 *  created: "2023-09-01T00:00:00Z",
 *  };
 *  };
 * const container = document.getElementById("item-container");
 *  createItemCard(item, container);
 *  ```
 */
export function createItemCard(item) {
  const { STORAGE_KEYS } = constants;
  const { PROFILE } = STORAGE_KEYS;
  const profileName = loadStorage(PROFILE)?.name;
  const cardWrapper = document.createElement("div");
  cardWrapper.classList.add("col-12", "col-md-6", "col-lg-4", "col-xxl-3");

  const card = document.createElement("div");
  card.classList.add("card", "card-auction-item", "mb-4");
  card.setAttribute("data-id", item.id);
  card.style.cursor = "pointer";

  const imageUrl = item.media?.[0]?.url || "img/sunflowers-1719119_640.jpg";
  const imageAlt = item.media?.[0]?.alt || "Auction Item";
  // Check if the auction has ended
  const endsAtDate = new Date(item.endsAt);
  const isAuctionEnded = endsAtDate <= new Date();

  card.innerHTML = `
    <div class="card-header d-flex justify-content-between align-items-center position-relative p-0">
      <img
        src="${imageUrl}"
        class="card-img-top"
        alt="${imageAlt}"
      />
      <div class="container position-absolute top-0 end-0 p-2 rounded-3 mt-2 me-2 text-center text-light card-display-bids">
        ${item.bids?.length || 0} bids
      </div>
      <div class="container position-absolute bottom-0 end-0 p-2 rounded-3 me-2 mb-2 text-center text-light card-display-ends">
            Ends ${
              new Date(item.endsAt).toLocaleDateString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
              }) || "N/A"
            }
      </div>
    </div>
    <div class="card-body">
      <div class="d-flex flex-wrap column-gap-2 justify-content-between">
        <div>
          <h2 class="card-title m-0">${item.title || "Untitled"}</h2>
        </div>
        <div class="d-flex">
          <small class="text-nowrap">Posted ${new Date(item.created).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) || "N/A"}</small>
        </div>
      </div>
      <i class="card-author" name="${item.seller.name}">By <a href="#">${item.seller.name || "Unknown"}</a></i>
      <div class="d-flex flex-wrap gap-2 mt-3 mb-3 card-tags">
        ${
          item.tags
            ?.map(
              (tag) => `
          <a
            href="#"
            class="btn btn-secondary btn-sm rounded-5"
            data-bs-toggle="offcanvas"
            role="button"
          >
            ${tag}
          </a>
        `,
            )
            .join("") || ""
        }
      </div>
      <p class="card-text mt-3">
        ${item.description || "Beautiful auction item with no description."}
      </p>
            <div class="container-fluid card-recent-bids p-0 pt-3 pb-5 mb-3">
        <h2>Recent Bids:</h2>
        <ul>
          ${
            item.bids?.length
              ? item.bids
                  .sort((a, b) => b.amount - a.amount) // Sort bids by highest amount first
                  .slice(0, 5) // Get the top 5 bids
                  .map(
                    (bid) =>
                      `<li>${bid.amount} Credits By ${
                        profileName
                          ? `<a class="bidder-link" href="#">${bid.bidder.name || "Unknown"}</a>`
                          : `${bid.bidder.name || "Unknown"}`
                      }</li>`,
                  )
                  .join("")
              : "<li>No bids yet</li>"
          }
        </ul>
      </div>
            ${
              item.seller.name !== profileName
                ? `
        <form class="needs-validation fixed-bottom m-3" novalidate>
          <div class="input-group mb-3">
            <input
              type="number"
              class="form-control"
              placeholder="Enter your bid"
              aria-label="Bid Amount"
              name="bid-amount"
              required
              ${isAuctionEnded ? "disabled" : ""} 
            />
            <button
              class="btn btn-secondary rounded-end place-bid-button"
              type="submit"
              title="Place a Bid"
              ${isAuctionEnded ? "disabled" : ""} 
            >
              Place Bid
            </button>
            <div class="invalid-feedback">Please enter a valid bid amount.</div>
            <div class="valid-feedback d-none">Bid placed successfully!</div>
          </div>
        </form>
        `
                : ""
            }
    </div>
  `;

  cardWrapper.appendChild(card);

  if (!profileName) {
    // Wrap the button in a div for the tooltip to work
    const wrapper = document.createElement("div");
    const placeBidButton = card.querySelector(".place-bid-button");
    wrapper.setAttribute("data-bs-toggle", "tooltip");
    wrapper.setAttribute("title", "Please log in to place a bid");
    placeBidButton.parentNode.insertBefore(wrapper, placeBidButton);
    wrapper.appendChild(placeBidButton);

    placeBidButton.disabled = true;

    // Initialize the tooltip for the wrapper only
    new bootstrap.Tooltip(wrapper);
  }

  // Add event listener to the card for bid submission
  const form = card.querySelector("form");
  if (form) {
    form.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent the card's click event from triggering
    });
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const isValid = await validateBidInput(form);
      if (isValid) {
        try {
          const bidInput = form.querySelector("input[name='bid-amount']");
          const bidAmount = parseFloat(bidInput.value); // Get the bid amount from the input field
          await createBid(item.id, bidAmount);
          const feedbackElement = form.querySelector(".valid-feedback");
          feedbackElement.classList.add("d-block"); // Ensure the success message is visible

          // Optionally, you can refresh the card or show a success message here
          // Refresh card Recent Bids section
          const recentBidsList = card.querySelector(".card-recent-bids ul");
          const newBidItem = document.createElement("li");
          newBidItem.innerHTML = `${bidAmount} Credits By <a href="#">${profileName}</a>`;
          recentBidsList.appendChild(newBidItem); // Append the new bid to the list
          renderCredits(); // Update credits in the header
          bidInput.value = ""; // Clear the input field after successful bid
        } catch (error) {
          handleErrors(error);
          console.error("Error placing bid:", error);
        }
      }
    });
  }
  return cardWrapper;
}
