/**
 * Loads a value from local storage and parses it as JSON.
 * @param {string} key - The key of the item to load from local storage.
 * @returns {any} The parsed value from local storage.
 * @example
 * ```javascript
 * const profile = loadStorage("profile");
 * console.log(profile);
 * ```
 */
export function loadStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}