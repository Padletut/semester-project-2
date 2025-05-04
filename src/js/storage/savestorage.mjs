/**
 * Saves a value to local storage after stringifying it as JSON.
 * @memberof module:Storage
 * @param {string} key - The key under which to save the item in local storage.
 * @param {any} value - The value to save to local storage.
 * @example
 * ```javascript
 * const profile = { name: "john_doe", email: "john.doe@example.com" };
 * saveStorage("profile", profile);
 * ```
 */
export function saveStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
