import "../scss/index.scss";
import * as bootstrap from "bootstrap";
import * as constants from "./constants.mjs";
import { getItems } from "./API/listings/getitems.mjs";
import { renderErrors } from "./ui/shared/rendererrors.mjs";
import { renderItems } from "./ui/listings/renderitems.mjs";

// Ensure bootstrap is globally available
window.bootstrap = bootstrap;

// Switch between Login and Register account tabs

const signUpLink = document.getElementById("signUpLink");
const signInLink = document.getElementById("signInLink");

if (signUpLink) {
  signUpLink.addEventListener("click", function (event) {
    event.preventDefault();
    const signUpTab = new bootstrap.Tab(document.getElementById("signUp-tab"));
    signUpTab.show();
  });
}

if (signInLink) {
  signInLink.addEventListener("click", function (event) {
    event.preventDefault();
    const signInTab = new bootstrap.Tab(document.getElementById("signIn-tab"));
    signInTab.show();
  });
}

// Clickable cards

document.querySelectorAll(".card-auction-item").forEach((card) => {
  card.addEventListener("click", () => {
    window.location.href = "detail.html";
  });
});

// Render items in the listings view
renderItems();
