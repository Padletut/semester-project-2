import "../scss/index.scss";
//import "~bootstrap/dist/js/bootstrap.bundle.js";
import * as bootstrap from "bootstrap";
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

document.querySelectorAll(".card").forEach((card) => {
  card.addEventListener("click", () => {
    window.location.href = "detail.html";
  });
});
