const messages = {
  en: {
    app: {
      title: "RPSgame"
    },
    shell: {
      createTab: "Create user",
      manageTab: "Manage users",
      createHeading: "Create user",
      manageHeading: "Manage users",
      navLabel: "Main navigation",
      terms: "Terms",
      privacy: "Privacy Policy",
      close: "Close",
      legalTitleTerms: "Terms",
      legalTitlePrivacy: "Privacy Policy"
    },
    create: {
      usernameLabel: "Username",
      usernamePlaceholder: "username",
      passwordLabel: "Password",
      passwordPlaceholder: "password",
      tosPrefix: "I accept",
      tosMiddle: "and acknowledge",
      checkboxLabel: "Accept terms",
      createButton: "Create user",
      created: "User created.",
      termsRequired: "Please accept Terms before creating a user."
    },
    manage: {
      refreshButton: "Refresh",
      helpText: "Select a user to edit or delete.",
      noUsers: "No users yet.",
      goCreateButton: "Go create a user",
      editHeading: "Edit",
      deleteHeading: "Delete",
      selected: "Selected",
      none: "none",
      newPasswordLabel: "New password",
      newPasswordPlaceholder: "new password (optional)",
      saveButton: "Save changes",
      deleteButton: "Delete selected user",
      userListLabel: "User list",
      metaCreated: "Created",
      metaTermsAccepted: "Terms accepted"
    },
    errors: {
      request_failed: "Request failed.",
      username_required: "Username is required.",
      password_required: "Password is required.",
      username_taken: "That username is already taken.",
      invalid_credentials: "Invalid username or password.",
      user_not_found: "User not found.",
      server_error: "Server error.",
      invalid_player_move: "Invalid player move.",
      missing_idempotency_key: "Missing Idempotency-Key header.",
      network_error: "Network error."
    },
    offline: {
      title: "Offline",
      text: "You are offline. Cached content is available, but network actions may fail."
    }
  },
  nb: {
    app: {
      title: "RPSgame"
    },
    shell: {
      createTab: "Opprett bruker",
      manageTab: "Administrer brukere",
      createHeading: "Opprett bruker",
      manageHeading: "Administrer brukere",
      navLabel: "Hovednavigasjon",
      terms: "Vilkår",
      privacy: "Personvernerklæring",
      close: "Lukk",
      legalTitleTerms: "Vilkår",
      legalTitlePrivacy: "Personvernerklæring"
    },
    create: {
      usernameLabel: "Brukernavn",
      usernamePlaceholder: "brukernavn",
      passwordLabel: "Passord",
      passwordPlaceholder: "passord",
      tosPrefix: "Jeg godtar",
      tosMiddle: "og bekrefter",
      checkboxLabel: "Godta vilkår",
      createButton: "Opprett bruker",
      created: "Bruker opprettet.",
      termsRequired: "Du må godta vilkårene før du kan opprette bruker."
    },
    manage: {
      refreshButton: "Oppdater",
      helpText: "Velg en bruker for å redigere eller slette.",
      noUsers: "Ingen brukere ennå.",
      goCreateButton: "Gå til opprett bruker",
      editHeading: "Rediger",
      deleteHeading: "Slett",
      selected: "Valgt",
      none: "ingen",
      newPasswordLabel: "Nytt passord",
      newPasswordPlaceholder: "nytt passord (valgfritt)",
      saveButton: "Lagre endringer",
      deleteButton: "Slett valgt bruker",
      userListLabel: "Brukerliste",
      metaCreated: "Opprettet",
      metaTermsAccepted: "Vilkår godtatt"
    },
    errors: {
      request_failed: "Forespørselen mislyktes.",
      username_required: "Brukernavn er påkrevd.",
      password_required: "Passord er påkrevd.",
      username_taken: "Brukernavnet er allerede tatt.",
      invalid_credentials: "Ugyldig brukernavn eller passord.",
      user_not_found: "Brukeren ble ikke funnet.",
      server_error: "Serverfeil.",
      invalid_player_move: "Ugyldig trekk.",
      missing_idempotency_key: "Mangler Idempotency-Key-header.",
      network_error: "Nettverksfeil."
    },
    offline: {
      title: "Frakoblet",
      text: "Du er frakoblet. Bufret innhold er tilgjengelig, men nettverkskall kan feile."
    }
  }
};

function getPathValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function getClientLanguage() {
  const languages = Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages
    : [navigator.language || "en"];

  const normalized = languages.map((v) => String(v || "").toLowerCase());

  if (normalized.some((v) => v.startsWith("nb") || v.startsWith("no"))) return "nb";
  return "en";
}

export function t(key) {
  const lang = getClientLanguage();
  return getPathValue(messages[lang], key) ?? getPathValue(messages.en, key) ?? key;
}

export function applyStaticTranslations() {
  document.documentElement.lang = getClientLanguage();
  document.title = t("app.title");

  for (const el of document.querySelectorAll("[data-i18n]")) {
    const key = el.getAttribute("data-i18n");
    if (key) el.textContent = t(key);
  }

  for (const el of document.querySelectorAll("[data-i18n-placeholder]")) {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key) el.setAttribute("placeholder", t(key));
  }

  for (const el of document.querySelectorAll("[data-i18n-aria-label]")) {
    const key = el.getAttribute("data-i18n-aria-label");
    if (key) el.setAttribute("aria-label", t(key));
  }
}

export function getErrorMessage(value) {
  const code = String(value || "request_failed");
  return getPathValue(messages[getClientLanguage()], `errors.${code}`)
    ?? getPathValue(messages.en, `errors.${code}`)
    ?? code;
}
