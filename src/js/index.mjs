import "../scss/index.scss";
import "bootstrap";
import "@popperjs/core";

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
