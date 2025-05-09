import { test, expect } from "@playwright/test";

test.describe("Add Listing Modal - API Mocking", () => {
  test.beforeEach(async ({ page }) => {
    // Mock the login API response
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

    // Mock the user profile API response
    await page.route("**/auth/profile", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          name: "Test User",
          email: "user@stud.noroff.no",
          bio: "This is my bio.",
          avatar: {
            url: "https://example.com/avatar.jpg",
            alt: "User Avatar",
          },
          banner: {
            url: "https://example.com/banner.jpg",
            alt: "User Banner",
          },
          credits: 1000,
        }),
      });
    });

    // Mock the auction profile API response
    await page.route("**/auction/profiles/*", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          name: "Test User",
          email: "user@stud.noroff.no",
          bio: "This is my bio.",
          avatar: {
            url: "https://example.com/avatar.jpg",
            alt: "User Avatar",
          },
          banner: {
            url: "https://example.com/banner.jpg",
            alt: "User Banner",
          },
          credits: 1000,
          listings: [],
          _count: {
            listings: 0,
            wins: 0,
          },
        }),
      });
    });

    // Mock other protected resources if necessary
    await page.route("**/auction/listings?**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [],
          meta: {
            isFirstPage: true,
            isLastPage: true,
            currentPage: 1,
            previousPage: null,
            nextPage: null,
            pageCount: 0,
            totalCount: 0,
          },
        }),
      });
    });

    // Perform login
    await page.goto("http://localhost:5000/authorization");
    await page.fill("input#email", "user@stud.noroff.no");
    await page.fill("input#Password", "password123");
    await page.click("button#signInButton");

    // Wait for navigation to the listings page
    await page.waitForURL("http://localhost:5000/");
  });

  test("should open the modal and allow a user to create a new listing successfully", async ({
    page,
  }) => {
    // Mock the API response for creating a new listing
    await page.route("**/auction/listings", async (route) => {
      const mockedResponse = {
        id: "12345",
        title: "Vintage Clock",
        description: "A beautiful vintage clock from the 19th century.",
        tags: ["antique", "clock"],
        endsAt: "2025-12-31T23:59:00.000Z",
        media: [
          {
            url: "https://example.com/vintage-clock.jpg",
            alt: "Vintage Clock",
          },
        ],
        seller: {
          name: "Test User",
          email: "user@stud.noroff.no",
        },
        _count: {
          bids: 0,
        },
      };

      await route.fulfill({
        status: 201,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockedResponse),
      });
    });

    // Navigate to the page with the Add Listing button
    await page.goto("http://localhost:5000");

    // Click the Add Listing button to open the modal
    await page.click(".add-listing-button");

    // Wait for the modal to appear
    const modal = page.locator("#postItemModal");
    await expect(modal).toBeVisible();

    // Fill in the form fields
    await page.fill("#title", "Vintage Clock");
    await page.fill(
      "#description",
      "A beautiful vintage clock from the 19th century.",
    );
    await page.fill("#tags", "antique, clock");
    await page.fill("#endsAt", "2025-12-31T23:59");

    // Submit the form
    await page.locator("#postItemModal button[type='submit']").click();

    // Wait for the modal to close
    await expect(modal).not.toBeVisible();

    // Verify that the API was called
    const successMessage = page.locator(".alert-success-message");
    await expect(successMessage).toHaveText("Listing created successfully!");
  });
});
