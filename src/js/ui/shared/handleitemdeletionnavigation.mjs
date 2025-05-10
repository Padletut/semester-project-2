import { renderProfile } from "../profile/renderprofile.mjs";

/**
 * Handles the navigation after deleting a post.
 * If the user is on the detail page, it redirects to the Listings page.
 * Otherwise, it refreshes the profile listings.
 * @memberof module:ui/shared
 * @example
 * ```javascript
 * handlePostDeletionNavigation();
 * ```javascript
 */
export function handleItemDeletionNavigation() {
  const currentUrl = window.location.href;
  if (currentUrl.includes("detail")) {
    // Redirect to the Listings page
    window.location.href = "/";
  } else {
    renderProfile(); // Refresh the profile listings if not on the detail page
  }
}
