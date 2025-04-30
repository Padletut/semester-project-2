import * as constants from "../../constants.mjs";
import { fetchData } from "../utils/fetch.mjs";
import { handleErrors } from "../utils/handleerrors.mjs";

const { API_BASE_URL, API_LISTINGS } = constants;

/**
 * Gets a single item by ID.
 * @param {number} itemId - The ID of the item to get.
 * @returns {Promise<Object>} A promise that resolves to the item data.
 * @example
 * ```javascript
 * const itemId = 123;
 * const item = await getPost(postId);
 * console.log(post);
 * ```
 */
export async function getItem(itemId) {
  const queryParams = new URLSearchParams({
    _seller: "true",
    _bids: "true",
  });
  if (!itemId) {
    throw new Error("Item ID is required to fetch the item.");
  }
  const response = await fetchData(
    `${API_BASE_URL}${API_LISTINGS}/${itemId}?${queryParams}`,
    {
      method: "GET",
    },
  );
  if (response.ok) {
    const postData = await response.json();
    return postData.data;
  }

  await handleErrors(response);
}
