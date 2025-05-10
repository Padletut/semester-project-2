import { test, expect } from "@playwright/test";

test.describe("Login Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and storage before each test
    await page.context().clearCookies();
    page.on("console", (msg) => {});
  });
  test("should log in successfully with mocked credentials", async ({
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

    // Navigate to the login page
    await page.goto("http://localhost:5000/authorization");

    // Fill in the login form with mocked credentials
    await page.fill("input#email", "user@stud.noroff.no");
    await page.fill("input#Password", "password123");

    // Wait for the login button to be visible and enabled
    const signInButton = page.locator("button#signInButton");
    await expect(signInButton).toBeVisible();
    await expect(signInButton).toBeEnabled();

    // Click the login button
    await signInButton.click();

    // Wait for navigation to the listings page
    await page.waitForURL("http://localhost:5000/", { timeout: 10000 });

    // Assert that the user is redirected to the listings page
    await expect(page).toHaveURL("http://localhost:5000/");

    // Alternatively, assert that the Logout link has the correct class
    await expect(page.locator("a.nav-auth")).toHaveClass(/nav-logout/);
  });

  test("should show an error for invalid credentials", async ({ page }) => {
    // Navigate to the login page
    await page.goto("http://localhost:5000/authorization");

    // Fill in the login form with invalid credentials
    await page.fill("input#email", "invalid@stud.noroff.no");
    await page.fill("input#Password", "wrongpassword");

    // Click the login button
    await page.click("button#signInButton");

    // Assert that an error message is displayed
    await expect(page.locator(".toast")).toHaveText(
      "Your email or password is incorrect. Please try again.",
    );
  });

  test("should validate empty fields", async ({ page }) => {
    // Navigate to the login page
    await page.goto("http://localhost:5000/authorization");

    // Click the login button without filling in the form
    await page.click("button#signInButton");

    // Assert that validation messages are displayed
    await expect(page.locator("input#email:invalid")).toBeVisible();
    await expect(page.locator("input#Password:invalid")).toBeVisible();
  });

  test("should show an error for invalid email domain", async ({ page }) => {
    // Navigate to the login page
    await page.goto("http://localhost:5000/authorization");

    // Fill in the login form with an invalid email domain
    await page.fill("input#email", "user@example.com");
    await page.fill("input#Password", "password123");

    // Click the login button
    await page.click("button#signInButton");

    // Assert that the error message is displayed
    await expect(page.locator(".toast")).toHaveText(
      "Sorry, only users with email ending @stud.noroff.no can login",
    );
  });
});
