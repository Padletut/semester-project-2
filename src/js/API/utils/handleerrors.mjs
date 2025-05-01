import { renderErrors } from "../../ui/shared/rendererrors.mjs";
import { ERROR_MESSAGES } from "../utils/errormessages.mjs";

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
    renderErrors(new Error(ERROR_MESSAGES.AUTHORIZATION_ERROR));
    throw new Error(ERROR_MESSAGES.AUTHORIZATION_ERROR);
  }

  if (
    response.status === 400 &&
    errorData.errors &&
    errorData.errors.length > 0
  ) {
    renderErrors(new Error(ERROR_MESSAGES.LOADING_PAGE_ERROR));
    console.error("Error fetching auction items:", errorData.errors);
    throw new Error(ERROR_MESSAGES.LOADING_PAGE_ERROR);
  }

  if (response.status === 429) {
    renderErrors(new Error(ERROR_MESSAGES.TOO_MANY_REQUESTS_ERROR));
    throw new Error(ERROR_MESSAGES.TOO_MANY_REQUESTS_ERROR);
  }

  renderErrors(new Error(ERROR_MESSAGES.LOADING_PAGE_ERROR));
  throw new Error(ERROR_MESSAGES.LOADING_PAGE_ERROR);
}
