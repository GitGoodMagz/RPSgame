const sessionStorageKey = "rpsgame.session";

export function loadStoredSession() {
  try {
    const raw = localStorage.getItem(sessionStorageKey);
    if (!raw) return { token: "", user: null };

    const parsed = JSON.parse(raw);
    return {
      token: String(parsed?.token || ""),
      user: parsed?.user || null
    };
  } catch {
    return { token: "", user: null };
  }
}

export function saveSession(token, user) {
  const payload = {
    token: String(token || ""),
    user: user || null
  };

  localStorage.setItem(sessionStorageKey, JSON.stringify(payload));
}

export function clearSession() {
  localStorage.removeItem(sessionStorageKey);
}

export function getStoredToken() {
  const session = loadStoredSession();
  return session.token;
}
