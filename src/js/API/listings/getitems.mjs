import * as global from "../../constants.mjs";
import { fetchData } from "../utils/fetch.mjs";
import { renderErrors } from "../../ui/shared/rendererrors.mjs";

const { API_BASE_URL, API_LISTINGS: API_POSTS, API_SEARCH } = global;

/**
 * Gets all posts from the API.
 * @param {URLSearchParams} queryParams - The query parameters for the request.
 * @param {boolean} [search=false] - Whether to use the search endpoint.
 * @returns {Promise<Object>} A promise that resolves to the posts data.
 * @example
 * ```javascript
 * const posts = await getPosts(new URLSearchParams({ _author: "true", _comments: "true", limit: 10, page: 1 }));
 * console.log(posts);
 * ```
 */
export async function getItems(
  queryParams = new URLSearchParams({
    _author: "true",
    _comments: "true",
    _reactions: "true",
    limit: "10",
    page: "1",
  }),
  search = false,
) {
  const endpoint = search
    ? `${API_BASE_URL}${API_POSTS}${API_SEARCH}?${queryParams.toString()}`
    : `${API_BASE_URL}${API_POSTS}?${queryParams.toString()}`;
  const response = await fetchData(endpoint, {
    method: "GET",
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    renderErrors(new Error("An error occurred while loading the posts"));
    console.error("Error fetching posts:", response);
  }
}
