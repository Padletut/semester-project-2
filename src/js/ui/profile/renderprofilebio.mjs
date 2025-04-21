/**
 * Renders the profile bio in the element with id "profile-bio".
 * @memberof module:Profile
 * @param {Object} profile - The profile object containing bio data.
 * @example
 * ```javascript
 * const profile = { data: { bio: "This is the bio" } };
 * renderProfileBio(profile);
 * ```
 */
export async function renderProfileBio(profile) {
    const bioContainer = document.getElementById("profile-bio");
    const bio = document.createElement("p");
    bio.textContent = profile.bio;
    bioContainer.appendChild(bio);
}