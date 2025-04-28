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
    <div class="col-md-4">
      <img
        src="${imageUrl}"
        class="img-fluid rounded-start"
        alt="${imageAlt}"
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
        <i class="card-author">By <a href="#">${sellerName}</a></i>
        <div>
          <div>Total Bids: <span>${totalBids}</span></div>
          <div>Highest Bid: <span>${highestBid}</span></div>
          <div>Ends at: <span>${endsAt}</span></div>
        </div>
        <p class="card-text mt-5">
          ${description}
        </p>
      </div>
    </div>
  `;
}
