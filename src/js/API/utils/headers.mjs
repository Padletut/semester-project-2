import { loadStorage } from "../../storage/loadstorage.mjs";
import { API_KEY } from "../../constants.mjs";

/**
 * Handles the authentication process for login and registration forms.
 * @memberof module:API/utils
 * @param {Event} event - The event object from the form submission.
 * @returns {Promise<void>} A promise that resolves when the authentication process is complete.
 * @example
 * ```javascript
 * document.querySelector("form").addEventListener("submit", onAuth);
 * ```
 **/
export function headers(hasBody = false) {
  const headers = new Headers();
  const accessToken = loadStorage("accessToken");

  if (accessToken) {
    headers.append("Authorization", `Bearer ${accessToken}`);
  }

  if (API_KEY) {
    headers.append("X-Noroff-API-Key", API_KEY);
  }

  if (hasBody) {
    headers.append("Content-Type", "application/json");
  }

  return headers;
}
