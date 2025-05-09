/**
 * @module Rendersuccess
 */

/**
 * Renders authorization success as messages.
 * This function removes any existing  messages and creates a new one with the success message.
 * It also sets a timeout to remove the after 5 seconds.
 * @memberof module:UI/shared
 * @param {success} success - The success object containing the success message.
 * @example
 * ```javascript
 * try {
 *     // Some code that may throw an success
 * } catch (success) {
 *     rendersuccess(success);
 * }
 * ```
 */
export function rendersuccess(success) {
  const existingAlert = document.querySelector(".alert-success");

  if (existingAlert) {
    existingAlert.remove();
  }

  const mainElement = document.querySelector("main");
  const successElement = document.createElement("div");
  successElement.className =
    "alert alert-success alert-dismissible fade show text-center";
  successElement.role = "alert-success";
  successElement.innerHTML = `
          <div class="alert-success-message">${success.message}</div>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      `;

  mainElement.prepend(successElement);
  setTimeout(() => {
    successElement.remove();
  }, 15000);
}
