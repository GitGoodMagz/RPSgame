import { state, notify } from "./state.mjs";
import { refreshUsers } from "./users.mjs";

const viewIds = ["create", "manage"];

function getViewFromHash() {
  const raw = (location.hash || "").replace(/^#\/?/, "");
  if (viewIds.includes(raw)) return raw;
  return "create";
}

function applyView(view) {
  const createTab = document.querySelector('[data-nav="create"]');
  const manageTab = document.querySelector('[data-nav="manage"]');
  const createView = document.querySelector('[data-view="create"]');
  const manageView = document.querySelector('[data-view="manage"]');

  if (createTab) createTab.classList.toggle("active", view === "create");
  if (manageTab) manageTab.classList.toggle("active", view === "manage");
  if (createView) createView.classList.toggle("hidden", view !== "create");
  if (manageView) manageView.classList.toggle("hidden", view !== "manage");
}

export function setView(view) {
  const nextView = viewIds.includes(view) ? view : "create";
  if (nextView === "manage" && state.users.length === 0) return;

  state.view = nextView;
  state.error = "";
  notify();

  const nextHash = `#/${nextView}`;
  if (location.hash !== nextHash) location.hash = nextHash;

  applyView(nextView);

  if (nextView === "manage") refreshUsers();
}

export function wireNavigation() {
  const createTab = document.querySelector('[data-nav="create"]');
  const manageTab = document.querySelector('[data-nav="manage"]');

  if (createTab) createTab.addEventListener("click", () => setView("create"));
  if (manageTab) manageTab.addEventListener("click", () => setView("manage"));

  window.addEventListener("hashchange", () => {
    const view = getViewFromHash();
    setView(view);
  });
}

export function bootstrapView() {
  const view = getViewFromHash();
  state.view = view;
  notify();
  applyView(view);
  if (view === "manage") refreshUsers();
}
