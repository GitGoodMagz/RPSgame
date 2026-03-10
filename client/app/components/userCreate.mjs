import { state, notify, subscribe } from "../state.mjs";
import { saveSession } from "../auth.mjs";
import { UserService } from "../userService.mjs";
import { getTemplate, getField } from "../dom.mjs";
import { openLegalDialog } from "../legalDialog.mjs";
import { refreshUsers, syncNavAvailability } from "../users.mjs";
import { setView } from "../nav.mjs";
import { t } from "../i18n.mjs";

export class CreateUser extends HTMLElement {
  connectedCallback() {
    const fragment = getTemplate("createUserTemplate").content.cloneNode(true);
    this.replaceChildren(fragment);

    this.modePicker = getField(this, "modePicker");
    this.showRegisterButton = getField(this, "showRegisterButton");
    this.showLoginButton = getField(this, "showLoginButton");

    this.registerSection = getField(this, "registerSection");
    this.loginSection = getField(this, "loginSection");

    this.registerBackButton = getField(this, "registerBackButton");
    this.loginBackButton = getField(this, "loginBackButton");

    this.registerUsernameLabel = getField(this, "registerUsernameLabel");
    this.registerUsernameInput = getField(this, "registerUsernameInput");
    this.registerPasswordLabel = getField(this, "registerPasswordLabel");
    this.registerPasswordInput = getField(this, "registerPasswordInput");
    this.termsCheckbox = getField(this, "termsCheckbox");
    this.registerButton = getField(this, "registerButton");
    this.registerHint = getField(this, "registerHint");

    this.loginUsernameLabel = getField(this, "loginUsernameLabel");
    this.loginUsernameInput = getField(this, "loginUsernameInput");
    this.loginPasswordLabel = getField(this, "loginPasswordLabel");
    this.loginPasswordInput = getField(this, "loginPasswordInput");
    this.loginButton = getField(this, "loginButton");
    this.loginHint = getField(this, "loginHint");

    this.registerHeading = getField(this, "registerHeading");
    this.loginHeading = getField(this, "loginHeading");

    this.tosPrefix = getField(this, "tosPrefix");
    this.openTerms = getField(this, "openTerms");
    this.tosMiddle = getField(this, "tosMiddle");
    this.openPrivacy = getField(this, "openPrivacy");

    this.currentMode = "";

    this.applyTranslations();
    this.bindEvents();
    this.renderMode();

    this.unsubscribe = subscribe((currentState) => {
      syncNavAvailability(currentState);

      const loading = currentState.status === "loading";
      this.registerUsernameInput.disabled = loading;
      this.registerPasswordInput.disabled = loading;
      this.termsCheckbox.disabled = loading;
      this.registerButton.disabled = loading;
      this.loginUsernameInput.disabled = loading;
      this.loginPasswordInput.disabled = loading;
      this.loginButton.disabled = loading;
      this.openTerms.disabled = loading;
      this.openPrivacy.disabled = loading;
      this.showRegisterButton.disabled = loading;
      this.showLoginButton.disabled = loading;
      this.registerBackButton.disabled = loading;
      this.loginBackButton.disabled = loading;

      if (currentState.status === "error") {
        if (this.currentMode === "register") this.registerHint.textContent = currentState.error;
        if (this.currentMode === "login") this.loginHint.textContent = currentState.error;
      }

      if (!currentState.currentUser && currentState.status === "idle") {
        this.registerHint.textContent = t("auth.registerHint");
        this.loginHint.textContent = t("auth.loginHint");
      }
    });
  }

  disconnectedCallback() {
    if (this.unsubscribe) this.unsubscribe();
  }

