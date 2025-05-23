export const ERROR_MESSAGES = {
  INVALID_EMAIL: "Invalid email address format.",
  INVALID_PASSWORD:
    "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  INVALID_CONFIRM_PASSWORD: "Passwords do not match. Please try again.",
  ACCOUNT_EXISTS:
    "An account with this email already exists. Please log in or use a different email.",
  INVALID_NAME:
    "Name must be at least 3 characters long and can only contain letters, numbers, and spaces.",
  INVALID_BIO: "Bio must be at least 10 characters long.",
  INVALID_CREDITS: "Credits must be a positive number.",
  INVALID_PROFILE_NAME:
    "Profile name must be at least 3 characters long and can only contain letters, numbers, and spaces.",
  INVALID_PROFILE_BANNER: "Profile banner URL is invalid.",
  INVALID_BID_AMOUNT:
    "Bid amount must be a positive number and greater than the current highest bid.",
  PROFILE_UPDATE_FAILED: "Failed to update profile. Please try again later.",
  ITEM_CREATION_FAILED:
    "Failed to create item. Please check your input and try again.",
  ITEM_UPDATE_FAILED:
    "Failed to update item. Please check your input and try again.",
  ITEM_DELETION_FAILED: "Failed to delete item. Please try again later.",
  LOADING_PAGE_ERROR:
    "An error occurred while loading the page, please try again later.",
  LOADING_PROFILE_ERROR: "We couldn't find the profile you were looking for.",
  LOADING_SEARCH_ERROR:
    "An error occurred while loading the search results, please try again later.",
  AUTHORIZATION_ERROR:
    "You are not authorized to perform this action. Please log in and try again.",
  LOGIN_FAILED: "Your email or password is incorrect. Please try again.",

  TOO_MANY_REQUESTS_ERROR: "Too many requests. Please try again later.",
};
