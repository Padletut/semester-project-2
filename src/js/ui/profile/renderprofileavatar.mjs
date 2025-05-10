/**
 * Handles the authentication process for login and registration forms.
 * @memberof module:UI/profile
 * @param {Event} event - The event object from the form submission.
 * @returns {Promise<void>} A promise that resolves when the authentication process is complete.
 * @example
 * ```javascript
 * document.querySelector("form").addEventListener("submit", onAuth);
 * ```
 */
export async function renderProfileAvatar(profileName) {
  const profileAvatar = document.getElementById("profile-image");
  profileAvatar.innerHTML = ""; // Clear existing avatar

  if (!profileAvatar) {
    console.error("Profile avatar element not found");
    return;
  }

  try {
    const profileAvatarImage = document.createElement("img");
    profileAvatarImage.classList.add(
      "profile-avatar-image",
      "rounded-circle",
      "card-profile-img",
      "border",
      "border-primary",
    );
    profileAvatarImage.src = profileName.avatar.url;
    profileAvatarImage.alt = profileName.avatar.alt;

    profileAvatar.appendChild(profileAvatarImage);
  } catch (error) {
    console.error(error);
  }
}
