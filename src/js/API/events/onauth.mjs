import { login } from "../auth/login.mjs";
import { register } from "../auth/register.mjs";

/**
 * Handles the authentication process for login and registration forms.
 * @param {Event} event - The event object from the form submission.
 * @returns {Promise<void>} A promise that resolves when the authentication process is complete.
 * @example
 * ```javascript
 * document.querySelector("form").addEventListener("submit", onAuth);
 * ```
 */
export async function onAuth(event) {
  const form = event.target.closest("form");
  const name = form.firstName ? form.firstName.value : null;

  if (form.signInButton) {
    const email = form.email.value;
    const password = form.Password.value;
    await login(email, password);
  } else {
    const email = form.signUpEmail.value;
    const password = form.signUpPassword.value;
    await register(name, email, password);
    await login(email, password);
  }
}
