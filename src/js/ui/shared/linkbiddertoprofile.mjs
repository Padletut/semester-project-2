/**
 * This function links the bidder name to their profile page.
 * It adds an event listener to each bidder link, preventing the default action
 * and redirecting to the profile page with the bidder's name as a query parameter.
 * @memberof module:UI/shared
 * @returns {void}
 * @example
 * ```javascript
 * linkBidderToProfile();
 * ```javascript
 */
export function linkBidderToProfile() {
  const bidderLinks = document.querySelectorAll(".bidder-link");
  bidderLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent the card's click event from triggering
      event.preventDefault();
      const profileName = event.target.textContent;
      window.location.href = `profile.html?profile=${profileName}`;
    });
  });
}
