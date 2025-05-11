/**
 * Image Modal - A Bootstrap modal for displaying images in a carousel format.
 * @param {string} title - The title of the modal.
 * @param {Array} images - An array of image objects, each containing a URL and optional alt text.
 * @param {number} [currentIndex=0] - The index of the currently displayed image.
 * @example
 * ```javascript
 * imageModal("My Images", [
 *   { url: "https://example.com/image1.jpg", alt: "Image 1" },
 *  { url: "https://example.com/image2.jpg", alt: "Image 2" },
 *  { url: "https://example.com/image3.jpg", alt: "Image 3" },
 * ]);
 * ```
 */
export function imageModal(title, images, currentIndex = 0) {
  const body = document.querySelector("body");
  const existingModal = document.getElementById("imageModal");

  // Remove existing modal if it exists
  if (existingModal) {
    existingModal.remove();
  }

  // Create the modal element
  const modal = document.createElement("div");
  modal.className = "modal modal-lg fade";
  modal.id = "imageModal";
  modal.tabIndex = -1;
  modal.setAttribute("aria-labelledby", "imageModalLabel");
  modal.setAttribute("aria-hidden", "true");

  // Generate carousel items
  const carouselItems = images
    .map(
      (image, index) => `
      <div class="carousel-item ${index === currentIndex ? "active" : ""}">
        <img src="${image.url}" class="d-block w-100" alt="${image.alt || "Image"}">
        <p class="text-center text-light mt-2">${image.alt || ""}</p>
      </div>
    `,
    )
    .join("");

  // Set the modal's inner HTML
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header" data-bs-theme="dark">
          <div class="w-100 text-center">
              <h5 class="modal-title" id="imageModalLabel">${title}</h5>
          </div>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          <div id="imageCarousel" class="carousel slide" data-bs-ride="carousel">
            <div class="carousel-inner">
              ${carouselItems}
            </div>
            <button class="carousel-control-prev" type="button" data-bs-target="#imageCarousel" data-bs-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Previous</span>
            </button>
            <button class="carousel-control-next" type="button" data-bs-target="#imageCarousel" data-bs-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  // Append the modal to the body
  body.appendChild(modal);

  // Initialize and show the modal
  const bootstrapModal = new bootstrap.Modal(modal);
  bootstrapModal.show();
}
