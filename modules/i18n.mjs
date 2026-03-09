const messages = {
  en: {
    errors: {
      request_failed: "Request failed.",
      username_required: "Username is required.",
      password_required: "Password is required.",
      username_taken: "That username is already taken.",
      invalid_credentials: "Invalid username or password.",
      user_not_found: "User not found.",
      server_error: "Server error.",
      invalid_player_move: "Invalid player move.",
      missing_idempotency_key: "Missing Idempotency-Key header."
    }
  },
  nb: {
    errors: {
      request_failed: "Forespørselen mislyktes.",
      username_required: "Brukernavn er påkrevd.",
      password_required: "Passord er påkrevd.",
      username_taken: "Brukernavnet er allerede tatt.",
      invalid_credentials: "Ugyldig brukernavn eller passord.",
      user_not_found: "Brukeren ble ikke funnet.",
      server_error: "Serverfeil.",
      invalid_player_move: "Ugyldig trekk.",
      missing_idempotency_key: "Mangler Idempotency-Key-header."
    }
  }
};

function getPathValue(obj, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
}

export function getRequestLanguage(req) {
  const preferred = req.acceptsLanguages?.("nb", "no", "en");
  if (preferred === "nb" || preferred === "no") return "nb";
  return "en";
}

export function serverText(req, key) {
  const lang = getRequestLanguage(req);
  return getPathValue(messages[lang], key) ?? getPathValue(messages.en, key) ?? key;
}

export function serverError(req, res, status, code, extra = {}) {
  return res.status(status).json({
    ok: false,
    error: code,
    message: serverText(req, `errors.${code}`),
    ...extra
  });
}
