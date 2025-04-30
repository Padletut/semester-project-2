import { fetchData } from "../utils/fetch.mjs";
import { headers } from "../utils/headers.mjs";
import { handleErrors } from "../utils/handleerrors.mjs";
import * as constants from "../../constants.mjs";

/**
 * Update an auction item in the listings API.
 * @param {string} itemId - The ID of the item to update.
 * @param {Object} item - The item to update.
 * @example
 * ```javascript
 * const itemId = "12345";
 * const item = {
 *  title: "New Title",
 * description: "Updated description",
 * tags: ["tag1", "tag2"],
 * media: [
 *   { url: "https://example.com/image.jpg", alt: "Updated Image" }
 * ],
 * };
 * updateItem(itemId, item)
 *   .then(response => console.log(response))
 *  .catch(error => console.error(error));
 * ```
 **/
export async function updateItem(itemId, item) {
  const url = `${constants.API_BASE_URL + constants.API_LISTINGS}/${itemId}`;

  const body = JSON.stringify({
    ...(item.title && { title: item.title }), // Include only if provided
    ...(item.description && { description: item.description }),
    ...(item.tags && { tags: item.tags }),
    ...(item.media && { media: item.media }),
  });

  try {
    const response = await fetchData(url, {
      method: "PUT",
      headers: headers(),
      body,
    });

    if (!response.ok) {
      await handleErrors(response);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
}
