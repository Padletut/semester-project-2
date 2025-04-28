import { fetchData } from "../utils/fetch.mjs";
import { headers } from "../utils/headers.mjs";
import { handleErrors } from "../utils/handleerrors.mjs";
import * as constants from "../../constants.mjs";

/**
 * Update an auction item in the listings API.
 * @param {string} itemId - The ID of the item to update.
 * @param {Object} item - The updated item data.
 * @param {string} [item.title] - The title of the item (optional).
 * @param {string} [item.description] - The description of the item (optional).
 * @param {string[]} [item.tags] - The tags associated with the item (optional).
 * @param {Object[]} [item.media] - The media associated with the item (optional).
 * @param {string} item.media[].url - The URL of the media.
 * @param {string} [item.media[].alt] - The alt text for the media.
 * @returns {Promise<Object>} - The response from the API.
 * @throws {Error} - If the request fails or the response is not ok.
 * @example
 * const item = {
 *   title: "Updated Auction Item",
 *   description: "This is an updated description.",
 *   tags: ["updatedTag1", "updatedTag2"],
 *   media: [
 *     { url: "https://example.com/updated-image.jpg", alt: "Updated Image" }
 *   ]
 * };
 * updateItem("item-id", item)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
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
