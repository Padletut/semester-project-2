/**
 * Splits a name string by underscores and joins it with spaces.
 * @memberof module:UI/shared
 * @param {string} name - The name string to split.
 * @return {string} - The formatted name string with spaces.
 * @example
 * ```javascript
 * const name = "john_doe";
 * const formattedName = splitName(name);
 * console.log(formattedName); // "john doe"
 * ```
 **/
export function splitName(name) {
  return name.split("_").join(" ");
}
