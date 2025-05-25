import { getItems } from "../../API/listings/getitems.mjs";

/**
 * Fetch a page of items from the listings API.
 * @memberof module:API/search
 * @param {URLSearchParams} queryParams - The query parameters for the request.
 * @returns {Promise<Object[]>} A promise that resolves to the items data for the current page.
 * @example
 * ```javascript
 * const items = await fetchPage.call(instance, new URLSearchParams({ _seller: "true", _bids: "true", limit: 10 }));
 * console.log(items);
 * ```
 */
export async function fetchPage(instance, queryParams) {
  queryParams.set("page", instance.currentPage);

  const response = await getItems(queryParams);

  if (response && response.data) {
    instance.isLastPage = response.meta.isLastPage;
    instance.currentPage = response.meta.nextPage;
    return response.data;
  } else {
    instance.isLastPage = true;
    return [];
  }
}
