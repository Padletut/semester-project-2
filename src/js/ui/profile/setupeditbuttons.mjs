import { editProfile } from "../profile/editprofile.mjs";
import { checkProfileOwner } from "../../API/profile/checkprofileowner.mjs";

/**
 * Sets up event listeners for edit buttons.
 * @memberof module:Profile
 * @param {Object} profile - The profile object.
 * @example
 * ```javascript
 * const profile = { data: { name: "john_doe" } };
 * setupEditButtons(profile);
 * ```
 */
export async function setupEditButtons(profile) {
  const editProfileButton = document.querySelector('[name="edit-profile"]');
  const isOwner = checkProfileOwner(profile);

  if (!isOwner) {
    if (editProfileButton) {
      editProfileButton.remove();
    }
    return;
  } else {
    if (editProfileButton) {
      editProfileButton.addEventListener("click", async () => {
        await editProfile(profile);
      });
    }
  }
}
