import "../scss/index.scss";
import * as bootstrap from "bootstrap";
import { toggleDisplayCredits } from "./ui/shared/toggledisplaycredits.mjs";
import { renderItems } from "./ui/listings/renderitems.mjs";
import { authSwitchTabs } from "./ui/bootstrap/authswitchtabs.mjs";
import { handleAuthFormSubmission } from "./ui/bootstrap/handleauthformsubmission.mjs";
import { checkAuth } from "./API/auth/checkauth.mjs";
import { logout } from "./API/auth/logout.mjs";
import { renderProfile } from "./ui/profile/renderprofile.mjs";
import { renderDetail } from "./ui/detail/renderdetail.mjs";
import { listingCRUDModal } from "./ui/shared/listingcrudmodal.mjs";
import { renderCredits } from "./ui/shared/rendercredits.mjs";
import { loadStorage } from "./storage/loadstorage.mjs";
import { SearchAndFilterItems } from "./API/search/searchandfilteritems.mjs";
import * as constants from "./constants.mjs";

const { STORAGE_KEYS } = constants;
const { PROFILE } = STORAGE_KEYS;
const loggedInUser = loadStorage(PROFILE);
// Ensure bootstrap is globally available
window.bootstrap = bootstrap;

// Call toggleDisplayCredits to initialize the display of credits
toggleDisplayCredits();

checkAuth();

// Call authSwitchTabs to initialize the authentication tab switcher
authSwitchTabs();

// Eventlistener Sign in and Sign up
const signInButton = document.getElementById("signInButton");
handleAuthFormSubmission(signInButton, "signInForm", "/", false);
const signUpButton = document.getElementById("signUpButton");
handleAuthFormSubmission(signUpButton, "signUpForm", "profile", true);

// Render profile data
if (document.title === "User Profile | Tradeauction") {
  await renderProfile();
}

renderItems();

if (document.title === "Listings | Tradeauction") {
  console.log("User is logged in:", loggedInUser); // Debugging line
  if (loggedInUser) {
    renderCredits();
  }
  document.addEventListener("DOMContentLoaded", () => {
    const itemsContainer = document.querySelector(".items-container");

    // Render default items
    renderItems();

    // Lazy load SearchAndFilterItems
    const searchInput = document.querySelector('input[name="search"]');
    const filterInput = document.querySelector('input[name="filter-tags"]');

    let searchAndFilter = null;

    const initializeSearchAndFilter = () => {
      if (!searchAndFilter) {
        searchAndFilter = new SearchAndFilterItems(itemsContainer);
      }
    };

    if (searchInput) {
      searchInput.addEventListener("input", initializeSearchAndFilter);
    }

    if (filterInput) {
      filterInput.addEventListener("input", initializeSearchAndFilter);
    }
  });
}

// Render item detail in the detail view
if (document.title === "Item Detail | Tradeauction") {
  const itemId = new URLSearchParams(window.location.search).get("id");
  await renderDetail(itemId);
  if (loggedInUser) {
    renderCredits();
  }
}

// Event listener for logout navigation item

const logoutNavItem = document.querySelector(".nav-logout");
if (logoutNavItem) {
  logoutNavItem.addEventListener("click", (event) => {
    event.preventDefault();
    logout();
  });
}

// Event listener for the active switch
const activeSwitch = document.getElementById("switchCheckChecked");
if (activeSwitch) {
  activeSwitch.addEventListener("change", async () => {
    const itemsContainer = document.querySelector(".items-container");
    if (itemsContainer) {
      itemsContainer.innerHTML = ""; // Clear existing items

      await renderItems(null, false, null);
    }
  });
}

// Event listener for the add listing button
const addListingButton = document.querySelector(".add-listing-button");
if (addListingButton && loggedInUser) {
  addListingButton.addEventListener("click", (event) => {
    event.preventDefault();
    listingCRUDModal("create");
  });
} else if (addListingButton && !loggedInUser) {
  // Disable the button and show a tooltip
  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-bs-toggle", "tooltip");
  wrapper.setAttribute("title", "Please log in to add a listing");
  addListingButton.parentNode.insertBefore(wrapper, addListingButton);
  wrapper.appendChild(addListingButton);
  addListingButton.disabled = true;
  new bootstrap.Tooltip(wrapper);
}
