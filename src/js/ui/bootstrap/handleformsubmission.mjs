import { validateInputs } from "./validateinputs.mjs";
import { onAuth } from "../../events/onauth.mjs";

/**
 * Handles form submission for authentication forms.
 * @param {HTMLElement} buttonElement - The button element that triggers the form submission.
 * @param {string} formId - The ID of the form to validate and submit.
 * @param {string} redirectUrl - The URL to redirect to upon successful submission.
 * @example
 * ```javascript
 * const buttonElement = document.getElementById("signInButton");
 * const formId = "signInForm";
 * const redirectUrl = "profile/index.html";
 * handleFormSubmission(buttonElement, formId, redirectUrl);
 * ```
 */
export function handleFormSubmission(buttonElement, formId, redirectUrl) {
  if (buttonElement) {
    buttonElement.addEventListener("click", async function (event) {
      event.preventDefault();
      const form = document.getElementById(formId);
      if (validateInputs(form)) {
        try {
          await onAuth(event);
          window.location.href = redirectUrl;
          setTimeout(() => {
            form.reset();
          }, 2000);
        } catch (error) {
          console.error("Error during form submission:", error);
        }
      } else {
        event.preventDefault();
        event.stopPropagation();
        form.classList.add("was-validated");
      }
    });
  }
}
