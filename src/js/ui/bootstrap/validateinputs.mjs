import { validateEmail } from "../../API/utils/validateemail.mjs";
import { validateTags } from "./validatetags.mjs";
import { renderErrors } from "../shared/rendererrors.mjs";

/**
 * Validates the inputs of a form.
 * @memberof module:UI/bootstrap
 * @param {HTMLFormElement} form - The form element to validate.
 * @returns {boolean} True if the form inputs are valid, false otherwise.
 * @example
 * ```javascript
 * const form = document.getElementById("signUpForm");
 * const isValid = validateInputs(form);
 * console.log(isValid); // true or false
 * ```
 */
export function validateInputs(form) {
  "use strict";

  if (!form) {
    console.error("Form element is not provided");
    return false;
  }

  let isValid = form.checkValidity();

  const emailInput = form.querySelector("#signUpEmail");
  if (emailInput) {
    try {
      // Validate email input
      isValid = validateEmail(emailInput) && isValid;
    } catch (error) {
      renderErrors(error);
      isValid = false;
    }
  }

  const tagsInput = form.querySelector("#tags");
  if (tagsInput) {
    try {
      // Validate tags input
      isValid = validateTags(tagsInput) && isValid;
    } catch (error) {
      renderErrors(error);
      isValid = false;
    }
  }

  if (!isValid) {
    form.classList.add("was-validated");
  } else {
    form.classList.remove("was-validated");
  }

  return isValid;
}
