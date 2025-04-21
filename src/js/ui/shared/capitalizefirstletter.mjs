/**
 * Capitalizes the first letter of a string.
 * @param {string} string - The string to capitalize.
 * @returns {string} The string with the first letter capitalized.
 * @example
 * ```javascript
 * const capitalized = capitalizeFirstLetter("john");
 * console.log(capitalized); // "John"
 * ```
 */
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
