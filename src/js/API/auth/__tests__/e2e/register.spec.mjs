import { test, expect } from "@playwright/test";

test.describe("Registration Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and storage before each test
    await page.context().clearCookies();
    page.on("console", (msg) => {
      console.log(`Browser console: ${msg.type()}: ${msg.text()}`);
    });
  });
  test("should register successfully with valid details", async ({ page }) => {
    await page.route("**/auth/register", (route) => {
      route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            id: "mockUserId",
            name: "Test User",
            email: "user@stud.noroff.no",
          },
        }),
      });
    });

    // Intercept the login request triggered after registration
    await page.route("**/auth/login", (route) => {
      console.log("Intercepted login request");
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

    // Navigate to the authorization page
    await page.goto("http://localhost:5000/authorization");

    // Click the "Sign Up" link to switch to the registration form
    const signUpLink = page.locator("#signUpLink");
    await signUpLink.click();

    // Fill in the registration form with valid details
    await page.fill("input#firstName", "Test User");
    await page.fill("input#signUpEmail", "user@stud.noroff.no");
    await page.fill("input#signUpPassword", "password123");
    await page.fill("input#confirmPassword", "password123");

    // Wait for the "Sign Up" button to be visible and enabled
    const signUpButton = page.locator("button#signUpButton");
    await expect(signUpButton).toBeVisible();
    await expect(signUpButton).toBeEnabled();

    // Click the "Sign Up" button
    await signUpButton.click();

    // Wait for navigation to the profile page
    await page.waitForTimeout(1000);
    await page.waitForLoadState("load", { timeout: 60000 });
    await page.waitForURL("http://localhost:5000/profile", { timeout: 60000 });

    // Assert that the user is redirected to the index page
    await expect(page).toHaveURL("http://localhost:5000/profile");

    // Assert that the Logout link is visible (user is logged in)
    const logoutLink = page.locator("a.nav-auth");
    await expect(logoutLink).toHaveText("Logout");
  });

  test("should show an error for mismatched passwords", async ({ page }) => {
    // Navigate to the authorization page
    await page.goto("http://localhost:5000/authorization");

    // Click the "Sign Up" link to switch to the registration form
    const signUpLink = page.locator("#signUpLink");
    await signUpLink.click();

    // Fill in the registration form with mismatched passwords
    await page.fill("input#firstName", "Test User");
    await page.fill("input#signUpEmail", "user@stud.noroff.no");
    await page.fill("input#signUpPassword", "password123");
    await page.fill("input#confirmPassword", "password456");

    // Click the "Sign Up" button
    await page.click("button#signUpButton");

    // Assert that the error message is displayed in the invalid-feedback for the password fields
    const passwordFeedback = page.locator(
      "input#signUpPassword ~ .invalid-feedback",
    );
    const confirmPasswordFeedback = page.locator(
      "input#confirmPassword ~ .invalid-feedback",
    );

    await expect(passwordFeedback).toHaveText(
      "Passwords do not match. Please try again.",
    );
    await expect(confirmPasswordFeedback).toHaveText(
      "Passwords do not match. Please try again.",
    );
  });

  test("should validate empty fields", async ({ page }) => {
    // Navigate to the authorization page
    await page.goto("http://localhost:5000/authorization");

    // Click the "Sign Up" link to switch to the registration form
    const signUpLink = page.locator("#signUpLink");
    await signUpLink.click();

    // Click the "Sign Up" button without filling in the form
    await page.click("button#signUpButton");

    // Assert that validation messages are displayed
    await expect(page.locator("input#firstName:invalid")).toBeVisible();
    await expect(page.locator("input#signUpEmail:invalid")).toBeVisible();
    await expect(page.locator("input#signUpPassword:invalid")).toBeVisible();
    await expect(page.locator("input#confirmPassword:invalid")).toBeVisible();
  });

  test("should show an error for invalid email domain during registration", async ({
    page,
  }) => {
    // Navigate to the authorization page
    await page.goto("http://localhost:5000/authorization", {
      waitUntil: "networkidle",
    });

    // Click the "Sign Up" link to switch to the registration form
    const signUpLink = page.locator("#signUpLink");
    await signUpLink.click();

    // Fill in the registration form with an invalid email domain
    await page.fill("input#firstName", "Test User");
    await page.fill("input#signUpEmail", "user@example.com");
    await page.fill("input#signUpPassword", "password123");
    await page.fill("input#confirmPassword", "password123");

    // Click the "Sign Up" button
    await page.click("button#signUpButton");

    // Assert that the error message is displayed
    await expect(page.locator(".alert")).toHaveText(
      "Sorry, only users with email ending @stud.noroff.no can register",
    );
  });
});
