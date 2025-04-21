/**
 * Renders the bids won at the profile page.
 * @memberof module:Profile
 * @param {Object} profile - The profile object containing bids won data.
 * @example
 * ```javascript
 * const profile = { data: { bidsWon: ["Bid 1", "Bid 2"] } };
 * renderBidsWon(profile);
 * ```
 */

export async function renderBidsWon(profile) {
  const bidsWonContainer = document.getElementById("bids-won-container");
  const wins = profile.wins || [];

  if (wins.length === 0) {
    bidsWonContainer.innerHTML = "<div>No bids won yet.</div>";
    return;
  }

  wins.forEach((bid) => {
    const bidElement = document.createElement("div");
    bidElement.className = "bid-item";
    bidElement.innerHTML = `
      <div class="bid-list-name flex-grow-1 mb-1">${bid.id}</div>
      <div class="bid-list-date flex-grow-1 text-center">${new Date(
        bid.created,
      ).toLocaleDateString("no-NO", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      })}</div>
      <div class="bid-list-amount flex-grow-1 text-end">${bid.amount} Credits</div>
    `;
    winElement.appendChild(bidElement);
  });

  bidsWonContainer.appendChild(bidsList);
}
