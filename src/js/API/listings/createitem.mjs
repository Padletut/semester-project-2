import { fetchData } from "../utils/fetchdata.mjs";
import { headers } from "../utils/headers.mjs";
import * as constants from "../../constants.mjs";
import { handleErrors } from "../utils/handleerrors.mjs";

/**
 * Post a new auction item to the listings API.
 * @memberof module:API/listings
 * @param {Object} item - The item to post.
 * @param {string} item.title - The title of the item (required).
 * @param {string} [item.description] - The description of the item (optional).
 * @param {string[]} [item.tags] - The tags associated with the item (optional).
 * @param {Object[]} [item.media] - The media associated with the item (optional).
 * @param {string} item.media[].url - The URL of the media.
 * @param {string} [item.media[].alt] - The alt text for the media.
 * @param {string} item.endsAt - The date and time when the item ends (required).
 * @returns {Promise<Object>} - The response from the API.
 * @throws {Error} - If the request fails or the response is not ok.
 * @example
 * const item = {
 *   title: "Auction Item",
 *   description: "This is a great item.",
 *   tags: ["tag1", "tag2"],
 *   media: [
 *     { url: "https://example.com/image.jpg", alt: "Example Image" }
 *   ],
 *   endsAt: new Date().toISOString()
 * };
 * postItem(item)
 *   .then(response => console.log(response))
 *   .catch(error => console.error(error));
 */
export async function createItem(item) {
  const url = `${constants.API_BASE_URL + constants.API_LISTINGS}`;
  const body = {
    title: item.title,
    description: item.description || "",
    tags: item.tags || [],
    media: item.media || [],
    endsAt: item.endsAt,
  };

  try {
    const response = await fetchData(url, {
      headers: headers(true),
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    handleErrors(error);
    console.error("Error posting item:", error);
    throw error;
  }
}
