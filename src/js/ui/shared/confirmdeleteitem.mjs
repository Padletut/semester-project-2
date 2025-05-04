import { deleteItem } from "../../API/listings/deleteitem.mjs"; // Import your delete API function
import { renderProfile } from "../profile/renderprofile.mjs"; // Import the function to refresh the profile listings

/**
 * Displays a confirmation modal for deleting an item.
 * @memberof module:UI/shared
 * @param {number} itemId - The ID of the item to be deleted.
 * @param {Object} postItemModal - The modal object for the item being deleted.
 * @returns {void}
 * @example
 * ```javascript
 * confirmDeleteItem(12345, postItemModal);
 * ```
 */
export function confirmDeleteItem(itemId, postItemModal) {
  const confirmationModalHtml = `
    <div class="modal fade" id="deleteConfirmationModal" tabindex="-1" aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header" data-bs-theme="dark">
            <div class="w-100 text-center">
              <h5 class="modal-title" id="deleteConfirmationModalLabel">Confirm Deletion</h5>
            </div>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-light">
            Are you sure you want to delete this item? This action cannot be undone.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" id="confirmDeleteBtn">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", confirmationModalHtml);

  const confirmationModal = new bootstrap.Modal(
    document.getElementById("deleteConfirmationModal"),
  );
  confirmationModal.show();

  // Handle delete confirmation
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
  confirmDeleteBtn.addEventListener("click", async () => {
    try {
      await deleteItem(itemId); // Call the API to delete the item
      confirmationModal.hide();
      postItemModal.hide();

      // Check if the user is on the item detail page
      const currentUrl = window.location.href;
      if (currentUrl.includes("detail.html")) {
        // Redirect to the Listings page
        window.location.href = "index.html";
      } else {
        renderProfile(); // Refresh the profile listings if not on the detail page
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    } finally {
      document.getElementById("deleteConfirmationModal").remove(); // Remove the modal from the DOM
    }
  });

  // Remove the modal from the DOM when it is hidden
  const modalElement = document.getElementById("deleteConfirmationModal");
  modalElement.addEventListener("hidden.bs.modal", () => {
    modalElement.remove();
  });
}
