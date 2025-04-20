/**
 * Validates if an email input ends with @stud.noroff.no.
 * @param {HTMLFormElement} form - The form element containing the email input.
 * @param {HTMLInputElement} emailInput - The email input element to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 * @example
 * ```javascript
 * const form = document.getElementById("signUpForm");
 * const emailInput = form.querySelector("#signUpEmail");
 * const isValid = validateEmail(form, emailInput);
 * console.log(isValid); // true or false
 * ```
 */
export function validateEmail(emailInput) {
  const emailPattern = /^[^\s@]+@(stud\.noroff\.no)$/;
  const isValid = emailPattern.test(emailInput.value);

  if (!isValid) {
    emailInput.setCustomValidity(
      "Sorry, only users with email ending @stud.noroff.no can register",
    );
    throw new Error(
      "Sorry, only users with email ending @stud.noroff.no can register",
    );
  } else {
    emailInput.setCustomValidity("");
  }

  return isValid;
}
