/**
 * Splits a name string by underscores and joins it with spaces.
 * @param {string} name - The name string to split.
 * @return {string} - The formatted name string with spaces.
 **/
export function splitName(name) {
  return name.split("_").join(" ");
}
