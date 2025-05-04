import { toggleLoader } from "../shared/toggleLoader.mjs";
import { renderErrors } from "../shared/rendererrors.mjs";
import { getMyBids } from "../../API/profile/getmybids.mjs";
import { ERROR_MESSAGES } from "../../API/utils/errormessages.mjs";

/**
 * Renders the user's bids on the profile page.
 * @memberof module:UI/profile
 * @example
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

    const bidElement = document.createElement("li");
    bidElement.className = "bid-item, d-flex";
    bidElement.innerHTML = `
      <div class="bid-list-name-heading flex-grow-1 mb-3 h6">Title</div>
      <div class="bid-list-date-heading flex-grow-1 text-center h6">Ends At</div>
      <div class="bid-list-amount-heading flex-grow-1 text-end h6">Bid Amount</div>
    `;

    myBidsContainer.appendChild(bidElement);

    bids.forEach((bid) => {
      const bidElement = document.createElement("li");
      bidElement.className = "bid-item, d-flex";
      bidElement.id = `bid-${bid.id}`; // Set a unique ID for each bid item
      bidElement.innerHTML = `
        <div class="bid-list-name flex-grow-1 mb-1">${bid.listing.title}</div>
        <div class="bid-list-date flex-grow-1 text-center">${new Date(
          bid.listing.endsAt,
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })}</div>
        <div class="bid-list-amount flex-grow-1 text-end">${bid.amount} Credits</div>
      `;
      myBidsContainer.appendChild(bidElement);

      // Event listener for bid item click
      bidElement.addEventListener("click", () => {
        window.location.href = `detail.html?id=${bid.listing.id}`;
      });
    });
  } catch (error) {
    renderErrors(new Error(ERROR_MESSAGES.LOADING_PROFILE_ERROR));
    console.error("Error rendering profile data:", error);
  } finally {
    toggleLoader(false, loaderContainer);
  }
}
