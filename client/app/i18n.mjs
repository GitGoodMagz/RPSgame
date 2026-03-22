const messages = {
  en: {
    app: {
      title: "ROCK - PAPER - SCISSOR"
    },
    shell: {
      createHeading: "Log in or create account",
      manageHeading: "Account",
      navLabel: "Main navigation",
      terms: "Terms",
      privacy: "Privacy Policy",
      close: "Close",
      legalTitleTerms: "Terms",
      legalTitlePrivacy: "Privacy Policy"
    },
    auth: {
      registerHeading: "Create account",
      loginHeading: "Log in",
      usernameLabel: "Username",
      usernamePlaceholder: "username",
      passwordLabel: "Password",
      passwordPlaceholder: "password",
      tosPrefix: "I accept",
      tosMiddle: "and acknowledge",
      checkboxLabel: "Accept terms",
      registerButton: "Create account",
      loginButton: "Log in",
      created: "Account created.",
      loggedIn: "Logged in.",
      registerHint: "Create a new account to start playing.",
      loginHint: "Log in with an existing account."
    },
    manage: {
      logoutButton: "Log out",
      playButton: "Play",
      exitGameButton: "Manage account",
      adminText: "Admin",
      noUsers: "No users available.",
      goCreateButton: "Go to log in",
      editHeading: "Change password",
      deleteHeading: "Delete account",
      selected: "Selected",
      none: "none",
      newPasswordLabel: "New password",
      newPasswordPlaceholder: "new password",
      saveButton: "Save changes",
      deleteButton: "Delete selected user",
      userListLabel: "User list",
      metaCreated: "Created",
      metaAccepted: "Terms and Privacy accepted"
    },
    play: {
      heading: "ROCK - PAPER - SCISSOR",
      moveHeading: "Choose your move",
      latestHeading: "Last round",
      statsHeading: "Stats",
      played: "Played",
      wins: "Wins",
      losses: "Losses",
      draws: "Draws",
      playerMove: "You",
      serverMove: "Bot",
      result: "Result",
      rock: "Rock",
      paper: "Paper",
      scissors: "Scissors",
      emptyLatest: "No round played yet.",
      emptyStats: "No stats yet.",
      win: "Win",
      loss: "Loss",
      draw: "Draw"
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
      network_error: "Network error.",
      unauthorized: "You must log in first.",
      forbidden: "You are not allowed to do that.",
      terms_required: "You must accept the terms first.",
      admin_protected: "The built-in admin account cannot be changed or deleted."
    },
    offline: {
      title: "Offline",
      text: "You are offline. Cached content is available, but network actions may fail."
    }
  },
  nb: {
    app: {
      title: "ROCK - PAPER - SCISSOR"
    },
    shell: {
      createHeading: "Logg inn eller opprett konto",
      manageHeading: "Konto",
      navLabel: "Hovednavigasjon",
      terms: "Vilkår",
      privacy: "Personvernerklæring",
      close: "Lukk",
      legalTitleTerms: "Vilkår",
      legalTitlePrivacy: "Personvernerklæring"
    },
    auth: {
      registerHeading: "Opprett konto",
      loginHeading: "Logg inn",
      usernameLabel: "Brukernavn",
      usernamePlaceholder: "brukernavn",
      passwordLabel: "Passord",
      passwordPlaceholder: "passord",
      tosPrefix: "Jeg godtar",
      tosMiddle: "og bekrefter",
      checkboxLabel: "Godta vilkår",
      registerButton: "Opprett konto",
      loginButton: "Logg inn",
      created: "Konto opprettet.",
      loggedIn: "Logget inn.",
      registerHint: "Opprett en ny konto for å starte.",
      loginHint: "Logg inn med en eksisterende konto."
    },
    manage: {
      logoutButton: "Logg ut",
      playButton: "Spill",
      exitGameButton: "Administrer konto",
      adminText: "Admin",
      noUsers: "Ingen brukere tilgjengelig.",
      goCreateButton: "Gå til logg inn",
      editHeading: "Endre passord",
      deleteHeading: "Slett konto",
      selected: "Valgt",
      none: "ingen",
      newPasswordLabel: "Nytt passord",
      newPasswordPlaceholder: "nytt passord",
      saveButton: "Lagre endringer",
      deleteButton: "Slett valgt bruker",
      userListLabel: "Brukerliste",
      metaCreated: "Opprettet",
      metaAccepted: "Vilkår og personvern godtatt"
    },
    play: {
      heading: "ROCK - PAPER - SCISSOR",
      moveHeading: "Choose your move",
      latestHeading: "Last round",
      statsHeading: "Stats",
      played: "Spilt",
      wins: "Seire",
      losses: "Tap",
      draws: "Uavgjort",
      playerMove: "Du",
      serverMove: "Bot",
      result: "Resultat",
      rock: "Rock",
      paper: "Paper",
      scissors: "Scissors",
      emptyLatest: "Ingen runde spilt ennå.",
      emptyStats: "Ingen statistikk ennå.",
      win: "Seier",
      loss: "Tap",
      draw: "Uavgjort"
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
      network_error: "Nettverksfeil.",
      unauthorized: "Du må logge inn først.",
      forbidden: "Du har ikke tilgang til dette.",
      terms_required: "Du må godta vilkårene først.",
      admin_protected: "Den innebygde admin-kontoen kan ikke endres eller slettes."
    },
    offline: {
      title: "Frakoblet",
      text: "Du er frakoblet. Bufret innhold er tilgjengelig, men nettverkskall kan feile."
    }
  }
};

function getPathValue(object, path) {
  return path.split(".").reduce((accumulator, key) => accumulator?.[key], object);
}

export function getClientLanguage() {
  const languages = Array.isArray(navigator.languages) && navigator.languages.length
    ? navigator.languages
    : [navigator.language || "en"];

  const normalized = languages.map((value) => String(value || "").toLowerCase());

  if (normalized.some((value) => value.startsWith("nb") || value.startsWith("no"))) return "nb";
  return "en";
}

export function t(key) {
  const language = getClientLanguage();
  return getPathValue(messages[language], key) ?? getPathValue(messages.en, key) ?? key;
}

export function applyStaticTranslations() {
  document.documentElement.lang = getClientLanguage();
  document.title = t("app.title");

  for (const element of document.querySelectorAll("[data-i18n]")) {
    const key = element.getAttribute("data-i18n");
    if (key) element.textContent = t(key);
  }

  for (const element of document.querySelectorAll("[data-i18n-placeholder]")) {
    const key = element.getAttribute("data-i18n-placeholder");
    if (key) element.setAttribute("placeholder", t(key));
  }

  for (const element of document.querySelectorAll("[data-i18n-aria-label]")) {
    const key = element.getAttribute("data-i18n-aria-label");
    if (key) element.setAttribute("aria-label", t(key));
  }
}

export function getErrorMessage(value) {
  const code = String(value || "request_failed");
  return getPathValue(messages[getClientLanguage()], `errors.${code}`)
    ?? getPathValue(messages.en, `errors.${code}`)
    ?? code;
}
