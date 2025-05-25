/**
 * Creates query parameters for fetching items from the API.
 * @private
 * @param {Object} additionalParams - Additional query parameters to include.
 * @returns {URLSearchParams} - The constructed query parameters.
 * @example
 * ```javascript
 * const queryParams = this.createQueryParams({ _tag: "electronics" });
 * ```
 */
export function createQueryParams(instance, additionalParams = {}) {
  const activeSwitch = document.getElementById("switchCheckChecked");
  const isActive = activeSwitch.checked;
  const searchQuery = instance.searchInput.value.trim();
  const tag = instance.tags.length > 0 ? instance.tags[0] : "";

  return new URLSearchParams({
    _seller: "true",
    _bids: "true",
    _active: isActive.toString(),
    limit: "100",
    sort: "created",
    ...(searchQuery && { q: searchQuery }),
    ...(tag && { _tag: tag }),
    ...additionalParams,
  });
}
