import { linkAuthorToProfile } from "../shared/linkauthortoprofile.mjs";
import { loadStorage } from "../../storage/loadstorage.mjs";
import { createPostItemModal } from "../listings/createpostitemmodal.mjs";
import { observeItemChanges } from "../events/observeitemchanges.mjs";
import { updateItemDetail } from "../events/updateitemdetail.mjs";

/**
 * Creates a post card element and appends it to the listings container.
 * @param {Object} item - The item object containing details of the auction item.
 * @param {HTMLElement} container - The container element to render the item into.
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
 * const container = document.getElementById("item-container");
 * createItemCard(item, container);
 * ```
 */
export function createDetailItemCard(item) {
  const profileName = loadStorage("profile")?.name || "Unknown User";
  const container = document.querySelector(".item-detail-container");
  if (!container) {
    console.error("Container with class 'item-detail-container' not found.");
    return;
  }

  const imageUrl = item.media?.[0]?.url || "img/sunflowers-1719119_640.jpg";
  const imageAlt = item.media?.[0]?.alt || "Auction Item";
  const title = item.title || "Untitled";
  const description =
    item.description || "Beautiful auction item with no description.";
  const sellerName = item.seller?.name || "Unknown";
  const totalBids = item.bids?.length || 0;
  const highestBid = item.bids?.length
    ? Math.max(...item.bids.map((bid) => bid.amount))
    : "N/A";
  const endsAt = item.endsAt
    ? new Date(item.endsAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "N/A";
  const postedAt = item.created
    ? new Date(item.created).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "N/A";

  container.innerHTML = `
    <div class="col-md-4 p-0">
      <img
        src="${imageUrl}"
        class="img-fluid rounded-start"
        alt="${imageAlt}"
        data-bs-toggle="modal"
        data-bs-target="#imageModal"
      />
    </div>
    <div class="col-md-8">
      <div class="card-body rounded-3 p-3">
        <div class="d-flex flex-wrap mb-3 justify-content-between">
          <div>
            <h2 class="card-title text-nowrap">${title}</h2>
          </div>
          <div>
            <small class="text-nowrap">Posted ${postedAt}</small>
          </div>
        </div>
        ${
          profileName === item.seller.name
            ? `<button class="btn border rounded-circle position-absolute end-0 me-3" name="edit-my-listing-item"><i class="bi bi-pencil"></i></div>`
            : ""
        }
        <div class="ms-3 mb-3">
          <i class="card-author" name="${sellerName}">By <a href="#">${sellerName}</a></i>
        </div>
        <div class="ms-3">
          <div>Total Bids: <span>${totalBids}</span></div>
          <div>Highest Bid: <span>${highestBid}</span></div>
          <div>Ends at: <span>${endsAt}</span></div>
        </div>
        <p class="card-text m-3 mt-4">
          ${description}
        </p>
      </div>
    </div>
  `;
  imageModal(title, imageAlt, imageUrl); // Create the image modal
  linkAuthorToProfile(); // Link author to profile page
  addEditButtonListener(item);
  initializeItemObserver(".item-detail-container"); // Initialize the item observer
}

function initializeItemObserver(detailContainer) {
  if (detailContainer) {
    observeItemChanges(detailContainer, (updatedItem) => {
      createDetailItemCard(updatedItem); // Update the detail card with the new data
    });
  } else {
    console.warn("Detail container not found. Skipping observeItemChanges.");
  }
}

function imageModal(title, imageAlt, imageUrl) {
  const body = document.querySelector("body");
  // Create the modal element
  const modal = document.createElement("div");
  modal.className = "modal fade";
  modal.id = "imageModal";
  modal.tabIndex = -1;
  modal.setAttribute("aria-labelledby", "imageModalLabel");
  modal.setAttribute("aria-hidden", "true");

  // Set the modal's inner HTML
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header" data-bs-theme="dark">
          <div class="w-100 text-center">
              <h5 class="modal-title" id="imageModalLabel">${title}</h5>
          </div>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
        </div>
        <div class="modal-body">
          <img src="${imageUrl}" class="img-fluid" alt="${imageAlt}" />
        </div>
      </div>
    </div>
  `;

  // Append the modal to the body
  body.appendChild(modal);
}

function addEditButtonListener(item) {
  const editButton = document.querySelector('[name="edit-my-listing-item"]');
  if (!editButton) return;

  editButton.addEventListener("click", async () => {
    try {
      const updatedItem = await createPostItemModal("update", item); // Open the modal and wait for the updated item
      if (updatedItem) {
        updateItemDetail(".item-detail-container", updatedItem); // Update the data-item attribute
      }
    } catch (error) {
      console.error("Error opening edit modal:", error);
    }
  });
}