  applyTranslations() {
    this.showRegisterButton.textContent = t("auth.registerButton");
    this.showLoginButton.textContent = t("auth.loginButton");
    this.registerBackButton.textContent = "Back";
    this.loginBackButton.textContent = "Back";

    this.registerHeading.textContent = t("auth.registerHeading");
    this.loginHeading.textContent = t("auth.loginHeading");

    this.registerUsernameLabel.textContent = t("auth.usernameLabel");
    this.registerUsernameInput.placeholder = t("auth.usernamePlaceholder");
    this.registerPasswordLabel.textContent = t("auth.passwordLabel");
    this.registerPasswordInput.placeholder = t("auth.passwordPlaceholder");
    this.loginUsernameLabel.textContent = t("auth.usernameLabel");
    this.loginUsernameInput.placeholder = t("auth.usernamePlaceholder");
    this.loginPasswordLabel.textContent = t("auth.passwordLabel");
    this.loginPasswordInput.placeholder = t("auth.passwordPlaceholder");

    this.tosPrefix.textContent = t("auth.tosPrefix");
    this.openTerms.textContent = t("shell.terms");
    this.tosMiddle.textContent = t("auth.tosMiddle");
    this.openPrivacy.textContent = t("shell.privacy");
    this.termsCheckbox.setAttribute("aria-label", t("auth.checkboxLabel"));

    this.registerButton.textContent = t("auth.registerButton");
    this.loginButton.textContent = t("auth.loginButton");
    this.registerHint.textContent = t("auth.registerHint");
    this.loginHint.textContent = t("auth.loginHint");
  }

  bindEvents() {
    this.showRegisterButton.addEventListener("click", () => {
      this.currentMode = "register";
      this.registerHint.textContent = t("auth.registerHint");
      this.renderMode();
    });

    this.showLoginButton.addEventListener("click", () => {
      this.currentMode = "login";
      this.loginHint.textContent = t("auth.loginHint");
      this.renderMode();
    });

    this.registerBackButton.addEventListener("click", () => {
      this.currentMode = "";
      this.renderMode();
    });

    this.loginBackButton.addEventListener("click", () => {
      this.currentMode = "";
      this.renderMode();
    });

    this.openTerms.addEventListener("click", () => openLegalDialog("tos"));
    this.openPrivacy.addEventListener("click", () => openLegalDialog("privacy"));

    this.registerButton.addEventListener("click", async () => {
      const username = this.registerUsernameInput.value.trim();
      const password = this.registerPasswordInput.value;
      const accepted = this.termsCheckbox.checked;

      state.status = "loading";
      state.error = "";
      notify();

      try {
        const auth = await UserService.registerUser(username, password, accepted);
        saveSession(auth.token, auth.user);
        state.authToken = auth.token;
        state.currentUser = auth.user;
        state.selectedUsername = auth.user.username;
        state.gameMode = !auth.user.isAdmin;
        state.latestPlay = null;
        state.playStats = null;
        this.registerUsernameInput.value = "";
        this.registerPasswordInput.value = "";
        this.termsCheckbox.checked = false;
        this.registerHint.textContent = t("auth.created");
        await refreshUsers();
        setView("manage");
      } catch (error) {
        state.status = "error";
        state.error = error?.message || t("errors.request_failed");
        notify();
      }
    });

    this.loginButton.addEventListener("click", async () => {
      const username = this.loginUsernameInput.value.trim();
      const password = this.loginPasswordInput.value;

      state.status = "loading";
      state.error = "";
      notify();

      try {
        const auth = await UserService.loginUser(username, password);
        saveSession(auth.token, auth.user);
        state.authToken = auth.token;
        state.currentUser = auth.user;
        state.selectedUsername = auth.user.username;
        state.gameMode = !auth.user.isAdmin;
        state.latestPlay = null;
        state.playStats = null;
        this.loginUsernameInput.value = "";
        this.loginPasswordInput.value = "";
        this.loginHint.textContent = t("auth.loggedIn");
        await refreshUsers();
        setView("manage");
      } catch (error) {
        state.status = "error";
        state.error = error?.message || t("errors.request_failed");
        notify();
      }
    });
  }

  renderMode() {
    const showPicker = !this.currentMode;
    const showRegister = this.currentMode === "register";
    const showLogin = this.currentMode === "login";

    this.modePicker.classList.toggle("hidden", !showPicker);
    this.registerSection.classList.toggle("hidden", !showRegister);
    this.loginSection.classList.toggle("hidden", !showLogin);
  }
}
