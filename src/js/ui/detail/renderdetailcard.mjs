import * as constants from "../../constants.mjs";
import { linkAuthorToProfile } from "../shared/linkauthortoprofile.mjs";
import { loadStorage } from "../../storage/loadstorage.mjs";
import { listingCRUDModal } from "../shared/listingcrudmodal.mjs";
import { observeItemChanges } from "../events/observeitemchanges.mjs";
import { updateItemDetail } from "../events/updateitemdetail.mjs";
import { imageModal } from "../shared/imagemodal.mjs";

/**
 * Creates a post card element and appends it to the listings container.
 * @memberof module:UI/detail
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
 * renderDetailItemCard(item, container);
 * ```
 */
export function renderDetailItemCard(item) {
  const { STORAGE_KEYS } = constants;
  const { PROFILE } = STORAGE_KEYS;
  const profileName = loadStorage(PROFILE)?.name || "Unknown User";
  const container = document.querySelector(".item-detail-container");
  if (!container) {
    console.error("Container with class 'item-detail-container' not found.");
    return;
  }

  const title = item.title;
  const description =
    item.description || "Beautiful auction item with no description.";
  const sellerName = item.seller.name;
  const totalBids = item.bids?.length || 0;
  const highestBid = item.bids?.length
    ? Math.max(...item.bids.map((bid) => bid.amount))
    : "N/A";
  const endsAt = item.endsAt
    ? new Date(item.endsAt).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "N/A";
  const postedAt = item.created
    ? new Date(item.created).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    : "N/A";

  // Generate media content
  let mediaContent = "";
  if (item.media?.length > 1) {
    // Bootstrap carousel for multiple media
    mediaContent = `
      <div id="mediaCarousel" class="carousel slide" data-bs-ride="carousel">
        <div class="carousel-indicators">
          ${item.media
            .map(
              (_, index) => `
            <button type="button" data-bs-target="#mediaCarousel" data-bs-slide-to="${index}" ${
              index === 0 ? 'class="active" aria-current="true"' : ""
            } aria-label="Slide ${index + 1}"></button>
          `,
            )
            .join("")}
        </div>
        <div class="carousel-inner">
          ${item.media
            .map(
              (mediaItem, index) => `
            <div class="carousel-item ${index === 0 ? "active" : ""}">
              <img src="${mediaItem.url}" class="d-block carousel-image rounded-start" alt="${mediaItem.alt || "Auction Item"}" data-title="${title}" data-alt="${mediaItem.alt || "Auction Item"}" data-url="${mediaItem.url}">
            </div>
          `,
            )
            .join("")}
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#mediaCarousel" data-bs-slide="prev">
          <span class="carousel-control-prev-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Previous</span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#mediaCarousel" data-bs-slide="next">
          <span class="carousel-control-next-icon" aria-hidden="true"></span>
          <span class="visually-hidden">Next</span>
        </button>
      </div>
    `;
  } else {
    // Single image
    const imageUrl =
      item.media?.[0]?.url || "assets/img/sunflowers-1719119_640.jpg";
    const imageAlt = item.media?.[0]?.alt || "Auction Item";
    mediaContent = `
      <img
        src="${imageUrl}"
        class="img-fluid rounded-start single-image"
        alt="${imageAlt}"
        data-title="${title}"
        data-alt="${imageAlt}"
        data-url="${imageUrl}"
      />
    `;
  }

  container.innerHTML = `
    <div class="col-md-5 position-relative">
      ${mediaContent}
    </div>
    <div class="col-md-7">
      <div class="card-body rounded-3 p-3">
        <div class="d-flex flex-wrap ms-md-3 justify-content-between">
          <div>
            <h2 class="card-title">${title}</h2>
          </div>
          <div>
            <small class="text-nowrap">Posted ${postedAt}</small>
          </div>
        </div>
                ${
                  profileName === item.seller.name
                    ? new Date(item.endsAt) > Date.now()
                      ? `<button class="btn border rounded-circle position-absolute end-0" name="edit-my-listing-item"><i class="bi bi-pencil"></i></button>`
                      : `<span class="text-danger position-absolute end-0 me-3 fw-bold">Auction Ended</span>`
                    : new Date(item.endsAt) > Date.now()
                      ? ""
                      : `<span class="text-danger position-absolute end-0 me-3 fw-bold">Auction Ended</span>`
                }
        <div class="ms-md-3 mb-3">
          <i class="card-author" name="${sellerName}">By <a href="#">${sellerName}</a></i>
        </div>
        <div class="ms-md-3">
          <div>Total Bids: <span>${totalBids}</span></div>
          <div>Highest Bid: <span>${highestBid}</span></div>
          <div>Ends at: <span>${endsAt}</span></div>
        </div>
        <p class="card-text m-3 ms-0 ms-md-3 mt-4">
          ${description}
        </p>
      </div>
    </div>
  `;

  // Add event listeners for images to open the modal
  const images = container.querySelectorAll(".carousel-image, .single-image");
  images.forEach((image) => {
    image.addEventListener("click", () => {
      const title = image.getAttribute("data-title");
      const url = image.getAttribute("data-url");
      const imagesArray = Array.from(images).map((img) => ({
        url: img.getAttribute("data-url"),
        alt: img.getAttribute("data-alt"),
      }));
      imageModal(
        title,
        imagesArray,
        imagesArray.findIndex((img) => img.url === url),
      );
    });
  });

  linkAuthorToProfile(); // Link author to profile page
  addEditButtonListener(item);
  initializeItemObserver(".item-detail-container"); // Initialize the item observer
}

function initializeItemObserver(detailContainer) {
  if (detailContainer) {
    observeItemChanges(detailContainer, (updatedItem) => {
      renderDetailItemCard(updatedItem); // Update the detail card with the new data
    });
  } else {
    console.warn("Detail container not found. Skipping observeItemChanges.");
  }
}

function addEditButtonListener(item) {
  const editButton = document.querySelector('[name="edit-my-listing-item"]');
  if (!editButton) return;

  editButton.addEventListener("click", async () => {
    try {
      const updatedItem = await listingCRUDModal("update", item); // Open the modal and wait for the updated item
      if (updatedItem) {
        updateItemDetail(".item-detail-container", updatedItem); // Update the data-item attribute
      }
    } catch (error) {
      console.error("Error opening edit modal:", error);
    }
  });
}
