import { createItem } from "../../API/listings/createitem.mjs";
import { updateItem } from "../../API/listings/updateitem.mjs";
import { confirmDeleteItem } from "./confirmdeleteitem.mjs";
import { handleModalFormSubmission } from "../bootstrap/handlemodalformsubmission.mjs";
import { renderItems } from "../listings/renderitems.mjs";
import { createCardMyListing } from "../profile/createcardmylisting.mjs";

function generateModalHtml(state, item = null) {
  const mediaUrl =
    state === "update" && item.media?.[0]?.url ? item.media[0].url : ""; // Fallback to an empty string if media is undefined or empty

  return `
    <div class="modal fade" id="postItemModal" tabindex="-1" aria-labelledby="postItemModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header" data-bs-theme="dark">
                    <div class="w-100 text-center">
                        <h5 class="modal-title" id="postItemModalLabel">${state === "create" ? "Create New Listing" : "Update Listing"}</h5>
                    </div>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="postItemForm" class="needs-validation" novalidate>
                        <div class="mb-3">
                            <label for="title" class="form-label">Title</label>
                            <input type="text" class="form-control" id="title" name="title" required ${state === "update" ? `value="${item.title}"` : ""}>
                            <div class="invalid-feedback">Please provide a title.</div>
                        </div>
                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <textarea class="form-control" id="description" name="description" rows="3">${state === "update" ? item.description : ""}</textarea>
                            <div class="invalid-feedback">Please provide a description.</div>
                        </div>
                        <div class="mb-3">
                            <label for="tags" class="form-label">Tags (comma separated)</label>
                            <input type="text" class="form-control" id="tags" name="tags" ${state === "update" ? `value="${item.tags.join(",")}"` : ""}>
                            <div class="invalid-feedback">Maximum 8 tags allowed.</div>
                        </div>
                        <div class="mb-3">
                            <label for="mediaUrl" class="form-label">Media URL</label>
                            <input type="url" class="form-control" id="mediaUrl" name="mediaUrl" value="${mediaUrl}">
                        </div>
                        ${
                          state === "create"
                            ? `
                        <div class="mb-3">
                            <label for="endsAt" class="form-label">Ends At</label>
                            <input type="datetime-local" class="form-control" id="endsAt" name="endsAt" required>
                        </div>
                        `
                            : ""
                        }
                        <div class="d-flex justify-content-center gap-4 mb-3">
                            ${state === "update" ? `<button type="button" class="btn btn-danger" id="deleteItemBtn">Delete</button>` : ""}
                            <button type="submit" class="btn btn-custom-secondary">${state === "create" ? "Create" : "Update"}</button>
                            <button type="button" class="btn btn-custom" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  `;
}

/**
 * Creates a modal for creating or updating an item.
 * @memberof module:UI/shared
 * @param {string} state - The state of the modal, either "create" or "update".
 * @param {Object} [item=null] - The item object to update (only used in "update" state).
 * @param {string} [targetSelector=null] - The selector for the target element to update (only used in "update" state).
 * @returns {Promise<Object>} - A promise that resolves with the created or updated item data.
 * @throws {Error} - Throws an error if the form submission fails.
 * @example
 * ``` javascript
 * const item = {
 *  id: 1,
 * title: "Sample Item",
 * description: "This is a sample item.",
 * tags: ["tag1", "tag2"],
 * media: [{ url: "https://example.com/image.jpg" }],
 * };
 * const targetSelector = "[data-item-id='1']";
 * createPostItemModal("update", item, targetSelector)
 *  .then((updatedItem) => {
 *   console.log("Item updated:", updatedItem);
 * })
 * .catch((error) => {
 *   console.error("Error updating item:", error);
 * }
 * );
 * ```
 */
export async function createPostItemModal(
  state,
  item = null,
  targetSelector = null,
) {
  return new Promise((resolve, reject) => {
    const modalHtml = generateModalHtml(state, item);
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const postItemModal = new bootstrap.Modal(
      document.getElementById("postItemModal"),
    );
    postItemModal.show();

    const form = document.getElementById("postItemForm");
    // Remove the modal from the DOM when it is hidden
    const modalElement = document.getElementById("postItemModal");
    modalElement.addEventListener("hidden.bs.modal", () => {
      modalElement.remove();
    });

    // Add event listener to the delete button
    if (state === "update") {
      const deleteButton = document.getElementById("deleteItemBtn");
      deleteButton.addEventListener("click", () => {
        confirmDeleteItem(item.id, postItemModal);
      });
    }

    handleModalFormSubmission(form, async (formData) => {
      const tags = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : [];
      const media = formData.mediaUrl ? [{ url: formData.mediaUrl }] : [];
      const itemData = {
        title: formData.title,
        description: formData.description,
        tags,
        media,
      };

      if (state === "create") {
        if (formData.endsAt) {
          itemData.endsAt = new Date(formData.endsAt).toISOString();
        } else {
          console.error("Ends At field is required for creating a new item.");
          return;
        }
      }

      try {
        if (state === "create") {
          await createItem(itemData);
          renderItems(); // Refresh the items after creating a new one
        } else if (state === "update" && item?.id) {
          await updateItem(item.id, itemData);

          // Update the data-item attribute if a targetSelector is provided
          if (targetSelector) {
            const container = document.querySelector(targetSelector);
            if (container) {
              const updatedItem = { ...item, ...itemData }; // Merge updated data with the original item
              // container.setAttribute("data-item", JSON.stringify(updatedItem));
              // Replace the card with the updated card
              const newCard = await createCardMyListing(
                updatedItem,
                updatedItem.seller?.name || "Unknown",
              );
              container.replaceWith(newCard); // Replace the existing card with the new card
            } else {
              console.error(
                `Target container with selector "${targetSelector}" not found.`,
              );
            }
          }

          // Resolve with the updated item
          const updatedItem = { ...item, ...itemData };
          resolve(updatedItem);
        }

        postItemModal.hide();
      } catch (error) {
        console.error("Error during form submission:", error);
        reject(error);
      }
    });
  });
}
