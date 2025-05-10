import { test, expect } from "@playwright/test";

test.describe("Logout Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and storage before each test
    await page.context().clearCookies();
    page.on("console", (msg) => {
      console.log(`Browser console: ${msg.type()}: ${msg.text()}`);
    });
  });

  test("should log out successfully and redirect to the listings page", async ({
    page,
  }) => {
    // Intercept the login request and mock the response
    await page.route("**/auth/login", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            accessToken: "mockAccessToken",
            profile: { name: "Test User", email: "user@stud.noroff.no" },
          },
        }),
      });
    });

    // Navigate to the login page and log in
    await page.goto("http://localhost:5000/authorization");
    await page.fill("input#email", "user@stud.noroff.no");
    await page.fill("input#Password", "password123");
    const signInButton = page.locator("button#signInButton");
    await signInButton.click();

    // Wait for navigation to the listings page
    await page.waitForURL("http://localhost:5000/", { timeout: 10000 });

    // Check if the hamburger menu is visible (mobile view)
    const hamburgerMenuButton = page.locator("button.navbar-toggler");
    if (await hamburgerMenuButton.isVisible()) {
      // Simulate opening the hamburger menu
      await hamburgerMenuButton.click();
    }

    // Assert that the Logout link is visible
    const logoutLink = page.locator("a.nav-auth");
    await expect(logoutLink).toHaveText("Logout");

    // Click the Logout link
    await logoutLink.click();

    // Wait for the page to redirect to the listings page
    await page.waitForURL("http://localhost:5000/");

    // Assert that the user is redirected to the listings page
    await expect(page).toHaveURL("http://localhost:5000/");

    // Assert that the Login link is now visible (user is logged out)
    const loginLink = page.locator("a.nav-auth");
    await expect(loginLink).toHaveText("Login");
  });
});
