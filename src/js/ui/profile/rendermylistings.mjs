import { createCardMyListing } from "./createcardmylisting.mjs";
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

  profile.listings.forEach((listing) => {
    createCardMyListing(listing, author, listingsContainer);
  });
}
