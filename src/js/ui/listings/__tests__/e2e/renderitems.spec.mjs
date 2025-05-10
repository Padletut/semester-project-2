import { test, expect } from "@playwright/test";

test.describe("Auction Items Rendering", () => {
  test("should render auction items correctly", async ({ page }) => {
    // Mock the API response for auction items
    await page.route("**/auction/listings?**", async (route) => {
      const mockedResponse = {
        data: [
          {
            id: "a0ed0109-0699-4097-b160-888e405250cb",
            title: "Bowling Ball",
            description: "Cool bowling ball that will make you play good!",
            media: [
              {
                url: "https://cdn.schoolspecialty.com/09f586b2-1202-4518-a2a7-b0f1000a84c8/1284378_A_JPG%20Output.jpg?width=700&height=700&fit=bounds&canvas=700,700&bg-color=ffffff",
                alt: "Bowling ball",
              },
            ],
            tags: ["bowling ball sport"],
            created: "2025-05-08T16:57:50.984Z",
            updated: "2025-05-08T16:57:50.984Z",
            endsAt: "2025-05-09T16:57:00.000Z",
            bids: [],
            seller: {
              name: "SteinA",
              email: "memespot@stud.noroff.no",
            },
          },
        ],
        meta: {
          nextPage: null,
          isLastPage: true,
        },
      };

      await route.fulfill({
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockedResponse),
      });
    });

    // Navigate to the auction items page
    await page.goto("http://localhost:5000");

    // Debugging: Log visibility of the items container
    const containerStyles = await page
      .locator(".items-container")
      .evaluate((el) => {
        return {
          display: getComputedStyle(el).display,
          visibility: getComputedStyle(el).visibility,
        };
      });
    console.log("Items container styles:", containerStyles);

    // Scroll to the items container to ensure it is in the viewport
    await page.locator(".items-container").scrollIntoViewIfNeeded();

    // Force a reflow to ensure the DOM is updated
    await page.locator(".items-container").evaluate((el) => el.offsetHeight);

    // Debugging: Log the number of child elements in the items container
    const childCount = await page
      .locator(".items-container")
      .evaluate((el) => el.children.length);
    console.log("Number of child elements in items container:", childCount);

    // Wait for at least one .card-auction-item to be rendered
    await page.waitForSelector(".card-auction-item", { timeout: 60000 });

    // Assert that the first item is rendered correctly
    const firstItem = page.locator(".card-auction-item").nth(0);
    await expect(firstItem.locator(".card-title")).toHaveText("Bowling Ball");
  });
  test("should not fetch or render items if isLastPage is true", async ({
    page,
  }) => {
    // Mock the API response with isLastPage = true
    await page.route("**/auction/listings?**", async (route) => {
      const mockedResponse = {
        data: [
          {
            id: "a0ed0109-0699-4097-b160-888e405250cb",
            title: "Bowling Ball",
            description: "Cool bowling ball that will make you play good!",
            media: [
              {
                url: "https://cdn.schoolspecialty.com/09f586b2-1202-4518-a2a7-b0f1000a84c8/1284378_A_JPG%20Output.jpg?width=700&height=700&fit=bounds&canvas=700,700&bg-color=ffffff",
                alt: "Bowling ball",
              },
            ],
            tags: ["bowling ball sport"],
            created: "2025-05-08T16:57:50.984Z",
            updated: "2025-05-08T16:57:50.984Z",
            endsAt: "2025-05-09T16:57:00.000Z",
            bids: [],
            seller: {
              name: "SteinA",
              email: "memespot@stud.noroff.no",
              bio: "This is my new bio. I am from Norway, studying Front End Development at Noroff.",
              avatar: {
                url: "https://i.pinimg.com/736x/c0/4b/01/c04b017b6b9d1c189e15e6559aeb3ca8.jpg",
                alt: "User avatar",
              },
              banner: {
                url: "https://media.istockphoto.com/id/1410766826/photo/full-frame-of-green-leaves-pattern-background.webp?b=1&s=612x612&w=0&k=20&c=LGngoLNpLG2gl_0uUNIKfNpVMzr61qBew8oRvVUMnCQ=",
                alt: "User banner",
              },
            },
          },
        ],
        meta: {
          isFirstPage: true,
          isLastPage: true, // Set isLastPage to true
          currentPage: 1,
          previousPage: null,
          nextPage: null,
          pageCount: 1,
          totalCount: 1,
        },
      };
      await route.fulfill({
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockedResponse),
      });
    });

    // Navigate to the auction items page
    await page.goto("http://localhost:5000/");

    // Wait for the items container to load
    const itemsContainer = page.locator(".items-container");
    await itemsContainer.waitFor({ timeout: 60000 });

    // Assert that the first item is rendered correctly
    const firstItem = itemsContainer.locator(".card-auction-item").nth(0);
    await expect(firstItem.locator(".card-title")).toHaveText("Bowling Ball");

    // Scroll to the sentinel to trigger lazy loading
    const sentinel = page.locator("#sentinel");
    await sentinel.scrollIntoViewIfNeeded();

    // Wait for a short time to ensure no additional requests are made
    await page.waitForTimeout(2000);

    // Assert that no additional items are rendered
    const itemsCount = await itemsContainer
      .locator(".card-auction-item")
      .count();
    expect(itemsCount).toBe(1); // Only the first item should be rendered
  });
});
