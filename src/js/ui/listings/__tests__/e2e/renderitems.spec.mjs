import { test, expect } from "@playwright/test";

test.describe("Auction Items Rendering", () => {
  test("should render auction items correctly", async ({ page }) => {
    // Mock localStorage with a JSON string
    await page.addInitScript(() => {
      localStorage.setItem(
        "accessToken",
        JSON.stringify({ token: "mocked-access-token" }),
      );
    });

    // Debug API requests and responses
    page.on("request", (request) => {
      console.log("Request URL:", request.url());
      console.log("Request Headers:", request.headers());
    });

    page.on("response", async (response) => {
      if (response.url().includes("/auction/listings")) {
        console.log("Mocked API Response:", await response.json());
        console.log("Response Status:", response.status());
        console.log("Response Headers:", response.headers());
        console.log("Response Body:", await response.json());
      }
    });

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
            bids: [
              {
                id: "57076c1e-90bf-4a24-9931-e93583c000a9",
                amount: 2,
                bidder: {
                  name: "testtest12345",
                  email: "testtest12345@noroff.no",
                  bio: "HI... updated...",
                  avatar: {
                    url: "https://i.pinimg.com/736x/1a/77/27/1a7727bcb19c2b8c130ba1e2c11006ed.jpg",
                    alt: "",
                  },
                  banner: {
                    url: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGNhcnxlbnwwfHwwfHx8Mg%3D%3D",
                    alt: "",
                  },
                },
                created: "2025-05-08T20:58:19.110Z",
              },
              {
                id: "57076c1e-90bf-4a24-9931-e93583c000a9",
                amount: 3,
                bidder: {
                  name: "anotherBidder",
                  email: "anotherBidder@noroff.no",
                  bio: "Another bio...",
                  avatar: {
                    url: "https://example.com/avatar.jpg",
                    alt: "",
                  },
                  banner: {
                    url: "https://example.com/banner.jpg",
                    alt: "",
                  },
                },
                created: "2025-05-08T21:00:00.000Z",
              },
            ],
            _count: {
              bids: 2, // Update the bid count
            },
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
          {
            id: "628e157f-2b75-4ef8-97a5-6b14962d57f4",
            title: "Painting",
            description: "A stunning painting of a sunset.",
            media: [
              {
                url: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
                alt: "Updated image",
              },
            ],
            tags: [],
            created: "2025-05-08T15:28:05.749Z",
            updated: "2025-05-08T15:39:18.894Z",
            endsAt: "2025-05-15T00:00:00.000Z",
            bids: [],
            seller: {
              name: "andre_lier",
              email: "andlie02174@stud.noroff.no",
              bio: "This is his bio.",
              avatar: {
                url: "https://images.unsplash.com/photo-1601779436248-4c269c0a0793?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bGl2ZXJwb29sfGVufDB8fDB8fHwy",
                alt: "User avatar",
              },
              banner: {
                url: "https://images.unsplash.com/photo-1566328386401-b2980125f6c5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGxpdmVycG9vbHxlbnwwfHwwfHx8Mg%3D%3D",
                alt: "User banner",
              },
            },
            _count: {
              bids: 2,
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

    // Wait for the items container to load
    const itemsContainer = page.locator(".items-container");
    await itemsContainer.waitFor({ timeout: 60000 });

    // Assert that the first item is rendered correctly
    const firstItem = itemsContainer.locator(".card-auction-item").nth(0);
    await expect(firstItem.locator(".card-title")).toHaveText("Bowling Ball");
    await expect(firstItem.locator(".card-text")).toHaveText(
      "Cool bowling ball that will make you play good!",
    );
    await expect(firstItem.locator("img")).toHaveAttribute(
      "src",
      "https://cdn.schoolspecialty.com/09f586b2-1202-4518-a2a7-b0f1000a84c8/1284378_A_JPG%20Output.jpg?width=700&height=700&fit=bounds&canvas=700,700&bg-color=ffffff",
    );
    await expect(firstItem.locator(".card-display-bids")).toHaveText("2 bids");
    await expect(firstItem.locator(".card-display-ends")).toHaveText(
      "Ends May 09, 2025",
    );

    // Assert that the second item is rendered correctly
    const secondItem = itemsContainer.locator(".card-auction-item").nth(1);
    await expect(secondItem.locator(".card-title")).toHaveText("Painting");
    await expect(secondItem.locator(".card-text")).toHaveText(
      "A stunning painting of a sunset.",
    );
    await expect(secondItem.locator("img")).toHaveAttribute(
      "src",
      "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
    );
    await expect(secondItem.locator(".card-display-bids")).toHaveText("0 bids");
    await expect(secondItem.locator(".card-display-ends")).toHaveText(
      "Ends May 15, 2025",
    );
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
    await page.goto("http://localhost:5000");

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
