import { createCardMyListing } from "./createcardmylisting.mjs";
import { observeItemChanges } from "../events/observeitemchanges.mjs";
/**
 * Renders listings for the current profile.
 * @memberof module:Profile
 * @param {Object} profile - The profile object containing listings data for current profile.
 * @example
 * ```javascript
 * const profile = { data: { listings: [{ id: 1, name: "Listing 1" }] } };
 * renderMyListings(profile);
 * ```
 */
export async function renderMyListings(profile) {
  const listingsContainer = document.getElementById("my-listings");
  listingsContainer.innerHTML = ""; // Clear existing listings

  if (profile.listings.length === 0) {
    listingsContainer.innerHTML = "<div>No listings found.</div>";
    return;
  }

  const author = profile.name;
  for (const listing of profile.listings) {
    // Render each listing card
    createCardMyListing(listing, author, listingsContainer);

    // Add observer for each listing card
    const cardSelector = `[data-item-id="${listing.id}"]`; // Use a unique selector for each card
    observeItemChanges(cardSelector, async (updatedItem) => {
      const card = document.querySelector(cardSelector);
      if (card) {
        // Update only the necessary parts of the card
        const titleElement = card.querySelector(".card-title");
        const descriptionElement = card.querySelector(".card-text");
        const totalBidsElement = card.querySelector(
          ".card-body-bid-info span:first-child",
        );
        const highestBidElement = card.querySelector(
          ".card-body-bid-info span:last-child",
        );

        if (titleElement)
          titleElement.textContent = updatedItem.title || "Untitled";
        if (descriptionElement)
          descriptionElement.textContent =
            updatedItem.description ||
            "Beautiful auction item with no description.";
        if (totalBidsElement)
          totalBidsElement.textContent = updatedItem.bids?.length || 0;
        if (highestBidElement) {
          const highestBid =
            updatedItem.bids?.reduce(
              (max, bid) => Math.max(max, bid.amount),
              0,
            ) || 0;
          highestBidElement.textContent = highestBid;
        }
      }
    });
  }
}
