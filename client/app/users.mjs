import { state, notify } from "./state.mjs";
import { UserService } from "./userService.mjs";

export function syncNavAvailability(s) {
  const manageTab = document.querySelector('[data-nav="manage"]');
  if (!manageTab) return;
  manageTab.disabled = s.users.length === 0;
}

export async function refreshUsers() {
  state.status = "loading";
  state.error = "";
  notify();

  try {
    const users = await UserService.listUsers();
    state.users = users;

    if (state.selectedUsername && !users.some(u => u.username === state.selectedUsername)) {
      state.selectedUsername = "";
    }

    state.status = "ready";
    notify();
  } catch (e) {
    state.status = "error";
    state.error = e?.message || "request_failed";
    notify();
  }
}

export async function bootstrapUsers() {
  try {
    state.users = await UserService.listUsers();
  } catch {}
  notify();
}
