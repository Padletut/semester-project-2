import * as constants from "../../constants.mjs";
import { loadStorage } from "../../storage/loadstorage.mjs";
import { handleProfileUpdate } from "./handleprofileupdate.mjs";
import { handleErrors } from "../../API/utils/handleerrors.mjs";

const { STORAGE_KEYS } = constants;
const { PROFILE } = STORAGE_KEYS;
const loggedInUser = loadStorage(PROFILE);

/**
 * Function to edit profile.
 * It creates a modal for the user to input their profile avatar and bio.
 * The modal is created using Bootstrap and includes form validation.
 * @memberof module:UI/profile
 * @param {Object} [profile=loggedInUser] - The profile object.
 * @returns {Promise<void>} A promise that resolves when the profile avatar and bio update is complete.
 * @example
 * ```javascript
 * const profile = { data: { name: "john_doe" } };
 * await editProfile(profile);
 * ```
 */
export async function editProfile(profile = loggedInUser) {
  try {
    const profileContainer = document.querySelector(".card-profile");
    if (profileContainer) {
      const latestProfileData = JSON.parse(
        profileContainer.getAttribute("data-profile"),
      );
      profile = { ...profile, ...latestProfileData };
    }

    const {
      banner: { url: coverUrl = "" } = {},
      avatar: { url: avatarUrl = "" } = {},
      bio = "",
    } = profile || {};
    const modalHtml = `
          <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModalLabel" aria-hidden="true">
              <div class="modal-dialog">
                  <div class="modal-content">
                      <div class="modal-header" data-bs-theme="dark">
                          <div class="w-100 text-center">
                          <h5 class="modal-title" id="editProfileModalLabel">Edit Profile</h5>
                          </div>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>
                      <div class="modal-body">
                          <form id="editProfileForm" class="needs-validation" novalidate>
                              <div class="mb-3">
                                  <label for="coverUrl" class="form-label">Banner URL</label>
                                  <input type="url" class="form-control" id="coverUrl" value="${coverUrl}" required>
                                  <div class="invalid-feedback">Please provide a valid URL.</div>
                              </div>
                              <div class="mb-3">
                                  <label for="bio" class="form-label">Bio</label>
                                  <textarea class="form-control" id="bio" rows="3" required>${bio}</textarea>
                                  <div class="invalid-feedback">Please provide a bio.</div>
                              </div>
                              <div class="mb-4">
                                  <label for="avatarUrl" class="form-label">Avatar URL</label>
                                  <input type="url" class="form-control" id="avatarUrl" value="${avatarUrl}" required>
                                  <div class="invalid-feedback">Please provide a valid URL.</div>
                              </div>
                              <div class="d-flex justify-content-center gap-4 mb-3">
                              <button type="submit" class="btn btn-custom-secondary">Save</button>
                              <button type="button" class="btn btn-custom" data-bs-dismiss="modal">Cancel</button>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>
      `;
    document.body.insertAdjacentHTML("beforeend", modalHtml);
    const editAvatarBioModal = new bootstrap.Modal(
      document.getElementById("editProfileModal"),
    );
    editAvatarBioModal.show();

    // Handle form submission
    document
      .getElementById("editProfileForm")
      .addEventListener("submit", async function (event) {
        event.preventDefault();
        const form = event.target;
        if (!form.checkValidity()) {
          form.classList.add("was-validated");
          return;
        }

        const coverUrl = document.getElementById("coverUrl").value;
        const avatarUrl = document.getElementById("avatarUrl").value;
        const bio = document.getElementById("bio").value;
        const updatedProfile = {
          banner: {
            url: coverUrl,
            alt: `Cover for profile ${profile.name}`,
          },
          avatar: {
            url: avatarUrl,
            alt: `Avatar for profile ${profile.name}`,
          },
          bio: bio,
        };
        const mergedProfile = { ...profile, ...updatedProfile };

        try {
          const response = await handleProfileUpdate(
            mergedProfile,
            updatedProfile,
            "editProfileModal",
            "editProfileForm",
          );

          // Use handleErrors to validate the response
          await handleErrors(response);
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      });
  } catch (error) {
    console.error("Error in editProfile:", error);
    handleErrors(error);
  }
}
