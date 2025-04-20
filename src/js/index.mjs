import "../scss/index.scss";
import * as bootstrap from "bootstrap";
import * as constants from "./constants.mjs";
import { getItems } from "./API/listings/getitems.mjs";
import { renderErrors } from "./ui/shared/rendererrors.mjs";
import { renderItems } from "./ui/listings/renderitems.mjs";
import { authSwitchTabs } from "./ui/bootstrap/authswitchtabs.mjs";

// Ensure bootstrap is globally available
window.bootstrap = bootstrap;

// Call authSwitchTabs to initialize the authentication tab switcher
authSwitchTabs();

// Render items in the listings view
renderItems();
