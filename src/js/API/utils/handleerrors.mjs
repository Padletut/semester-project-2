import { renderErrors } from "../../ui/shared/rendererrors.mjs";
import { ERROR_MESSAGES } from "../utils/errormessages.mjs";

/**
 * Handles authorization errors and other response errors.
 * @memberof module:API/utils
 * @param {Response} response - The fetch response object.
 * @param {string|null} context - The context in which the error occurred (e.g., "login").
 * @returns {Promise<Response>} - The original response if no error occurred.
 * @throws {Error} - Throws an error if the response is not ok.
 * @example
 * ```javascript
 * fetch(url)
 *   .then((response) => handleErrors(response, "login"))
 *  .then((data) => console.log(data))
 * .catch((error) => console.error(error));
 * ```
 */
export async function handleErrors(response, context = null) {
  if (response.ok) {
    return response;
  }

  const errorData = await response.json();

  if (
    response.status === 401 &&
    errorData.errors &&
    errorData.errors.length > 0
  ) {
    if (context === "login") {
      renderErrors(new Error(ERROR_MESSAGES.LOGIN_FAILED));
      throw new Error(ERROR_MESSAGES.LOGIN_FAILED);
    } else {
      renderErrors(new Error(ERROR_MESSAGES.AUTHORIZATION_ERROR));
      throw new Error(ERROR_MESSAGES.AUTHORIZATION_ERROR);
    }
  }

  if (
    response.status === 400 &&
    errorData.errors &&
    errorData.errors.length > 0
  ) {
    const errorMessage = errorData.errors[0].message;
    if (errorMessage === "Profile already exists") {
      renderErrors(new Error(ERROR_MESSAGES.ACCOUNT_EXISTS));
      throw new Error(ERROR_MESSAGES.ACCOUNT_EXISTS);
    }
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
