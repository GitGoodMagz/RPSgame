import { state, notify, subscribe } from "../state.mjs";
import { UserService } from "../userService.mjs";
import { getTemplate, getField } from "../dom.mjs";
import { openLegalDialog } from "../legalDialog.mjs";
import { refreshUsers, syncNavAvailability } from "../users.mjs";
import { t } from "../i18n.mjs";

export class CreateUser extends HTMLElement {
  connectedCallback() {
    const fragment = getTemplate("createUserTemplate").content.cloneNode(true);
    this.replaceChildren(fragment);

    const usernameLabel = getField(this, "usernameLabel");
    const usernameInput = getField(this, "usernameInput");
    const passwordLabel = getField(this, "passwordLabel");
    const passwordInput = getField(this, "passwordInput");
    const termsCheckbox = getField(this, "termsCheckbox");
    const createButton = getField(this, "createButton");
    const createHint = getField(this, "createHint");

    const tosPrefix = getField(this, "tosPrefix");
    const openTerms = getField(this, "openTerms");
    const tosMiddle = getField(this, "tosMiddle");
    const openPrivacy = getField(this, "openPrivacy");

    usernameLabel.textContent = t("create.usernameLabel");
    usernameInput.placeholder = t("create.usernamePlaceholder");
    passwordLabel.textContent = t("create.passwordLabel");
    passwordInput.placeholder = t("create.passwordPlaceholder");
    tosPrefix.textContent = t("create.tosPrefix");
    openTerms.textContent = t("shell.terms");
    tosMiddle.textContent = t("create.tosMiddle");
    openPrivacy.textContent = t("shell.privacy");
    termsCheckbox.setAttribute("aria-label", t("create.checkboxLabel"));
    createButton.textContent = t("create.createButton");
    createHint.setAttribute("aria-live", "polite");

    openTerms.addEventListener("click", () => openLegalDialog("tos"));
    openPrivacy.addEventListener("click", () => openLegalDialog("privacy"));

    createButton.addEventListener("click", async () => {
      const username = usernameInput.value.trim();
      const password = passwordInput.value;
      const accepted = termsCheckbox.checked;

      if (!username || !password) return;

      if (!accepted) {
        createHint.textContent = t("create.termsRequired");
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
        createHint.textContent = t("create.created");
      } catch (e) {
        state.status = "error";
        state.error = e?.message || t("errors.request_failed");
        notify();
        createHint.textContent = state.error;
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
      if (s.status === "error") createHint.textContent = s.error;
    });
  }

  disconnectedCallback() {
    if (this.unsubscribe) this.unsubscribe();
  }
}
