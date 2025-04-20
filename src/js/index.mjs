import "../scss/index.scss";
import * as bootstrap from "bootstrap";
import { renderItems } from "./ui/listings/renderitems.mjs";
import { authSwitchTabs } from "./ui/bootstrap/authswitchtabs.mjs";
import { handleFormSubmission } from "./ui/bootstrap/handleformsubmission.mjs";

// Ensure bootstrap is globally available
window.bootstrap = bootstrap;

// Call authSwitchTabs to initialize the authentication tab switcher
authSwitchTabs();

// Eventlistener Sign in and Sign up
const signInButton = document.getElementById("signInButton");
handleFormSubmission(signInButton, "signInForm", "profile/index.html");
const signUpButton = document.getElementById("signUpButton");
handleFormSubmission(signUpButton, "signUpForm", "profile/index.html");

// Render items in the listings view
renderItems();
