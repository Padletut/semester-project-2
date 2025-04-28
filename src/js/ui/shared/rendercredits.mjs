import { getProfile } from "../../API/profile/getprofile.mjs";

/**
 * Renders the credits in header of the page.
 */

export async function renderCredits() {
  const creditsContainer = document.querySelector(".display-credits");
  if (!creditsContainer) {
    console.error("Credits container not found");
    return;
  }

  creditsContainer.innerHTML = ""; // Clear existing credits

  try {
    const profile = await getProfile();
    const credits = profile.data.credits;
    creditsContainer.innerHTML = `<i>${credits} Cr</i>`;
  } catch (error) {
    console.error("Error fetching profile:", error);
  }
}
