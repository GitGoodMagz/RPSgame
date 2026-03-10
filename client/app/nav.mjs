import { state, notify } from "./state.mjs";
import { refreshUsers } from "./users.mjs";

const viewIds = ["create", "manage"];

function getViewFromHash() {
  const raw = (location.hash || "").replace(/^#\/?/, "");
  if (viewIds.includes(raw)) return raw;
  return "create";
}

function applyView(view) {
  const createView = document.querySelector('[data-view="create"]');
  const manageView = document.querySelector('[data-view="manage"]');
  const shellUser = document.getElementById("shellUser");

  if (shellUser) {
    shellUser.textContent = state.currentUser ? state.currentUser.username : "";
    shellUser.classList.toggle("hidden", !state.currentUser);
  }

  if (createView) {
    createView.classList.toggle("hidden", view !== "create");
    createView.setAttribute("aria-hidden", String(view !== "create"));
  }

  if (manageView) {
    manageView.classList.toggle("hidden", view !== "manage");
    manageView.setAttribute("aria-hidden", String(view !== "manage"));
  }
}

export function setView(view) {
  const nextView = viewIds.includes(view) ? view : "create";
  const allowedView = nextView === "manage" && !state.currentUser ? "create" : nextView;

  state.view = allowedView;
  state.error = "";
  notify();

  const nextHash = `#/${allowedView}`;
  if (location.hash !== nextHash) location.hash = nextHash;

  applyView(allowedView);

  if (allowedView === "manage") {
    refreshUsers();
  }
}

export function wireNavigation() {
  window.addEventListener("hashchange", () => {
    setView(getViewFromHash());
  });
}

export function bootstrapView() {
  setView(state.currentUser ? "manage" : getViewFromHash());
}
