import { state, notify } from "./state.mjs";
import { clearSession, saveSession } from "./auth.mjs";
import { UserService } from "./userService.mjs";

export function syncNavAvailability(currentState) {
  const manageTab = document.querySelector('[data-nav="manage"]');
  if (!manageTab) return;
  manageTab.disabled = !currentState.currentUser;
}

export async function refreshUsers() {
  if (!state.currentUser) {
    state.users = [];
    state.selectedUsername = "";
    state.gameMode = false;
    state.latestPlay = null;
    state.playStats = null;
    notify();
    return;
  }

  state.status = "loading";
  state.error = "";
  notify();

  try {
    const users = await UserService.listUsers();
    state.users = users;

    if (state.currentUser.isAdmin) {
      if (!users.length) {
        state.selectedUsername = "";
      } else if (!state.selectedUsername || !users.some((user) => user.username === state.selectedUsername)) {
        state.selectedUsername = users[0].username;
      }
    } else {
      state.selectedUsername = state.currentUser.username;
    }

    state.status = "ready";
    notify();
  } catch (error) {
    state.status = "error";
    state.error = error?.message || "request_failed";
    notify();
  }
}

export async function bootstrapSession() {
  if (!state.authToken) {
    notify();
    return;
  }

  state.status = "loading";
  state.error = "";
  notify();

  try {
    const user = await UserService.me();
    state.currentUser = user;
    saveSession(state.authToken, user);
    await refreshUsers();
    if (!user.isAdmin) {
      state.gameMode = true;
      notify();
    }
  } catch {
    clearSession();
    state.authToken = "";
    state.currentUser = null;
    state.users = [];
    state.selectedUsername = "";
    state.status = "idle";
    state.error = "";
    state.gameMode = false;
    state.latestPlay = null;
    state.playStats = null;
    notify();
  }
}

export function clearAppSession() {
  clearSession();
  state.authToken = "";
  state.currentUser = null;
  state.users = [];
  state.selectedUsername = "";
  state.status = "idle";
  state.error = "";
  state.gameMode = false;
  state.latestPlay = null;
  state.playStats = null;
  notify();
}
