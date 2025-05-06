import { headers } from "./headers.mjs";
import { handleErrors } from "./handleerrors.mjs";

/**
 * Performs a fetch request and delegates error handling to handleErrors.
 * @memberof module:API/utils
 * @param {string} url - The URL to fetch.
 * @param {Object} [options={}] - The options for the fetch request.
 * @param {string} [options.method] - The HTTP method to use (e.g., "GET", "POST").
 * @param {Object} [options.headers] - Additional headers to include in the request.
 * @param {Object} [options.body] - The body of the request.
 * @returns {Promise<Response>} A promise that resolves to the response of the fetch request.
 * @throws {Error} Throws an error if the response is not ok.
 */
export async function fetchData(url, options = {}, context = null) {
  const response = await fetch(url, {
    ...options,
    headers: headers(Boolean(options.body)),
  });

  if (!response.ok) {
    await handleErrors(response, context);
  }

  return response;
}
