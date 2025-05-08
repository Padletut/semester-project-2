import { login } from "../auth/login.mjs";
import { register } from "../auth/register.mjs";

/**
 * Handles the authentication process for login and registration forms.
 * @memberof module:API/events
 * @param {Event} event - The event object from the form submission.
 * @returns {Promise<void>} A promise that resolves when the authentication process is complete.
 * @example
 * ```javascript
 * document.querySelector("form").addEventListener("submit", onAuth);
 * ```
 */
export async function onAuth(event, redirectUrl) {
  const form = event.target.closest("form");
  const name = form.firstName ? form.firstName.value : null;

  if (form.signInButton) {
    const email = form.email.value;
    const password = form.Password.value;
    await login(email, password, redirectUrl);
  } else {
    const email = form.signUpEmail.value;
    const password = form.signUpPassword.value;
    const confirmPassword = form.confirmPassword.value;

    try {
      const isRegistered = await register(
        name,
        email,
        password,
        confirmPassword,
      );
      if (isRegistered) {
        await login(email, password, redirectUrl);
      }
    } catch (error) {
      // Display the error message to the user
      const errorContainer = form.querySelector(".alert-message");
      if (errorContainer) {
        errorContainer.textContent = error.message;
        errorContainer.classList.remove("d-none");
      }
      console.error("Error during registration:", error);
    }
  }
}
