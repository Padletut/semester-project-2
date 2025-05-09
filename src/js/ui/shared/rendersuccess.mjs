import * as bootstrap from "bootstrap";
import { createToastContainer } from "./createtoastcontainer.mjs";
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
  const toastContainer =
    document.getElementById("toastContainer") || createToastContainer();
  const toast = document.createElement("div");
  toast.className = "toast align-items-center text-bg-success border-0";
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${success.message || "Operation completed successfully!"}
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
