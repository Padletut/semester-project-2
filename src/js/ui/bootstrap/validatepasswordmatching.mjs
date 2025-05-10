import { ERROR_MESSAGES } from "../../API/utils/errormessages.mjs";

/**
 * Validates that the password and confirm password fields match.
 * @param {HTMLFormElement} form - The form element containing the password fields.
 * @returns {boolean} - Returns true if the passwords match and satisfy default validation rules, false otherwise.
 * @example
 * ```javascript
 * const form = document.querySelector("#signUpForm");
 * const isValid = validatePasswordMatching(form);
 * console.log(isValid); // true or false
 * ```
 */
export function validatePasswordMatching(form) {
  // Validate password matching
  const passwordInput = form.querySelector("#signUpPassword");
  const confirmPasswordInput = form.querySelector("#confirmPassword");
  if (passwordInput && confirmPasswordInput) {
    // Clear custom validity first
    passwordInput.setCustomValidity("");
    confirmPasswordInput.setCustomValidity("");

    // Check if passwords match
    if (passwordInput.value !== confirmPasswordInput.value) {
      // Set custom validity for both password fields
      passwordInput.setCustomValidity(ERROR_MESSAGES.INVALID_CONFIRM_PASSWORD);
      confirmPasswordInput.setCustomValidity(
        ERROR_MESSAGES.INVALID_CONFIRM_PASSWORD,
      );

      // Update the invalid-feedback text
      const passwordFeedback =
        passwordInput.parentElement.querySelector(".invalid-feedback");
      const confirmPasswordFeedback =
        confirmPasswordInput.parentElement.querySelector(".invalid-feedback");
      if (passwordFeedback) {
        passwordFeedback.textContent = ERROR_MESSAGES.INVALID_CONFIRM_PASSWORD;
      }
      if (confirmPasswordFeedback) {
        confirmPasswordFeedback.textContent =
          ERROR_MESSAGES.INVALID_CONFIRM_PASSWORD;
      }

      return false;
    } else {
      // Clear custom validity if passwords match
      passwordInput.setCustomValidity("");
      confirmPasswordInput.setCustomValidity("");

      // Reset the invalid-feedback text to default
      const passwordFeedback =
        passwordInput.parentElement.querySelector(".invalid-feedback");
      const confirmPasswordFeedback =
        confirmPasswordInput.parentElement.querySelector(".invalid-feedback");
      if (passwordFeedback) {
        passwordFeedback.textContent =
          "Please enter a password with at least 8 characters";
      }
      if (confirmPasswordFeedback) {
        confirmPasswordFeedback.textContent = "Please confirm your password";
      }
    }
  }

  // Return true if both inputs pass the browser's default validation
  return passwordInput.validity.valid && confirmPasswordInput.validity.valid;
}
