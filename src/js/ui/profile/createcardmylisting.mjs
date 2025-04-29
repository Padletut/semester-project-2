import { createPostItemModal } from "../listings/createpostitemmodal.mjs";
import { loadStorage } from "../../storage/loadstorage.mjs";
/**
 * Creates a post card element and appends it to my listings container.
 * @memberof module:Listings
 * @param {Object} item - The item object containing auction data.
 * @param {HTMLElement} container - The container element to append the card to.
 * @example
 * ```javascript
 * const item = {
 *  media: [{ url: "img/item.jpg", alt: "Item Image" }],
 *  title: "Item Title",
 */

export function createCardMyListing(item, author, container) {
  const profileName = loadStorage("profile")?.name;
  const cardWrapper = document.createElement("div");
  cardWrapper.classList.add("col", "col-md-6", "col-lg-4", "col-xxl-3");

  const card = document.createElement("div");
  card.classList.add("card");

  const imageUrl = item.media?.[0]?.url || "img/sunflowers-1719119_640.jpg";
  const imageAlt = item.media?.[0]?.alt || "Auction Item";

  const totalBids = item.bids?.length || 0;
  const highestBid =
    item.bids?.reduce((max, bid) => Math.max(max, bid.amount), 0) || 0;
  const endsAt = new Date(item.endsAt).toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
  const postedAt = new Date(item.created).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  card.innerHTML = `
    <img
      src="${imageUrl}"
      class="card-img-top"
      alt="${imageAlt}"
    />
    <div class="card-body">
      <div class="d-flex justify-content-between">
        <div>
          <h2 class="card-title text-nowrap">${item.title || "Untitled"}</h2>
        </div>
        <div>
          <small class="text-nowrap">Posted ${postedAt}</small>
        </div>
      </div>
      <i class="card-author">By <a href="#">${author || "Unknown"}</a></i>
      <div class="d-flex justify-content-between">
        <div class="mt-3">
          <div class="card-body-bid-info">
            Total Bids:<span>${totalBids}</span>
          </div>
          <div class="card-body-bid-info">
            Highest Bid:<span>${highestBid}</span>
          </div>
          <div class="card-body-bid-info">
            Ends at:<span>${endsAt}</span>
          </div>
        </div>
        
        ${
          profileName === author
            ? `<div class="btn mt-3" name="edit-my-listing-item"><i class="bi bi-pencil"></i></div>`
            : ""
        }
      </div>
      <p class="card-text mt-4 mb-5">
        ${item.description || "Beautiful auction item with no description."}
      </p>
    </div>
  `;

  cardWrapper.appendChild(card);
  container.appendChild(cardWrapper);

  // Add event listener to the edit button to call updateitem modal
  const editButton = card.querySelector('[name="edit-my-listing-item"]');
  if (!editButton) return;
  editButton.addEventListener("click", () => {
    createPostItemModal("update", item);
  });
}
