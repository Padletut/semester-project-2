/**
 * @description This function adds event listeners to all author links in the card elements.
 * When a link is clicked, it prevents the default behavior and redirects to the profile page of the author.
 * It uses the text content of the link as the profile name in the URL.
 * @returns {void}
 * @example
 * linkAuthorToProfile();
 */
export function linkAuthorToProfile() {
  const authorLinks = document.querySelectorAll(".card-author"); // Select only the seller name links
  authorLinks.forEach((authorLink) => {
    authorLink.addEventListener("click", (event) => {
      event.stopPropagation(); // Prevent the card's click event from triggering
      event.preventDefault(); // Prevent default link behavior
      const profileName = authorLink
        .closest(".card-author")
        .getAttribute("name"); // Get the seller's name directly
      window.location.href = `profile.html?profile=${profileName}`; // Redirect to the profile page
    });
  });
}
