/**
 * Validates the tags input.
 * @memberof module:UI/bootstrap
 * @param {HTMLInputElement} tagsInput - The tags input element to validate.
 * @returns {boolean} True if the tags are valid, false otherwise.
 * @example
 * ```javascript
 * const form = document.getElementById("createPostForm");
 * const tagsInput = form.querySelector("#tags");
 * const isValid = validateTags(tagsInput);
 * console.log(isValid); // true or false
 * ```
 */
export function validateTags(tagsInput) {
  const tags = tagsInput.value.split(",").map((tag) => tag.trim());
  const errors = [];

  if (tags.length > 8) {
    errors.push("You can only add up to 8 tags");
  }
  tags.forEach((tag) => {
    if (tag.length > 24) {
      errors.push(`Tag "${tag}" exceeds the maximum length of 24 characters`);
    }
  });

  if (errors.length > 0) {
    tagsInput.setCustomValidity(errors.join(". "));
    const errorContainer = document.getElementById("tagsFeedback");
    if (errorContainer) {
      errorContainer.innerHTML = errors.join(". ");
    }
    return false;
  } else {
    tagsInput.setCustomValidity("");
    const errorContainer = document.getElementById("tagsFeedback");
    if (errorContainer) {
      errorContainer.innerHTML = "";
    }
    return true;
  }
}
