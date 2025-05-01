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
  const fragment = document.createDocumentFragment();

  for (const listing of profile.listings) {
    // Render each listing card
    const card = await createCardMyListing(listing, author); // Await the returned card
    if (card) {
      fragment.appendChild(card); // Append the card to the fragment only if it's valid
    } else {
      console.error(`Failed to create card for listing ID: ${listing.id}`);
    }
  }

  listingsContainer.appendChild(fragment); // Append the fragment to the container in one operation
}
