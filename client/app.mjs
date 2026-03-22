import { subscribe, state } from "./app/state.mjs";
import { loadStoredSession } from "./app/auth.mjs";
import { bootstrapSession, syncNavAvailability } from "./app/users.mjs";
import { setupLegalDialogTabs } from "./app/legalDialog.mjs";
import { wireNavigation, bootstrapView, setView } from "./app/nav.mjs";
import { applyStaticTranslations } from "./app/i18n.mjs";
import { CreateUser } from "./app/components/userCreate.mjs";
import { ManageUser } from "./app/components/userManage.mjs";

function syncHeader(currentState) {
  const shellPanel = document.getElementById("shellPanel");
  const shellUser = document.getElementById("shellUser");
  const accountManageButton = document.getElementById("accountManageButton");

  if (!shellPanel || !shellUser || !accountManageButton) return;

  const loggedIn = Boolean(currentState.currentUser);
  const showManageButton = loggedIn && Boolean(currentState.gameMode);

  shellPanel.classList.toggle("hidden", !loggedIn);
  shellUser.textContent = loggedIn ? currentState.currentUser.username : "";
  accountManageButton.classList.toggle("hidden", !showManageButton);
}

function isLocalhost() {
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

async function setupServiceWorker() {
  if (!("serviceWorker" in navigator)) return;

  if (isLocalhost()) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
    return;
  }

  await navigator.serviceWorker.register("./sw.js");
}

applyStaticTranslations();

customElements.define("user-create", CreateUser);
customElements.define("user-manage", ManageUser);

setupLegalDialogTabs();
wireNavigation();

const accountManageButton = document.getElementById("accountManageButton");
if (accountManageButton) {
  accountManageButton.addEventListener("click", () => {
    state.gameMode = false;
    setView("manage");
  });
}

subscribe((currentState) => {
  syncNavAvailability(currentState);
  syncHeader(currentState);
});

const storedSession = loadStoredSession();
state.authToken = storedSession.token;
state.currentUser = storedSession.user;

await bootstrapSession();
bootstrapView();

window.addEventListener("load", () => {
  setupServiceWorker().catch(() => {});
});
