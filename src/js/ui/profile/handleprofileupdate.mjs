import * as global from "../../constants.mjs";
import { fetchData } from "../../API/utils/fetch.mjs";
import { headers } from "../../API/utils/headers.mjs";
import { handleErrors } from "../../API/utils/handleerrors.mjs";
import { ERROR_MESSAGES } from "../../API/utils/errormessages.mjs";

const { API_BASE_URL, API_PROFILES } = global;

/**
 * Generic function to handle profile updates.
 * This function takes a profile object and updated profile data,
 * and sends a PUT request to update the profile on the server.
 * @memberof module:UI/profile
 * @param {Object} profile - The profile object.
 * @param {Object} updatedProfile - The updated profile data.
 * @param {string} modalId - The ID of the modal to hide.
 * @param {string} formId - The ID of the form to validate.
 * @returns {Promise<void>} A promise that resolves when the profile update is complete.
 * @example
 * ```javascript
 * const profile = { data: { name: "john_doe" } };
 * const updatedProfile = { bio: "New bio" };
 * await handleProfileUpdate(profile, updatedProfile, "editBioModal", "editBioForm");
 * ```
 */
export async function handleProfileUpdate(profile, updatedProfile, modalId) {
  const { name } = profile;

  try {
    const response = await fetchData(`${API_BASE_URL}${API_PROFILES}/${name}`, {
      method: "PUT",
      headers: headers(true),
      body: JSON.stringify(updatedProfile),
    });

    if (response.ok) {
      // Hide the modal
      const modal = bootstrap.Modal.getInstance(
        document.getElementById(modalId),
      );
      if (modal) {
        modal.hide();
      }
      document.getElementById(modalId).remove();

      const profileContainer = document.querySelector(".card-profile");
      if (profileContainer) {
        const updatedProfileData = { ...profile, ...updatedProfile };
        profileContainer.setAttribute(
          "data-profile",
          JSON.stringify(updatedProfileData),
        );
      }
      return response;
    } else {
      console.error("Error updating profile:", response.statusText);
      handleErrors(new Error(ERROR_MESSAGES.PROFILE_UPDATE_FAILED));
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    handleErrors(error);
  }
}
