import { loadStorage } from "../../storage/loadstorage.mjs";
import { getProfile } from "../profiles/getprofile.mjs";

/**
 * Checks if the user is authenticated and redirects to the login page if not.
 * @returns {Promise<boolean>} A promise that resolves to true if the user is authenticated, false otherwise.
 * @example
 * ```javascript
 * checkAuth();
 * ```
 */
export async function checkAuth() {
    const accessToken = loadStorage("accessToken");
    document.addEventListener("DOMContentLoaded", async () => {
        const currentPath = window.location.pathname;
        const authPaths = ["/index.html", "/"]; // Add all paths that correspond to the authentication page

        if (authPaths.includes(currentPath) && accessToken) {
            const isValidToken = await validateAccessToken(accessToken);
            if (isValidToken) {
                window.location.href = "/profile/index.html";
                return true;
            } else {
                window.location.href = "/index.html";
                return false;
            }
        }

        if (authPaths.includes(currentPath)) {
            return true;
        }

        if (!accessToken) {
            window.location.href = "/index.html";
            return false;
        }
    });
}

/**
 * Validates the access token by trying to fetch the user's profile.
 * @param {string} token - The access token to validate.
 * @returns {Promise<boolean>} A promise that resolves to true if the token is valid, false otherwise.
 * @example
 * ```javascript
 * const isValid = await validateAccessToken("your-access-token");
 * console.log(isValid); // true or false
 * ```
 */
async function validateAccessToken() {
    try {
        const profile = await getProfile();
        return !!profile;
    } catch (error) {
        console.error("Error validating access token:", error);
        return false;
    }
}