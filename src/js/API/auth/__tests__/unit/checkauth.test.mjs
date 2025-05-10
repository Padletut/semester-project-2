import { describe, it, expect, beforeEach, vi } from "vitest";
import { checkAuth } from "../../checkauth.mjs";
import { loadStorage } from "../../../../storage/loadstorage.mjs";

// Mock the loadStorage function
vi.mock("../../../../storage/loadstorage.mjs", () => ({
  loadStorage: vi.fn(),
}));

describe("checkAuth", () => {
  let navAuth, navProfile;

  beforeEach(() => {
    // Set up a mock DOM
    document.body.innerHTML = `
      <nav>
        <a class="nav-link nav-auth">Login</a>
        <a class="nav-link nav-profile">Profile</a>
      </nav>
    `;

    navAuth = document.querySelector(".nav-auth");
    navProfile = document.querySelector(".nav-profile");

    // Reset mocks
    vi.clearAllMocks();
  });

  it("should replace the nav-auth item with a 'Logout' link if the user is authenticated", () => {
    // Mock loadStorage to return an access token
    loadStorage.mockReturnValue("mockAccessToken");

    checkAuth();

    const logoutLink = document.querySelector(".nav-logout");
    expect(logoutLink).toBeTruthy();
    expect(logoutLink.textContent).toBe("Logout");
    expect(logoutLink.href).toContain("authorization");
  });

  it("should hide the nav-profile item if the user is not authenticated", () => {
    // Mock loadStorage to return null (no access token)
    loadStorage.mockReturnValue(null);

    checkAuth();

    expect(navProfile.style.display).toBe("none");
  });

  it("should not modify the DOM if nav-auth is not present", () => {
    // Remove nav-auth from the DOM
    navAuth.remove();

    // Mock loadStorage to return an access token
    loadStorage.mockReturnValue("mockAccessToken");

    checkAuth();

    const logoutLink = document.querySelector(".nav-logout");
    expect(logoutLink).toBeNull();
  });
});
