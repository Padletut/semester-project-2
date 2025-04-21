/**
 * Renders the profile credits in the element with id "profile-credits".
 * @memberof module:Profile
 * @param {Object} profile - The profile object containing credits data.
 * @example
 * ```javascript
 * const profile = { data: { credits: "This is the credits" } };
 * renderProfilecredits(profile);
 * ```
 */
export async function renderProfileCredits(profile) {
  const creditsContainer = document.getElementById("profile-credits");
  creditsContainer.innerHTML = `${profile.credits} Credits`;
}
