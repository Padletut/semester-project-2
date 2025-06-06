/**
 * Renders the profile banner in the element with id "profile-cover".
 * @memberof module:UI/profile
 * @param {Object} profileName - The profile object containing banner data.
 * @example
 * ```javascript
 * const profile = { data: { banner: { url: "https://example.com/banner.jpg", alt: "Profile Banner" } } };
 * await renderProfileBanner(profile);
 * ```
 */
export async function renderProfileBanner(profileName) {
  const profileBanner = document.getElementById("profile-cover");
  profileBanner.innerHTML = ""; // Clear existing banner

  if (!profileBanner) {
    console.error("Profile cover element not found");
    return;
  }

  try {
    const profileBannerImage = document.createElement("img");
    profileBannerImage.classList.add(
      "img-fluid",
      "profile-banner-image",
      "rounded-start",
    );
    profileBannerImage.src = profileName.banner.url;
    profileBannerImage.alt = profileName.banner.alt;

    profileBanner.appendChild(profileBannerImage);
  } catch (error) {
    console.error(error);
  }
}
