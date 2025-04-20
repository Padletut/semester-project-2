import { renderErrors } from "../../ui/shared/rendererrors.mjs";

/**
 * Handles authorization errors and other response errors.
 * @param {Response} response - The fetch response object.
 * @returns {Promise<Response>} A promise that resolves to the response if no errors are found.
 * @throws {Error} Throws an error if the response contains errors.
 * @example
 * ```javascript
 * const response = await fetch("https://api.example.com/data");
 * await handleErrors(response);
 * ```
 */
export async function handleErrors(response) {
  if (response.ok) {
    return response;
  }

  const errorData = await response.json();

  if (
    response.status === 401 &&
    errorData.errors &&
    errorData.errors.length > 0
  ) {
    const errorMessage = errorData.errors[0].message;
    renderErrors(new Error(errorMessage));
    throw new Error(errorMessage);
  }

  if (
    response.status === 400 &&
    errorData.errors &&
    errorData.errors.length > 0
  ) {
    const errorMessage = errorData.errors[0].message;
    renderErrors(new Error(errorMessage));
    throw new Error(errorMessage);
  }

  if (response.status === 429) {
    renderErrors(new Error("Too many requests. Please try again later."));
    throw new Error("Too many requests. Please try again later.");
  }

  renderErrors(new Error("An error occurred"));
  throw new Error("An error occurred");
}
