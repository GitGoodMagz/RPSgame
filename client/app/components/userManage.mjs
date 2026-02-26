import { state, notify, subscribe } from "../state.mjs";
import { UserService } from "../userService.mjs";
import { getTemplate, getField, createElement, formatMeta } from "../dom.mjs";
import { refreshUsers, syncNavAvailability } from "../users.mjs";

export class ManageUser extends HTMLElement {
  connectedCallback() {
    const fragment = getTemplate("manageTemplate").content.cloneNode(true);
    this.replaceChildren(fragment);

    this.refreshButton = getField(this, "refreshButton");
    this.helpText = getField(this, "helpText");

    this.emptyState = getField(this, "emptyState");
    this.goCreateButton = getField(this, "goCreateButton");

    this.contentState = getField(this, "contentState");
    this.userList = getField(this, "userList");

    this.editCard = getField(this, "editCard");
    this.deleteCard = getField(this, "deleteCard");

    this.selectedUserLabel = getField(this, "selectedUserLabel");
    this.newPasswordInput = getField(this, "newPasswordInput");
    this.saveButton = getField(this, "saveButton");

    this.selectedUserLabel2 = getField(this, "selectedUserLabel2");
    this.deleteButton = getField(this, "deleteButton");

    this.refreshButton.addEventListener("click", refreshUsers);
    this.goCreateButton.addEventListener(
      "click",
      () => (location.hash = "#/create"),
    );

    this.saveButton.addEventListener("click", async () => {
      const username = state.selectedUsername;
      if (!username) return;

      state.status = "loading";
      state.error = "";
      notify();

      try {
        await UserService.editUser(username, this.newPasswordInput.value);
        this.newPasswordInput.value = "";
        await refreshUsers();
      } catch (e) {
        state.status = "error";
        state.error = e?.message || "request_failed";
        notify();
      }
    });

    this.deleteButton.addEventListener("click", async () => {
      const username = state.selectedUsername;
      if (!username) return;

      state.status = "loading";
      state.error = "";
      notify();

      try {
        await UserService.deleteUser(username);
        await refreshUsers();
      } catch (e) {
        state.status = "error";
        state.error = e?.message || "request_failed";
        notify();
      }
    });

    this.unsubscribe = subscribe((s) => {
      syncNavAvailability(s);

      const loading = s.status === "loading";
      this.refreshButton.disabled = loading;

      if (s.status === "error") this.helpText.textContent = `Error: ${s.error}`;
      else
        this.helpText.textContent = s.users.length
          ? "Select a user to edit or delete."
          : "";

      const hasUsers = s.users.length > 0;
      this.emptyState.classList.toggle("hidden", hasUsers);
      this.contentState.classList.toggle("hidden", !hasUsers);

      if (!hasUsers) {
        state.selectedUsername = "";
        this.userList.replaceChildren();
        this.editCard.classList.add("hidden");
        this.deleteCard.classList.add("hidden");
        return;
      }

      this.renderUserList(s);

      const hasSelection = Boolean(s.selectedUsername);
      this.editCard.classList.toggle("hidden", !hasSelection);
      this.deleteCard.classList.toggle("hidden", !hasSelection);

      this.selectedUserLabel.textContent = `Selected: ${s.selectedUsername || "none"}`;
      this.selectedUserLabel2.textContent = `Selected: ${s.selectedUsername || "none"}`;

      this.saveButton.disabled = loading || !hasSelection;
      this.newPasswordInput.disabled = loading || !hasSelection;
      this.deleteButton.disabled = loading || !hasSelection;
    });
  }

  renderUserList(s) {
    const nodes = [];

    for (const user of s.users) {
      const item = createElement(
        "div",
        user.username === s.selectedUsername ? "item active" : "item",
      );

      const left = createElement("div");
      const strong = createElement("strong");
      strong.textContent = user.username;

      const meta = createElement("div", "meta");
      meta.textContent = formatMeta(user);

      left.append(strong, meta);
      item.append(left);

      item.addEventListener("click", () => {
        state.selectedUsername = user.username;
        notify();
      });

      nodes.push(item);
    }

    this.userList.replaceChildren(...nodes);
  }

  disconnectedCallback() {
    if (this.unsubscribe) this.unsubscribe();
  }
}
