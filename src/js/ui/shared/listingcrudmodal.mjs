import { createItem } from "../../API/listings/createItem.mjs";
import { updateItem } from "../../API/listings/updateitem.mjs";
import { confirmDeleteItem } from "./confirmdeleteitem.mjs";
import { handleModalFormSubmission } from "../bootstrap/handlemodalformsubmission.mjs";
import { renderItems } from "../listings/renderitems.mjs";
import { renderMyListingCard } from "../profile/rendermylistingcard.mjs";
import { renderErrors } from "./rendererrors.mjs";
import { rendersuccess } from "./rendersuccess.mjs";

function generateModalHtml(state, item = null) {
  const media = state === "update" && item.media ? item.media : []; // Use existing media if updating

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
                            <label class="form-label">Media</label>
                            <div id="mediaInputsContainer">
                                ${
                                  media.length
                                    ? media
                                        .map(
                                          (mediaItem, index) => `
                                <div class="media-input-group mb-2" data-index="${index}">
                                    <input type="url" class="form-control mb-1" name="mediaUrl" placeholder="Media URL" value="${mediaItem.url}" >
                                    <input type="text" class="form-control" name="mediaAlt" placeholder="Alt text (optional)" value="${mediaItem.alt || ""}">
                                    <button type="button" class="btn btn-danger btn-sm mt-2 remove-media-btn">Remove</button>
                                </div>
                                `,
                                        )
                                        .join("")
                                    : `
                                <div class="media-input-group mb-2">
                                    <input type="url" class="form-control mb-1" name="mediaUrl" placeholder="Media URL">
                                    <input type="text" class="form-control" name="mediaAlt" placeholder="Alt text (optional)">
                                    <button type="button" class="btn btn-danger btn-sm mt-2 remove-media-btn">Remove</button>
                                </div>
                                `
                                }
                            </div>
                            <button type="button" class="btn btn-secondary btn-sm mt-2" id="addMediaBtn">Add Media</button>
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
                            ${state === "update" ? `<button type="button" class="btn btn-custom-delete" id="deleteItemBtn">Delete</button>` : ""}
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
export async function listingCRUDModal(
  state,
  item = null,
  targetSelector = null,
) {
  return new Promise((resolve, reject) => {
    const modalHtml = generateModalHtml(state, item);
    document.body.insertAdjacentHTML("beforeend", modalHtml);

    const auctionItemModal = new bootstrap.Modal(
      document.getElementById("postItemModal"),
    );
    auctionItemModal.show();

    const form = document.getElementById("postItemForm");
    const mediaInputsContainer = document.getElementById(
      "mediaInputsContainer",
    );
    const addMediaBtn = document.getElementById("addMediaBtn");

    // Add new media input group
    addMediaBtn.addEventListener("click", () => {
      const currentMediaCount =
        mediaInputsContainer.querySelectorAll(".media-input-group").length;

      if (currentMediaCount >= 8) {
        showToast("You can only add up to 8 media items.");
        return;
      }
      const mediaInputGroup = document.createElement("div");
      mediaInputGroup.classList.add("media-input-group", "mb-2");
      mediaInputGroup.innerHTML = `
        <input type="url" class="form-control mb-1" name="mediaUrl" placeholder="Media URL" >
        <input type="text" class="form-control" name="mediaAlt" placeholder="Alt text (optional)">
        <button type="button" class="btn btn-danger btn-sm mt-2 remove-media-btn">Remove</button>
      `;
      mediaInputsContainer.appendChild(mediaInputGroup);

      // Add event listener to the remove button
      mediaInputGroup
        .querySelector(".remove-media-btn")
        .addEventListener("click", () => {
          mediaInputGroup.remove();
        });
    });

    // Add event listeners to existing remove buttons
    mediaInputsContainer
      .querySelectorAll(".remove-media-btn")
      .forEach((btn) => {
        btn.addEventListener("click", (event) => {
          event.target.closest(".media-input-group").remove();
        });
      });

    // Add event listener to the delete button
    if (state === "update") {
      const deleteButton = document.getElementById("deleteItemBtn");
      deleteButton.addEventListener("click", () => {
        confirmDeleteItem(item.id, auctionItemModal);
      });
    }

    // Handle form submission
    handleModalFormSubmission(form, async (formData) => {
      const tags = formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : [];
      const media = Array.from(
        mediaInputsContainer.querySelectorAll(".media-input-group"),
      ).map((group) => {
        const url = group.querySelector("input[name='mediaUrl']").value;
        const alt = group.querySelector("input[name='mediaAlt']").value;
        return { url, alt };
      });
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
              const updatedItem = { ...item, ...itemData };
              const newCard = await renderMyListingCard(
                updatedItem,
                updatedItem.seller?.name || "Unknown",
              );
              container.replaceWith(newCard);
            }
          }

          resolve({ ...item, ...itemData });
        }
        rendersuccess({
          message:
            state === "create"
              ? "Listing created successfully!"
              : "Listing updated successfully!",
        });

        auctionItemModal.hide();
      } catch (error) {
        auctionItemModal.hide();
        renderErrors({
          message:
            state === "create"
              ? "Failed to create the listing. Please try again later."
              : "Failed to update the listing. Please try again later.",
        });
        console.error("Error during form submission:", error);
        reject(error);
      }
    });
    const modalElement = document.getElementById("postItemModal");
    modalElement.addEventListener("hidden.bs.modal", () => {
      modalElement.remove();
    });
  });
}

// Function to show a toast notification
function showToast(message) {
  const toastContainer =
    document.getElementById("toastContainer") || createToastContainer();
  const toast = document.createElement("div");
  toast.className = "toast align-items-center text-bg-warning border-0";
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");
  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
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
function createToastContainer() {
  const container = document.createElement("div");
  container.id = "toastContainer";
  container.className = "toast-container position-fixed top-50 start-25 p-3";
  document.body.appendChild(container);
  return container;
}
