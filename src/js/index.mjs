import "../scss/index.scss";
import * as bootstrap from "bootstrap";
import * as constants from "./constants.mjs";
import { getItems } from "./API/listings/getitems.mjs";
import { renderErrors } from "./ui/shared/rendererrors.mjs";

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

// Fetch items from the server and display them with console.log
async function fetchAndDisplayItems() {
  const response = await getItems(
    new URLSearchParams({
      _author: "true",
      _comments: "true",
      _reactions: "true",
      limit: "10",
      page: "1",
    }),
    false,
  );

  if (response) {
    console.log("Fetched items:", response);
  }

  // Handle errors
  if (response instanceof Error) {
    renderErrors(response);
  }
}

// Call the async function
fetchAndDisplayItems();
