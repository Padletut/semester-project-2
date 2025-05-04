import { validateInputs } from "./validateinputs.mjs";

/**
 * Handles form submission for modal forms.
 * @memberof module:UI/bootstrap
 * @param {HTMLFormElement} form - The form element to validate and submit.
 * @param {Function} submitCallback - The callback function to handle the form data (e.g., API calls).
 * @example
 * ```javascript
 * handleModalFormSubmission(form, async (formData) => {
 *   await createItem(formData);
 * });
 * ```
 */
export async function handleModalFormSubmission(form, submitCallback) {
  if (!form) {
    console.error("Form not found.");
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (validateInputs(form)) {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());

      try {
        await submitCallback(data);
        form.reset();
      } catch (error) {
        console.error("Error during form submission:", error);
      }
    } else {
      form.classList.add("was-validated");
    }
  });
}
