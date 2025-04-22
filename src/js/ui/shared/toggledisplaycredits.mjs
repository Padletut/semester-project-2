import { loadStorage } from "../../storage/loadstorage.mjs";

export function toggleDisplayCredits() {
  const displayCreditsElements = document.querySelectorAll(".display-credits");
  const navbarToggler = document.querySelector(".navbar-toggler");
  const accessToken = loadStorage("accessToken");

  // If the user is not logged in, hide credits and return early
  if (!accessToken) {
    displayCreditsElements.forEach((element) => {
      element.style.display = "none";
    });
    return;
  }

  if (!navbarToggler) {
    console.error("Navbar toggler not found.");
    return;
  }

  // Add event listener for the Bootstrap menu toggle
  navbarToggler.addEventListener("click", () => {
    const isMenuOpen = navbarToggler.getAttribute("aria-expanded") === "true";

    displayCreditsElements.forEach((element) => {
      if (isMenuOpen) {
        element.style.display = "none"; // Hide when menu is open
      } else {
        element.style.display = ""; // Show when menu is closed
      }
    });
  });

  // Initial check for menu state on page load
  const isMenuOpen = navbarToggler.getAttribute("aria-expanded") === "true";
  displayCreditsElements.forEach((element) => {
    element.style.display = isMenuOpen ? "none" : "";
  });
}
