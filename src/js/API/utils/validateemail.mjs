/**
 * Validates if an email input ends with @stud.noroff.no.
 * @memberof module:API/utils
 * @param {HTMLInputElement} emailInput - The email input element to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 * @example
 * ```javascript
 * const emailInput = document.querySelector("#signUpEmail");
 * const isValid = validateEmail(emailInput);
 * console.log(isValid); // true or false
 * ```
 */
export function validateEmail(emailInput, register = false) {
  try {
    console.log("Validating email:", emailInput.value);
    const emailPattern = /^[^\s@]+@(stud\.noroff\.no)$/;
    const isValid = emailPattern.test(emailInput.value);

    if (!isValid) {
      if (register) {
        throw new Error(
          "Sorry, only users with email ending @stud.noroff.no can register",
        );
      } else {
        throw new Error(
          "Sorry, only users with email ending @stud.noroff.no can login",
        );
      }
    }

    return isValid;
  } catch (error) {
    console.error("Email validation error:", error.message);
    throw error; // Re-throw the error to propagate it to the caller
  }
}
