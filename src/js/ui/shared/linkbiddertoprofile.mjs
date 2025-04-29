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
