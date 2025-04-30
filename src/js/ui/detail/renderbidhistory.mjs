/**
 * Renders the bid history for a given auction item.
 * @param {Object} response - The response object containing bid history data.
 * @example
 * ```javascript
 * const response = {
 *  bids: [
 *   { created: "2023-10-01T12:00:00Z", bidder: { name: "Bidder1" }, amount: 100 },
 *  { created: "2023-10-02T12:00:00Z", bidder: { name: "Bidder2" }, amount: 200 },
 * ],
 * };
 * renderBidHistory(response);
 * ```
 */
export function renderBidHistory(response) {
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
            <div class="bid-list-name flex-grow-1"><a href="profile.html?profile=${bid.bidder.name}">${bid.bidder.name}</a></div>
            <div class="bid-list-date flex-grow-1">${bidDate}</div>
            <div class="bid-list-amount flex-grow-1 text-end">${bid.amount} Cr</div>
          `;
        bidHistoryContainer.appendChild(bidItem);
      });
    } else {
      bidHistoryContainer.innerHTML = "<div>No bids yet</div>";
    }
  }
}
