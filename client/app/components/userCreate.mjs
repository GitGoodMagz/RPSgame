import { state, notify, subscribe } from "../state.mjs";
import { UserService } from "../userService.mjs";
import { getTemplate, getField } from "../dom.mjs";
import { openLegalDialog } from "../legalDialog.mjs";
import { refreshUsers, syncNavAvailability } from "../users.mjs";

export class CreateUser extends HTMLElement {
  connectedCallback() {
    const fragment = getTemplate("createUserTemplate").content.cloneNode(true);
    this.replaceChildren(fragment);

    const usernameInput = getField(this, "usernameInput");
    const passwordInput = getField(this, "passwordInput");
    const termsCheckbox = getField(this, "termsCheckbox");
    const createButton = getField(this, "createButton");
    const createHint = getField(this, "createHint");

    const openTerms = getField(this, "openTerms");
    const openPrivacy = getField(this, "openPrivacy");

    openTerms.addEventListener("click", () => openLegalDialog("tos"));
    openPrivacy.addEventListener("click", () => openLegalDialog("privacy"));

    createButton.addEventListener("click", async () => {
      const username = usernameInput.value.trim();
      const password = passwordInput.value;
      const accepted = termsCheckbox.checked;

      if (!username || !password) return;

      if (!accepted) {
        createHint.textContent = "Please accept Terms before creating a user.";
        return;
      }

      state.status = "loading";
      state.error = "";
      notify();

      try {
        await UserService.createUser(username, password, accepted);
        await refreshUsers();
        usernameInput.value = "";
        passwordInput.value = "";
        termsCheckbox.checked = false;
        createHint.textContent = "User created.";
      } catch (e) {
        state.status = "error";
        state.error = e?.message || "request_failed";
        notify();
        createHint.textContent = `Error: ${state.error}`;
      }
    });

    this.unsubscribe = subscribe((s) => {
      syncNavAvailability(s);
      const loading = s.status === "loading";
      createButton.disabled = loading;
      usernameInput.disabled = loading;
      passwordInput.disabled = loading;
      termsCheckbox.disabled = loading;
      openTerms.disabled = loading;
      openPrivacy.disabled = loading;
      if (s.status === "error") createHint.textContent = `Error: ${s.error}`;
    });
  }

  disconnectedCallback() {
    if (this.unsubscribe) this.unsubscribe();
  }
}
