import { toggleLoader } from "../shared/toggleLoader.mjs";
import { renderErrors } from "../shared/rendererrors.mjs";
import { getMyBids } from "../../API/profile/getmybids.mjs";

/**
 * Renders the user's bids on the profile page.
 * @memberof module:Profile
 * Example usage:
 * ```javascript
 * await renderMyBids();
 * ```
 */

export async function renderMyBids() {
  const urlParams = new URLSearchParams(window.location.search);
  let profileName = urlParams.get("profile");
  if (profileName === null) {
    profileName = undefined;
  }

  const loaderContainer = document.getElementById("loader-my-bids");
  const myBidsContainer = document.getElementById("my-bids-container");
  myBidsContainer.innerHTML = ""; // Clear previous bids

  try {
    toggleLoader(true, loaderContainer);
    const { data: bids } = await getMyBids(profileName);

    if (bids.length === 0) {
      myBidsContainer.innerHTML = `<div class="flex-grow-1 mb-1">No bids found.</div>`;
      return;
    }

    bids.forEach((bid) => {
      const bidElement = document.createElement("div");
      bidElement.className = "bid-item";
      bidElement.innerHTML = `
        <div class="bid-list-name flex-grow-1 mb-1">${bid.item}</div>
        <div class="bid-list-date flex-grow-1 text-center">${new Date(
          bid.date,
        ).toLocaleDateString("no-NO", {
          month: "long",
          day: "2-digit",
          year: "numeric",
        })}</div>
        <div class="bid-list-amount flex-grow-1 text-end">${bid.amount} Credits</div>
      `;
      myBidsContainer.appendChild(bidElement);
    });
  } catch (error) {
    renderErrors(new Error("An error occurred while loading the profile page"));
    console.error("Error rendering profile data:", error);
  } finally {
    toggleLoader(false, loaderContainer);
  }
}
