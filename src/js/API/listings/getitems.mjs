import * as global from "../../constants.mjs";
import { fetchData } from "../utils/fetch.mjs";
import { renderErrors } from "../../ui/shared/rendererrors.mjs";

const { API_BASE_URL, API_LISTINGS, API_SEARCH } = global;

/**
 * Gets all items from the API.
 * @param {URLSearchParams} queryParams - The query parameters for the request.
 * @param {boolean} [search=false] - Whether to use the search endpoint.
 * @returns {Promise<Object>} A promise that resolves to the items data.
 * @example
 * ```javascript
 * const items = await getItems(new URLSearchParams({ _author: "true", _comments: "true", limit: 10, page: 1 }));
 * console.log(items);
 * ```
 */
export async function getItems(
  queryParams = new URLSearchParams({
    _seller: "false",
    _bids: "false",
    _active: "false",
    limit: "10",
    page: "1",
  }),
  search = false,
) {
  const endpoint = search
    ? `${API_BASE_URL}${API_LISTINGS}${API_SEARCH}?${queryParams.toString()}`
    : `${API_BASE_URL}${API_LISTINGS}?${queryParams.toString()}`;
  const response = await fetchData(endpoint, {
    method: "GET",
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    renderErrors(new Error("An error occurred while loading the auctions"));
    console.error("Error fetching auction items:", response);
  }
}
