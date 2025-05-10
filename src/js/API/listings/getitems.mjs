import * as global from "../../constants.mjs";
import { fetchData } from "../utils/fetchdata.mjs";
import { renderErrors } from "../../ui/shared/rendererrors.mjs";
import { ERROR_MESSAGES } from "../utils/errormessages.mjs";

const { API_BASE_URL, API_LISTINGS, API_SEARCH } = global;

/**
 * Gets all items from the API.
 * @memberof module:API/listings
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
  itemName = null,
  tag = null,
) {
  if (itemName) {
    queryParams.append("itemName", itemName);
  }
  if (tag) {
    queryParams.append("tag", tag);
  }
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
    renderErrors(new Error(ERROR_MESSAGES.LOADING_PAGE_ERROR));
    console.error("Error fetching auction items:", response);
  }
}
