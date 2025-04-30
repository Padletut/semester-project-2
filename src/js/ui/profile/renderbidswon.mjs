/**
 * Renders the bids won on the profile page.
 * @memberof module:Profile
 * @param {Object} profile - The profile object containing bids won data.
 * @example
 * ```javascript
 * const profile = { wins: [{ id: "1", title: "Bid 1" }] };
 * renderBidsWon(profile);
 * ```
 */
export async function renderBidsWon(profile) {
  const bidsWonContainer = document.getElementById("bids-won-container");

  // Clear the container to avoid duplicate entries
  bidsWonContainer.innerHTML = "";

  const wins = profile.wins || [];

  if (wins.length === 0) {
    bidsWonContainer.innerHTML = "<div>No bids won yet.</div>";
    return;
  }

  const bidElement = document.createElement("li");
  bidElement.className = "bid-item, d-flex";
  bidElement.innerHTML = `
      <div class="bid-list-name-heading flex-grow-1 mb-3 h6">Title</div>
      <div class="bid-list-date-heading flex-grow-1 h6">Ends At</div>
    `;
  bidsWonContainer.appendChild(bidElement);

  wins.forEach((bid) => {
    const bidElement = document.createElement("li");
    bidElement.className = "bid-item, d-flex";
    bidElement.innerHTML += `
      <div class="bid-list-name flex-grow-1 mb-1">${bid.title}</div>
      <div class="bid-list-date flex-grow-1 ">${new Date(
        bid.endsAt,
      ).toLocaleDateString("no-NO", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      })}</div>
      
    `;
    bidsWonContainer.appendChild(bidElement);
    // Event listener for bid item click
    bidElement.addEventListener("click", () => {
      window.location.href = `detail.html?id=${bid.id}`;
    });
  });
}
