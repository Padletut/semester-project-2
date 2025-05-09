import * as bootstrap from "bootstrap";
import { createToastContainer } from "./createtoastcontainer.mjs";
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
  const toastContainer =
    document.getElementById("toastContainer") || createToastContainer();
  const toast = document.createElement("div");
  toast.className = "toast align-items-center text-bg-danger border-0";
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${error.message || "An unexpected error occurred."}
      </div>
      <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toast);

  const bootstrapToast = new bootstrap.Toast(toast);
  bootstrapToast.show();

  // Remove the toast from the DOM after it hides
  toast.addEventListener("hidden.bs.toast", () => {
    toast.remove();
  });
}

// Function to create a toast container if it doesn't exist
