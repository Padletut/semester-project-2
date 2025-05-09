import { test, expect } from "@playwright/test";

test.describe("Delete Item", () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and storage before each test
    await page.context().clearCookies();

    // Mock localStorage data
    await page.addInitScript(() => {
      localStorage.setItem("accessToken", JSON.stringify("mockAccessToken"));
      localStorage.setItem("profile", JSON.stringify({ name: "User" }));
    });

    // Mock the login API response
    await page.route("**/auth/login", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: {
            accessToken: "mockAccessToken",
            profile: { name: "User", email: "user@stud.noroff.no" },
          },
        }),
      });
    });

    // Mock the profile API response
    await page.route("**/auction/profiles/*", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          name: "User",
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

    // Perform login
    await page.goto("http://localhost:5000/authorization");
    await page.fill("input#email", "user@stud.noroff.no");
    await page.fill("input#Password", "password123");
    await page.click("button#signInButton");

    // Wait for navigation to the listings page
    await page.waitForURL("http://localhost:5000/");

    // Mock the API response for fetching the listing details
    await page.route("**/auction/listings/**", async (route) => {
      const mockedResponse = {
        data: {
          id: "a0ed0109-0699-4097-b160-888e405250cb",
          title: "Test Item",
          description: "Cool bowling ball that will make you play good!",
          media: [[Object]],
          tags: ["bowling", "ball", "sport"],
          created: "2025-05-08T16:57:50.984Z",
          updated: "2025-05-08T16:57:50.984Z",
          endsAt: "2028-05-09T16:57:00.000Z",
          bids: [],
          seller: {
            name: "User",
            email: "memespot@stud.noroff.no",
            bio: "This is my new bio. I am from Norway, studying Front End Development at Noroff. Currently doing my Semester Project 2 assignment! Its going so well!",
            avatar: {
              url: "https://i.pinimg.com/736x/c0/4b/01/c04b017b6b9d1c189e15e6559aeb3ca8.jpg",
              alt: "User avatar",
            },
            banner: {
              url: "https://media.istockphoto.com/id/1410766826/photo/full-frame-of-green-leaves-pattern-background.webp?b=1&s=612x612&w=0&k=20&c=LGngoLNpLG2gl_0uUNIKfNpVMzr61qBew8oRvVUMnCQ=",
              alt: "User banner",
            },
          },
          _count: { bids: 0 },
        },
        meta: {},
      };
      await route.fulfill({
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockedResponse),
      });
    });

    // Navigate to the detail page for the item
    await page.goto("http://localhost:5000/detail?id=12345");
  });

  test("should allow a user to delete an item", async ({ page }) => {
    // Wait for the detail page to load
    await page.waitForSelector(".card-title"); // Adjusted selector for the item's title

    // Verify that the detail page is loaded
    const detailTitle = page.locator(".card-title"); // Adjusted selector
    await expect(detailTitle).toHaveText("Test Item");

    // Click the Edit button to open the update modal
    await page.click('[name="edit-my-listing-item"]');

    // Click the Delete button to open the confirmation modal
    await page.click("#deleteItemBtn");

    // Wait for the confirmation modal to appear
    const confirmationModal = page.locator("#deleteConfirmationModal");
    await expect(confirmationModal).toBeVisible();

    // Confirm the deletion
    await page.click("#confirmDeleteBtn");

    // Wait for the modal to close
    await expect(confirmationModal).not.toBeVisible();

    // Verify that a success message is displayed (if applicable)
    const successMessage = page.locator(".toast");
    await expect(successMessage).toHaveText("Listing deleted successfully!");

    // Verify that the user is redirected to the homepage
    await page.waitForTimeout(5500);
    await expect(page).toHaveURL("http://localhost:5000/");
  });

  test("should handle API errors during deletion", async ({ page }) => {
    // Mock the API response for deletion
    await page.route("**/auction/listings/**", async (route) => {
      const mockedResponse = {
        error: {
          message: "Failed to delete the item.",
          status: 500,
        },
      };
      await route.fulfill({
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockedResponse),
      });
    });

    // Click the Edit button to open the update modal
    await page.click('[name="edit-my-listing-item"]');

    // Click the Delete button to open the confirmation modal
    await page.click("#deleteItemBtn");

    // Wait for the confirmation modal to appear
    const confirmationModal = page.locator("#deleteConfirmationModal");
    await expect(confirmationModal).toBeVisible();

    // Confirm the deletion
    await page.click("#confirmDeleteBtn");

    // Wait for the error message to be displayed
    const errorMessage = page.locator(".toast");
    await expect(errorMessage).toHaveText(
      "Failed to delete item. Please try again later.",
    );

    // Verify that the user is still on the detail page
    const detailTitle = page.locator(".card-title"); // Adjusted selector
    await expect(detailTitle).toHaveText("Test Item");
  });
});
