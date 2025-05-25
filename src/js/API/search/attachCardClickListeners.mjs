/**
 * Attaches click event listeners to the item cards.
 * This method adds event listeners to each card to handle navigation to the item detail page.
 * @private
 * @example
 * ```javascript
 * this.attachCardClickListeners();
 * ```
 */
export function attachCardClickListeners() {
  const auctionItems = document.querySelectorAll(".card-auction-item");
  auctionItems.forEach((card) => {
    card.addEventListener("click", (event) => {
      event.preventDefault(); // Prevent default behavior
      const itemId = card.dataset.id; // Assuming each card has a data-id attribute

      if (itemId) {
        window.location.assign(`/detail?id=${itemId}`);
      }
    });
  });
}
