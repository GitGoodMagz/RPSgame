const state = {
  users: [],
  selectedUsername: "",
  status: "idle",
  error: "",
  view: "create"
};

const listeners = new Set();

function snapshot() {
  return structuredClone(state);
}

function notify() {
  const s = snapshot();
  for (const fn of listeners) fn(s);
}

function subscribe(fn) {
  listeners.add(fn);
  fn(snapshot());
  return () => listeners.delete(fn);
}

async function apiRequest(url, options = {}) {
  const res = await fetch(url, options);
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const msg = isJson && data && typeof data === "object" ? (data.error || "request_failed") : "request_failed";
    throw new Error(msg);
  }
  return data;
}

function normalizeUser(user) {
  return {
    username: String(user.username ?? ""),
    createdAt: user.createdAt ?? null,
    tosAcceptedAt: user.tosAcceptedAt ?? null
  };
}

const UserService = {
  async listUsers() {
    const data = await apiRequest("/api/users");
    const raw = Array.isArray(data?.users) ? data.users : [];
    return raw.map(normalizeUser);
  },

  async createUser(username, password, tosAccepted) {
    const body = { username, password, tosAccepted: Boolean(tosAccepted) };
    const data = await apiRequest("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return normalizeUser(data?.user || {});
  },

  async editUser(username, newPassword) {
    const body = { password: newPassword || "" };
    const data = await apiRequest(`/api/users/${encodeURIComponent(username)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return normalizeUser(data?.user || {});
  },

  async deleteUser(username) {
    const data = await apiRequest(`/api/users/${encodeURIComponent(username)}`, { method: "DELETE" });
    return normalizeUser(data?.user || {});
  }
};

function setView(view) {
  state.view = view;
  state.error = "";
  notify();

  const createTab = document.querySelector('[data-nav="create"]');
  const manageTab = document.querySelector('[data-nav="manage"]');
  const createView = document.querySelector('[data-view="create"]');
  const manageView = document.querySelector('[data-view="manage"]');

  if (createTab && manageTab && createView && manageView) {
    createTab.classList.toggle("active", view === "create");
    manageTab.classList.toggle("active", view === "manage");
    createView.classList.toggle("hidden", view !== "create");
    manageView.classList.toggle("hidden", view !== "manage");
  }

  if (view === "manage") refreshUsers();
}

function syncNavAvailability(s) {
  const manageTab = document.querySelector('[data-nav="manage"]');
  if (!manageTab) return;
  manageTab.disabled = s.users.length === 0;
}

async function refreshUsers() {
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

async function bootstrapUsers() {
  try {
    state.users = await UserService.listUsers();
  } catch {}
  notify();
}

function getTemplate(id) {
  const tpl = document.getElementById(id);
  if (!tpl || !(tpl instanceof HTMLTemplateElement)) throw new Error(`Missing template: ${id}`);
  return tpl;
}

function getField(root, name) {
  const el = root.querySelector(`[data-field="${name}"]`);
  if (!el) throw new Error(`Missing field: ${name}`);
  return el;
}

function createElement(tag, className) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  return el;
}

function formatDateTime(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatMeta(user) {
  const parts = [];
  const created = formatDateTime(user.createdAt);
  if (created) parts.push(`Created: ${created}`);
  const tos = formatDateTime(user.tosAcceptedAt);
  if (tos) parts.push(`Terms accepted: ${tos}`);
  return parts.join(" • ");
}

function openLegalDialog(doc) {
  const dialog = document.getElementById("legalDialog");
  const frame = document.getElementById("legalFrame");
  const title = document.getElementById("legalTitle");
  if (!dialog || !frame || !title) return;

  if (doc === "privacy") {
    frame.src = "./dataPrivacyPolicy.html";
    title.textContent = "Privacy Policy";
  } else {
    frame.src = "./ToS.html";
    title.textContent = "Terms";
  }

  if (typeof dialog.showModal === "function") dialog.showModal();
}

function setupLegalDialogTabs() {
  const dialog = document.getElementById("legalDialog");
  if (!dialog) return;

  const tabButtons = Array.from(dialog.querySelectorAll('button[data-doc]'));
  for (const btn of tabButtons) {
    btn.addEventListener("click", () => {
      const doc = btn.getAttribute("data-doc") || "tos";
      openLegalDialog(doc);
    });
  }
}

class UserCreate extends HTMLElement {
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

class UserManage extends HTMLElement {
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
    this.goCreateButton.addEventListener("click", () => setView("create"));

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

      const ok = confirm(`Delete user "${username}"?`);
      if (!ok) return;

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
      else this.helpText.textContent = s.users.length ? "Select a user to edit or delete." : "";

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
      const item = createElement("div", user.username === s.selectedUsername ? "item active" : "item");

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

customElements.define("user-create", UserCreate);
customElements.define("user-manage", UserManage);

document.querySelector('[data-nav="create"]')?.addEventListener("click", () => setView("create"));
document.querySelector('[data-nav="manage"]')?.addEventListener("click", () => {
  if (state.users.length === 0) return;
  setView("manage");
});

setupLegalDialogTabs();

subscribe((s) => syncNavAvailability(s));
bootstrapUsers();
setView("create");
