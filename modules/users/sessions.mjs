import crypto from "crypto";

const sessions = new Map();

export function createSession(username) {
  const token = crypto.randomBytes(24).toString("hex");
  sessions.set(token, String(username || "").toLowerCase());
  return token;
}

export function getSessionUsername(token) {
  return sessions.get(token) || "";
}

export function deleteSession(token) {
  sessions.delete(token);
}
