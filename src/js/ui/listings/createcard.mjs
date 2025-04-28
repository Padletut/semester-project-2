/**
 * Creates a post card element and appends it to the listings container.
 */

export function createItemCard(item, container) {
  const cardWrapper = document.createElement("div");
  cardWrapper.classList.add("col-12", "col-md-6", "col-lg-4", "col-xxl-3");

  const card = document.createElement("div");
  card.classList.add("card", "card-auction-item", "mb-4");
  card.setAttribute("data-id", item.id);
  card.style.cursor = "pointer"; // Add cursor style for clickable card

  const imageUrl = item.media?.[0]?.url || "img/sunflowers-1719119_640.jpg";
  const imageAlt = item.media?.[0]?.alt || "Auction Item";

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
      <div class="d-flex flex-column justify-content-between">
        <div>
          <h2 class="card-title">${item.title || "Untitled"}</h2>
        </div>
        <div>
          <small class="text-nowrap">Posted ${new Date(item.created).toLocaleDateString() || "N/A"}</small>
        </div>
      </div>
      <i class="card-author">By <a href="#">${item.seller.name || "Unknown"}</a></i>
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
      <div class="container-fluid card-recent-bids p-0 pt-3 pb-4">
        <h2>Recent Bids:</h2>
        <ul>
            ${
              item.bids?.length
                ? item.bids
                    .slice(-5) // Get the last 5 bids
                    .map(
                      (bid) =>
                        `<li>${bid.amount} Credits By <a href="#">${bid.bidder.name || "Unknown"}</a></li>`,
                    )
                    .join("")
                : "<li>No bids yet</li>"
            }
        </ul>
      </div>
      <form>
        <div class="input-group mb-3">
          <input
            type="number"
            class="form-control"
            placeholder="Enter your bid"
            aria-label="Bid Amount"
            name="bid-amount"
            required
          />
          <button
            class="btn btn-secondary place-bid-button"
            type="submit"
            title="Submit Bid"
          >
            Place Bid
          </button>
        </div>
      </form>
    </div>
  `;

  cardWrapper.appendChild(card);
  container.appendChild(cardWrapper);
}
