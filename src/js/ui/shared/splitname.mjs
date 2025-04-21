/**
 * 
 * @param {*} name 
 * @returns 
 *
 * @example
 * splitName("john_doe");
 * // Returns "john doe"
 */
export function splitName(name) {
    return name.split("_").join(" ");
}