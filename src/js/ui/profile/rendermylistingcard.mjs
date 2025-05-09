import * as constants from "../../constants.mjs";
import { createPostItemModal } from "../shared/createpostitemmodal.mjs";
import { loadStorage } from "../../storage/loadstorage.mjs";
import { getItem } from "../../API/listings/getitem.mjs";

/**
 * Creates a post card element and appends it to my listings container.
 * @memberof module:UI/profile
 * @param {Object} item - The item object containing details of the auction item.
 * @param {string} author - The name of the author of the item.
 * @example
 * ```javascript
 * const item = {
 *  media: [{ url: "https://example.com/image.jpg", alt: "Item Image" }],
 * title: "Auction Item",
 * description: "Description of the item",
 * seller: { name: "Seller Name" },
 * bids: [{ amount: 100 }, { amount: 200 }],
 * endsAt: "2023-10-01T00:00:00Z",
 * created: "2023-09-01T00:00:00Z",
 * };
 * const author = "Author Name";
 * const container = document.getElementById("my-listings-container");
 * renderMyListingCard(item, author, container);
 * ```
 */
export async function renderMyListingCard(item, author) {
  const { STORAGE_KEYS } = constants;
  const { PROFILE } = STORAGE_KEYS;
  const profileName = loadStorage(PROFILE)?.name;

  try {
    // Fetch full details of the listing using getItem
    const fullItem = await getItem(item.id);
    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("col", "col-md-6", "col-lg-4", "col-xxl-3");

    const card = document.createElement("div");
    card.classList.add("card", "card-auction-item");
    card.setAttribute("data-item-id", fullItem.id); // Unique identifier for the card

    const imageUrl =
      fullItem.media?.[0]?.url || "img/sunflowers-1719119_640.jpg";
    const imageAlt = fullItem.media?.[0]?.alt || "Auction Item";
    const totalBids = fullItem.bids?.length || 0;
    const highestBid =
      fullItem.bids?.reduce((max, bid) => Math.max(max, bid.amount), 0) || 0;
    const endsAt = new Date(fullItem.endsAt).toLocaleDateString("en-US", {
      month: "long",
      day: "2-digit",
      year: "numeric",
    });
    const postedAt = new Date(fullItem.created).toLocaleDateString("en-US", {
      month: "long",
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
        <div class="d-flex flex-wrap justify-content-between">
          <div>
            <h2 class="card-title text-nowrap">${fullItem.title || "Untitled"}</h2>
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
                ? new Date(item.endsAt) > Date.now()
                  ? `<button class="btn border rounded-circle" name="edit-my-listing-item"><i class="bi bi-pencil"></i></button>`
                  : `<span class="text-danger position-absolute end-0 me-3 fw-bold">Auction Ended</span>`
                : new Date(item.endsAt) > Date.now()
                  ? ""
                  : `<span class="text-danger position-absolute end-0 me-3 fw-bold">Auction Ended</span>`
            }
        </div>
        <p class="card-text mt-4 mb-5">
          ${fullItem.description || "Beautiful auction item with no description."}
        </p>
      </div>
    `;

    cardWrapper.appendChild(card);

    // Add event listener to the edit button to call updateitem modal
    const editButton = card.querySelector('[name="edit-my-listing-item"]');
    if (editButton) {
      editButton.addEventListener("click", async () => {
        try {
          const updatedItem = await createPostItemModal(
            "update",
            fullItem,
            `[data-item-id="${fullItem.id}"]`,
          );
          if (updatedItem) {
            // Update the item object with the new data
            Object.assign(fullItem, updatedItem);
          }
        } catch (error) {
          console.error("Error updating item:", error);
        }
      });
    }

    return cardWrapper; // Return the card wrapper instead of appending it to the container
  } catch (error) {
    console.error(`Error fetching details for listing ID ${item.id}:`, error);
    return null; // Return null if an error occurs
  }
}
