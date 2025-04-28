import { createItem } from "../../API/listings/createitem.mjs";
import { updateItem } from "../../API/listings/updateitem.mjs";
import { handleModalFormSubmission } from "../bootstrap/handlemodalformsubmission.mjs";
import { renderItems } from "./renderitems.mjs";

function generateModalHtml(state, item = null) {
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
                            <input type="url" class="form-control" id="mediaUrl" name="mediaUrl" ${state === "update" ? `value="${item.media[0].url}"` : ""}>
                        </div>
                        <div class="mb-3">
                            <label for="endsAt" class="form-label">Ends At</label>
                            <input type="datetime-local" class="form-control" id="endsAt" name="endsAt" required ${state === "update" ? `value="${new Date(item.endsAt).toISOString().slice(0, 16)}"` : ""}>
                        </div>
                        <div class="d-flex justify-content-center gap-4 mb-3">
                            <button type="submit" class="btn btn-primary">${state === "create" ? "Create" : "Update"}</button>
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
  `;
}

export async function createPostItemModal(state, item = null) {
  const modalHtml = generateModalHtml(state, item);
  document.body.insertAdjacentHTML("beforeend", modalHtml);

  const postItemModal = new bootstrap.Modal(
    document.getElementById("postItemModal"),
  );
  postItemModal.show();

  const form = document.getElementById("postItemForm");

  handleModalFormSubmission(form, async (formData) => {
    const tags = formData.tags
      ? formData.tags.split(",").map((tag) => tag.trim())
      : [];
    const media = formData.mediaUrl ? [{ url: formData.mediaUrl }] : [];
    const endsAt = new Date(formData.endsAt).toISOString();

    const itemData = {
      title: formData.title,
      description: formData.description,
      tags,
      media,
      endsAt,
    };

    if (state === "create") {
      await createItem(itemData);
    } else if (state === "update" && item?.id) {
      await updateItem(item.id, itemData);
    }

    postItemModal.hide();
    renderItems(); // Refresh the listings after creating or updating an item
  });
}
