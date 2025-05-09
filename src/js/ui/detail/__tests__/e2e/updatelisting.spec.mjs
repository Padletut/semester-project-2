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
    await page.goto("http://localhost:5000/authorization");
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
          media: [[Object]],
          tags: ["bowling", "ball", "sport"],
          created: "2025-05-08T16:57:50.984Z",
          updated: "2025-05-08T16:57:50.984Z",
          endsAt: "2025-05-09T16:57:00.000Z",
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

    // Console log mocked response and data
    page.on("response", async (response) => {
      if (response.url().includes("auction/listings")) {
        const responseBody = await response.json();
        console.log("Mocked Response Body:", responseBody);
      }
    });
    // Navigate to the detail page for the listing
    await page.goto(
      "http://localhost:5000/detail?id=a0ed0109-0699-4097-b160-888e405250cb",
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
  });
});
