import { describe, it, expect, vi } from "vitest";
import { validateBidInput } from "../../validatebidinput.mjs";
import { getItem } from "../../../../API/listings/getitem.mjs";

// Mock the getItem function
vi.mock("../../../../API/listings/getitem.mjs", () => ({
  getItem: vi.fn(),
}));

describe("validateBidInput", () => {
  it("should validate that the bid amount is a positive number", async () => {
    const form = document.createElement("form");
    const bidInput = document.createElement("input");
    bidInput.setAttribute("name", "bid-amount");
    bidInput.value = "-10"; // Invalid negative bid
    form.appendChild(bidInput);

    const feedbackElement = document.createElement("div");
    feedbackElement.classList.add("invalid-feedback");
    form.appendChild(feedbackElement);

    const isValid = await validateBidInput(form);

    expect(isValid).toBe(false);
    expect(feedbackElement.textContent).toBe(
      "You must enter a valid bid amount.",
    );
    expect(bidInput.classList.contains("is-invalid")).toBe(true);
  });

  it("should reject bids lower than the current highest bid", async () => {
    const form = document.createElement("form");
    const bidInput = document.createElement("input");
    bidInput.setAttribute("name", "bid-amount");
    bidInput.value = "50"; // Lower than the highest bid
    form.appendChild(bidInput);

    const feedbackElement = document.createElement("div");
    feedbackElement.classList.add("invalid-feedback");
    form.appendChild(feedbackElement);

    // Create a mock card element with the correct data-id
    const card = document.createElement("div");
    card.classList.add("card-auction-item");
    card.dataset.id = "123"; // Ensure the item ID is set
    card.appendChild(form); // Append the form to the card to simulate the DOM structure
    document.body.appendChild(card); // Append the card to the document body

    // Mock the getItem response
    getItem.mockResolvedValueOnce({
      bids: [{ amount: 100 }],
    });

    const isValid = await validateBidInput(form);

    expect(isValid).toBe(false);
    expect(feedbackElement.textContent).toBe(
      "Your bid must be higher than the current highest bid of 100 credits.",
    );
    expect(bidInput.classList.contains("is-invalid")).toBe(true);

    // Clean up the DOM
    document.body.removeChild(card);
  });

  it("should handle invalid or missing form inputs gracefully", async () => {
    const form = document.createElement("form");
    const feedbackElement = document.createElement("div");
    feedbackElement.classList.add("invalid-feedback");
    form.appendChild(feedbackElement);

    const isValid = await validateBidInput(form);

    expect(isValid).toBe(false);
    expect(feedbackElement.textContent).toBe("");
  });

  it("should handle missing item ID gracefully", async () => {
    const form = document.createElement("form");
    const bidInput = document.createElement("input");
    bidInput.setAttribute("name", "bid-amount");
    bidInput.value = "150"; // Valid bid
    form.appendChild(bidInput);

    const feedbackElement = document.createElement("div");
    feedbackElement.classList.add("invalid-feedback");
    form.appendChild(feedbackElement);

    const isValid = await validateBidInput(form);

    expect(isValid).toBe(false);
    expect(feedbackElement.textContent).toBe("Item ID is missing.");
    expect(bidInput.classList.contains("is-invalid")).toBe(true);
  });

  it("should validate a correct bid successfully", async () => {
    const form = document.createElement("form");
    const bidInput = document.createElement("input");
    bidInput.setAttribute("name", "bid-amount");
    bidInput.value = "150"; // Valid bid
    form.appendChild(bidInput);

    const feedbackElement = document.createElement("div");
    feedbackElement.classList.add("invalid-feedback");
    form.appendChild(feedbackElement);

    // Create a mock card element with the correct data-id
    const card = document.createElement("div");
    card.classList.add("card-auction-item");
    card.dataset.id = "123"; // Ensure the item ID matches the mock
    card.appendChild(form); // Append the form to the card to simulate the DOM structure
    document.body.appendChild(card); // Append the card to the document body

    // Mock the getItem response
    getItem.mockResolvedValueOnce({
      bids: [{ amount: 100 }], // Highest bid is 100
    });

    const isValid = await validateBidInput(form);

    expect(isValid).toBe(true); // The bid should be valid
    expect(feedbackElement.textContent).toBe(""); // No error message
    expect(bidInput.classList.contains("is-invalid")).toBe(false); // No invalid class

    // Clean up the DOM
    document.body.removeChild(card);
  });
});
