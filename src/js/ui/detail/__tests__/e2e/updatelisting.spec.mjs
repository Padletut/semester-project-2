import { test, expect } from "@playwright/test";

test.describe("Update Listing from Detail Page - API Mocking", () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and storage before each test
    await page.context().clearCookies();
    page.on("console", (msg) => {
      console.log(`Browser console: ${msg.type()}: ${msg.text()}`);
    });
    // Mock localStorage data
    await page.addInitScript(() => {
      localStorage.setItem("accessToken", JSON.stringify("mockAccessToken")); // Store as a JSON string
      localStorage.setItem("profile", JSON.stringify({ name: "User" })); // Mocked profile data
    });

    // Intercept the login request and mock the response
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

    // Mock the user profile API response
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
    await page.goto("http://localhost:5000/authorization", {
      waitUntil: "networkidle",
    });
    await page.fill("input#email", "user@stud.noroff.no");
    await page.fill("input#Password", "password123");
    await page.click("button#signInButton");

    // Wait for navigation to the listings page
    await page.waitForURL("http://localhost:5000/");
  });

  test("should allow a user to update a listing from the detail page", async ({
    page,
  }) => {
    // Mock the API response for fetching the listing details
    await page.route("**/auction/listings/**", async (route) => {
      const mockedResponse = {
        data: {
          id: "a0ed0109-0699-4097-b160-888e405250cb",
          title: "Bowling Ball",
          description: "Cool bowling ball that will make you play good!",
          media: [{ url: "https://example.com/image1.jpg", alt: "Image 1" }],
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

    // Navigate to the detail page for the listing
    await page.goto(
      "http://localhost:5000/detail?id=a0ed0109-0699-4097-b160-888e405250cb",
      { waitUntil: "domcontentloaded" },
    );

    // Verify that the detail page is loaded
    const detailTitle = page.locator(".card-title");
    await expect(detailTitle).toHaveText("Bowling Ball");

    // Click the Edit button to open the update modal
    await page.click('[name="edit-my-listing-item"]');

    // Wait for the update modal to appear
    const updateModal = page.locator("#postItemModal");
    await expect(updateModal).toBeVisible();

    // Fill in the updated form fields
    await page.fill("#title", "Updated Bowling Ball");
    await page.fill(
      "#description",
      "An updated description for the bowling ball.",
    );
    await page.fill("#tags", "bowling, ball, updated");

    // Add multiple media URLs
    await page.fill("input[name='mediaUrl']", "https://example.com/image1.jpg");
    await page.fill("input[name='mediaAlt']", "Updated Image 1");
    await page.click("#addMediaBtn"); // Add another media input
    const secondMediaUrl = page.locator("input[name='mediaUrl']").nth(1);
    const secondMediaAlt = page.locator("input[name='mediaAlt']").nth(1);
    await secondMediaUrl.fill("https://example.com/image2.jpg");
    await secondMediaAlt.fill("Updated Image 2");

    // Submit the form
    await page.locator("#postItemModal button[type='submit']").click();

    // Wait for the modal to close
    await expect(updateModal).not.toBeVisible();

    // Verify that the updated data is displayed on the detail page
    const updatedTitle = page.locator(".card-title");
    const updatedDescription = page.locator(".card-text");

    await expect(updatedTitle).toHaveText("Updated Bowling Ball");
    await expect(updatedDescription).toHaveText(
      "An updated description for the bowling ball.",
    );

    // Verify that the media URLs are updated
    const mediaImages = page.locator(".carousel-item img");
    await expect(mediaImages.nth(0)).toHaveAttribute(
      "src",
      "https://example.com/image1.jpg",
    );
    await expect(mediaImages.nth(1)).toHaveAttribute(
      "src",
      "https://example.com/image2.jpg",
    );
  });

  // Handle API errors during update
  // This test case simulates an API error during the update process
  test("should handle API errors during update", async ({ page }) => {
    // Mock the API response for fetching the listing details (GET request)
    await page.route(
      "**/auction/listings/a0ed0109-0699-4097-b160-888e405250cd*",
      async (route) => {
        const mockedResponse = {
          data: {
            id: "a0ed0109-0699-4097-b160-888e405250cd",
            title: "Bowling Ball",
            description: "Cool bowling ball that will make you play good!",
            media: [{ url: "https://example.com/image1.jpg", alt: "Image 1" }],
            tags: ["bowling", "ball", "sport"],
            created: "2025-05-08T16:57:50.984Z",
            updated: "2025-05-08T16:57:50.984Z",
            endsAt: "2028-05-09T16:57:00.000Z",
            bids: [],
            seller: {
              name: "User",
              email: "memespot@stud.noroff.no",
              bio: "This is my new bio.",
              avatar: {
                url: "https://example.com/avatar.jpg",
                alt: "User avatar",
              },
              banner: {
                url: "https://example.com/banner.jpg",
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
      },
    );

    // Navigate to the detail page for the listing
    await page.goto(
      "http://localhost:5000/detail?id=a0ed0109-0699-4097-b160-888e405250cd",
      { waitUntil: "networkidle" }, // Wait until there are no more network requests
    );

    // Mock the API response for updating the listing (PUT request)
    await page.route(
      "**/auction/listings/a0ed0109-0699-4097-b160-888e405250cd*",
      async (route) => {
        const mockedResponse = {
          message: "Failed to update the listing. Please try again later.",
        };
        await route.fulfill({
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(mockedResponse),
        });
      },
    );

    // Verify that the detail page is loaded
    const detailTitle = page.locator(".card-title");
    await expect(detailTitle).toHaveText("Bowling Ball");

    // Click the Edit button to open the update modal
    await page.click('[name="edit-my-listing-item"]');

    // Wait for the update modal to appear
    const updateModal = page.locator("#postItemModal");
    await expect(updateModal).toBeVisible();

    // Fill in the updated form fields
    await page.fill("#title", "Updated Bowling Ball");
    await page.fill(
      "#description",
      "An updated description for the bowling ball.",
    );
    await page.fill("#tags", "bowling, ball, updated");

    // Submit the form
    console.log("Submitting the form...");
    await page.locator("#postItemModal button[type='submit']").click();

    // Wait for an error message to be displayed
    console.log("Waiting for the toast...");
    const errorMessage = page.locator(".toast");
    await expect(errorMessage).toBeVisible({ timeout: 10000 });
    await expect(errorMessage).toHaveText(
      "Failed to update the listing. Please try again later.",
    );
    console.log("Toast verified successfully.");

    // Verify that the modal is still open (indicating an error occurred)
    await expect(updateModal).toBeVisible();
  });
});
