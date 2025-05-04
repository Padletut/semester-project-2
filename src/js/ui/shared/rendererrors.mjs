/**
 * @module Rendererrors
 */

/**
 * Renders authorization errors as alert messages.
 * This function removes any existing alert messages and creates a new one with the error message.
 * It also sets a timeout to remove the alert after 5 seconds.
 * @memberof module:UI/shared
 * @param {Error} error - The error object containing the error message.
 * @example
 * ```javascript
 * try {
 *     // Some code that may throw an error
 * } catch (error) {
 *     renderErrors(error);
 * }
 * ```
 */
export function renderErrors(error) {
  const existingAlert = document.querySelector(".alert");

  if (existingAlert) {
    existingAlert.remove();
  }

  const mainElement = document.querySelector("main");
  const errorElement = document.createElement("div");
  errorElement.className = "alert alert-danger alert-dismissible fade show";
  errorElement.role = "alert";
  errorElement.innerHTML = `
        <div class="alert-message">${error.message}</div>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

  mainElement.prepend(errorElement);
  setTimeout(() => {
    errorElement.remove();
  }, 5000);
}
