import { saveStorage } from "../../storage/savestorage.mjs";
import { STORAGE_KEYS } from "../../constants.mjs";

/**
 * Logs out the user by clearing the access token and profile from storage and redirecting to the index page.
 * @memberof module:API/auth
 * @example
 * ```javascript
 * logout();
 * ```
 */
export function logout() {
  const { ACCESS_TOKEN, PROFILE } = STORAGE_KEYS;
  saveStorage(ACCESS_TOKEN, "");
  saveStorage(PROFILE, "");
  window.location.replace("/");
}
