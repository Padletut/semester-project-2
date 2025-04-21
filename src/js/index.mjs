import "../scss/index.scss";
import * as bootstrap from "bootstrap";
import { renderItems } from "./ui/listings/renderitems.mjs";
import { authSwitchTabs } from "./ui/bootstrap/authswitchtabs.mjs";
import { handleFormSubmission } from "./ui/bootstrap/handleformsubmission.mjs";
import { checkAuth } from "./API/auth/checkauth.mjs";
import { logout } from "./API/auth/logout.mjs";
import { renderProfile } from "./ui/profile/renderprofile.mjs";
//import { loadStorage } from "./storage/loadstorage.mjs";

// Ensure bootstrap is globally available
window.bootstrap = bootstrap;

checkAuth();

// Check if user is logged in
//let isLoggedIn = checkAuth();

//const profileName = loadStorage("profile");

/* if (isLoggedIn && profileName) {
  loadModals(profileName.name);
} */

// Call authSwitchTabs to initialize the authentication tab switcher
authSwitchTabs();

// Eventlistener Sign in and Sign up
const signInButton = document.getElementById("signInButton");
handleFormSubmission(signInButton, "signInForm", "index.html");
const signUpButton = document.getElementById("signUpButton");
handleFormSubmission(signUpButton, "signUpForm", "index.html");

// Render profile data
if (document.title === "User Profile | Tradeauction") {
  await renderProfile();
}

// Render items in the listings view
renderItems();

// Event listener for logout navigation item

const logoutNavItem = document.querySelector(".nav-logout");
if (logoutNavItem) {
  logoutNavItem.addEventListener("click", (event) => {
    event.preventDefault();
    logout();
  });
}
