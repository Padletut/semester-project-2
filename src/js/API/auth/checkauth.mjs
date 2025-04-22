import { loadStorage } from "../../storage/loadstorage.mjs";

/**
 * Checks if the user is authenticated by verifying the presence of an access token in local storage.
 * Change navigation item to "Logout" if authenticated.
 **/

export function checkAuth() {
  const accessToken = loadStorage("accessToken");
  const navbarItem = document.querySelector(".nav-auth");
  const profileNavItem = document.querySelector(".nav-profile");

  if (accessToken && navbarItem) {
    // Create a new "Logout" link
    const logoutLink = document.createElement("a");
    logoutLink.className = "nav-link nav-auth nav-logout";
    logoutLink.href = "authorization.html";
    logoutLink.textContent = "Logout";

    // Replace the existing element with the new one
    navbarItem.replaceWith(logoutLink);
  }

  // Hide the nav-profile item if the user is not logged in
  if (!accessToken && profileNavItem) {
    profileNavItem.style.display = "none";
  }
}
