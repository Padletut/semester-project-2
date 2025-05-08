import { test, expect } from "@playwright/test";

test.describe("Profile Page", () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies and storage before each test
    await page.context().clearCookies();
    page.on("console", (msg) => {
      console.log(`Browser console: ${msg.type()}: ${msg.text()}`);
    });
    // Mock localStorage data
    await page.addInitScript(() => {
      localStorage.setItem(
        "profile",
        JSON.stringify({ name: "User" }), // Mocked profile data
      );
    });
  });

  // Test 1: Leave this untouched
  test("should load the profile page with the user's information", async ({
    page,
  }) => {
    // Mock the Profile API response
    await page.route("**/auction/profiles/*", async (route) => {
      const mockedProfileData = {
        data: {
          name: "User",
          email: "user@stud.noroff.no",
          bio: "This is my bio.",
          avatar: {
            url: "https://url.com/avatar.jpg",
            alt: "Profile avatar",
          },
          banner: {
            url: "https://url.com/banner.jpg",
            alt: "Profile banner",
          },
          credits: 843,
          listings: [
            {
              id: 1,
              title: "Listing 1",
              description: "Description of Listing 1",
              created: "2025-05-01T12:00:00Z",
              endsAt: "2025-05-10T12:00:00Z",
              bids: [],
            },
          ],
          _count: {
            listings: 1,
            wins: 0,
          },
        },
        meta: {},
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockedProfileData),
      });
    });

    // Navigate to the profile page
    await page.goto("http://localhost:5000/profile?profile=user");

    // Wait for the profile container to load
    await page.waitForSelector("#profile-id", { timeout: 60000 });

    // Assert that the profile information is displayed correctly
    await expect(page.locator("#profile-id h2")).toHaveText("User");
    await expect(page.locator("#profile-id small")).toHaveText(
      "user@stud.noroff.no",
    );
    await expect(page.locator("#profile-credits")).toHaveText("843 Cr");
    await expect(page.locator("#profile-bio")).toHaveText("This is my bio.");
  });

  // Test 2: Display correct bids
  test("should display the correct bids in the profile", async ({ page }) => {
    // Mock the Profile API response
    await page.route("**/auction/profiles/*", async (route) => {
      const mockedProfileData = {
        data: {
          name: "User",
          email: "user@stud.noroff.no",
          bio: "This is my bio.",
          avatar: {
            url: "https://url.com/avatar.jpg",
            alt: "Profile avatar",
          },
          banner: {
            url: "https://url.com/banner.jpg",
            alt: "Profile banner",
          },
          credits: 843,
          listings: [
            {
              id: 1,
              title: "Listing 1",
              description: "Description of Listing 1",
              created: "2025-05-01T12:00:00Z",
              endsAt: "2025-05-10T12:00:00Z",
              bids: [],
            },
          ],
          _count: {
            listings: 1,
            wins: 0,
          },
        },
        meta: {},
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockedProfileData),
      });
    });

    // Mock the Bids API response
    await page.route("**/auction/profiles/**/bids*", async (route) => {
      const mockedBidsData = {
        data: [
          {
            id: "1",
            amount: 100,
            listing: {
              id: "101",
              title: "Auction Item 1",
              endsAt: "2025-05-10T00:00:00Z",
            },
          },
          {
            id: "2",
            amount: 200,
            listing: {
              id: "102",
              title: "Auction Item 2",
              endsAt: "2025-05-15T00:00:00Z",
            },
          },
        ],
        meta: {
          isFirstPage: true,
          isLastPage: true,
          currentPage: 1,
          previousPage: null,
          nextPage: null,
          pageCount: 1,
          totalCount: 2,
        },
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockedBidsData),
      });
    });

    // Navigate to the profile page
    await page.goto("http://localhost:5000/profile?profile=user");

    // Wait for the profile container to load
    await page.waitForSelector("#profile-id", { timeout: 60000 });

    // Assert that the profile information is displayed correctly
    await expect(page.locator("#profile-id h2")).toHaveText("User");

    // Wait for the bids to be rendered
    await page.waitForSelector("#my-bids-container li", { timeout: 60000 });

    // Assert that the bids are displayed correctly
    const bidsContainer = page.locator("#my-bids-container");
    await expect(bidsContainer.locator("li")).toHaveCount(3);

    // Assert details of the first bid
    const firstBid = bidsContainer.locator("li").nth(1);
    await expect(firstBid).toHaveText(
      "Auction Item 1 May 10, 2025 100 Credits",
    );

    // Assert details of the second bid
    const secondBid = bidsContainer.locator("li").nth(2);
    await expect(secondBid).toHaveText(
      "Auction Item 2 May 15, 2025 200 Credits",
    );
  });
  // Test 3: Handle no bids gracefully
  test("should handle no bids gracefully", async ({ page }) => {
    // Mock the Profile API response
    await page.route("**/auction/profiles/*", async (route) => {
      const mockedProfileData = {
        data: {
          name: "User",
          email: "user@stud.noroff.no",
          bio: "This is my bio.",
          avatar: {
            url: "https://url.com/avatar.jpg",
            alt: "Profile avatar",
          },
          banner: {
            url: "https://url.com/banner.jpg",
            alt: "Profile banner",
          },
          credits: 843,
          listings: [],
          _count: {
            listings: 0,
            wins: 0,
          },
        },
        meta: {},
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockedProfileData),
      });
    });

    // Mock the Bids API response with no bids
    await page.route("**/auction/profiles/user/bids*", async (route) => {
      const mockedBidsData = {
        data: [],
        meta: {
          isFirstPage: true,
          isLastPage: true,
          currentPage: 1,
          previousPage: null,
          nextPage: null,
          pageCount: 1,
          totalCount: 0,
        },
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockedBidsData),
      });
    });

    // Navigate to the profile page
    await page.goto("http://localhost:5000/profile?profile=user");

    // Wait for the profile container to load
    await page.waitForSelector("#profile-id", { timeout: 60000 });

    // Assert that the profile information is displayed correctly
    await expect(page.locator("#profile-id h2")).toHaveText("User");

    // Wait for the bids container to load
    await page.waitForSelector("#my-bids-container", { timeout: 60000 });

    // Assert that the "No bids found" message is displayed
    const bidsContainer = page.locator("#my-bids-container");
    await expect(bidsContainer).toHaveText("No bids found.");
  });
  // Test 4: Handle error when user is not logged in
  test("should handle error when user is not logged in", async ({ page }) => {
    // Clear localStorage to simulate a logged-out user
    await page.addInitScript(() => {
      localStorage.clear();
    });

    // Mock the Profile API response to return an unauthorized error
    await page.route("**/auction/profiles/*", async (route) => {
      await route.fulfill({
        status: 401, // Unauthorized
        contentType: "application/json",
        body: JSON.stringify({
          message:
            "You are not authorized to perform this action. Please log in and try again.",
        }),
      });
    });

    // Navigate to the profile page without a valid profile query parameter
    await page.goto("http://localhost:5000/profile");

    // Wait for the alert message to appear
    const errorMessage = page.locator(".alert-message");
    await errorMessage.waitFor({ timeout: 60000 }); // Wait for the alert to appear
    await expect(errorMessage).toHaveText(
      "You are not authorized to perform this action. Please log in and try again.",
    );

    // Assert redirection to the main page
    await page.waitForTimeout(1000);
    await expect(page).toHaveURL("http://localhost:5000/"), { timeout: 60000 };
  });
  // Test 5: Update profile after editing
  test("should update the profile page with new data after editing the profile", async ({
    page,
  }) => {
    // Mock the initial Profile API response
    await page.route("**/auction/profiles/*", async (route) => {
      console.log("Intercepted profile API request");
      const mockedProfileData = {
        data: {
          name: "User",
          email: "user@stud.noroff.no",
          bio: "This is my bio.",
          avatar: {
            url: "https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_1280.jpg",
            alt: "Profile avatar",
          },
          banner: {
            url: "https://cdn.pixabay.com/photo/2025/01/18/14/05/architecture-9342358_1280.jpg",
            alt: "Profile banner",
          },
          credits: 843,
        },
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(mockedProfileData),
      });
    });

    // Navigate to the profile page
    await page.goto("http://localhost:5000/profile?profile=user");

    // Wait for the profile container to load
    await page.waitForSelector("#profile-id", { timeout: 60000 });

    // Assert that the initial profile information is displayed
    await expect(page.locator("#profile-id h2")).toHaveText("User");
    await expect(page.locator("#profile-bio")).toHaveText("This is my bio.");
    await page.waitForSelector(".profile-avatar-image", { timeout: 60000 });
    await expect(page.locator(".profile-avatar-image")).toHaveAttribute(
      "src",
      "https://cdn.pixabay.com/photo/2016/11/21/12/42/beard-1845166_1280.jpg",
    );
    await page.waitForSelector(".profile-banner-image", { timeout: 60000 });
    await expect(page.locator(".profile-banner-image")).toHaveAttribute(
      "src",
      "https://cdn.pixabay.com/photo/2025/01/18/14/05/architecture-9342358_1280.jpg",
    );

    // Mock the updated Profile API response
    await page.route("**/auction/profiles/*", async (route) => {
      console.log("Intercepted profile API request for update");
      const updatedProfileData = {
        data: {
          name: "Updated User",
          email: "updateduser@stud.noroff.no",
          bio: "Updated bio.",
          avatar: {
            url: "https://cdn.pixabay.com/photo/2023/01/01/12/34/new-avatar.jpg", // Updated URL
            alt: "Avatar for profile Updated User",
          },
          banner: {
            url: "https://cdn.pixabay.com/photo/2023/01/01/12/34/new-banner.jpg", // Updated URL
            alt: "Banner for profile Updated User",
          },
          credits: 843,
        },
      };

      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(updatedProfileData),
      });
    });

    // Simulate clicking the "Edit Profile" button
    const editProfileButton = page.locator("button[name='edit-profile']");
    await page.waitForSelector("button[name='edit-profile']", {
      timeout: 60000,
    });
    await editProfileButton.click();

    // Wait for the modal to appear
    await page
      .locator("#editProfileModal")
      .waitFor({ state: "visible", timeout: 60000 });

    // Fill in the new profile data in the modal
    await page.fill("#bio", "Updated bio.");
    await page.fill(
      "#avatarUrl",
      "https://cdn.pixabay.com/photo/2023/01/01/12/34/new-avatar.jpg",
    );
    await page.fill(
      "#coverUrl",
      "https://cdn.pixabay.com/photo/2023/01/01/12/34/new-banner.jpg",
    );

    // Submit the form
    const saveButton = page.locator("button[type='submit']");
    await saveButton.click();

    // Wait for the profile container to reload
    await page.waitForTimeout(1000); // Wait for 1 second
    await page.waitForSelector("#profile-id", { timeout: 60000 });

    // Assert that the updated profile information is displayed
    await expect(page.locator("#profile-bio")).toHaveText("Updated bio.");
    await page.waitForSelector(".profile-avatar-image", { timeout: 60000 });
    await expect(page.locator(".profile-avatar-image")).toHaveAttribute(
      "src",
      "https://cdn.pixabay.com/photo/2023/01/01/12/34/new-avatar.jpg",
    );
    await page.waitForSelector(".profile-banner-image", { timeout: 60000 });
    await expect(page.locator(".profile-banner-image")).toHaveAttribute(
      "src",
      "https://cdn.pixabay.com/photo/2023/01/01/12/34/new-banner.jpg",
    );
  });
});
