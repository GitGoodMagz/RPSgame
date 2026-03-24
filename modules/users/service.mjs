import { hashPassword, verifyPassword } from "../password.mjs";
import {
  initUsersTable,
  listUsers,
  findUserByUsername,
  insertUser,
  updateUserByUsername,
  deleteUserByUsername,
} from "./pgStore.mjs";

const adminUsername = "admin";
const adminPassword = "admin123";

function s(value) {
  return String(value ?? "").trim();
}

function p(value) {
  return String(value ?? "");
}

function sameUser(a, b) {
  return s(a).toLowerCase() === s(b).toLowerCase();
}

function toPublicUser(user) {
  return {
    id: user.id ?? null,
    username: user.username,
    createdAt: user.createdAt ?? null,
    tosAcceptedAt: user.tosAcceptedAt ?? null,
    isAdmin: Boolean(user.isAdmin),
  };
}

function createAccessError(status, code) {
  const error = new Error(code);
  error.status = status;
  error.code = code;
  return error;
}

function ensureCanManage(viewer, targetUsername) {
  if (sameUser(targetUsername, adminUsername)) {
    throw createAccessError(403, "admin_protected");
  }

  if (viewer.isAdmin) return;
  if (sameUser(viewer.username, targetUsername)) return;

  throw createAccessError(403, "forbidden");
}

let didInit = false;

export async function ensureUsersReady() {
  if (didInit) return;

  await initUsersTable();

  const existingAdmin = await findUserByUsername(adminUsername);
  if (!existingAdmin) {
    const now = new Date().toISOString();

    await insertUser({
      username: adminUsername,
      password: hashPassword(adminPassword),
      createdAt: now,
      tosAcceptedAt: now,
      isAdmin: true,
    });
  }

  didInit = true;
}

export async function registerUser(payload) {
  await ensureUsersReady();

  const username = s(payload?.username);
  const passwordPlain = p(payload?.password);
  const tosAccepted = Boolean(payload?.tosAccepted);

  if (!username) throw createAccessError(400, "username_required");
  if (!passwordPlain) throw createAccessError(400, "password_required");
  if (!tosAccepted) throw createAccessError(400, "terms_required");

  const existing = await findUserByUsername(username.toLowerCase());
  if (existing) throw createAccessError(409, "username_taken");

  const now = new Date().toISOString();

  await insertUser({
    username,
    password: hashPassword(passwordPlain),
    createdAt: now,
    tosAcceptedAt: now,
    isAdmin: false,
  });

  const createdUser = await findUserByUsername(username.toLowerCase());
  return toPublicUser(createdUser);
}

export async function loginUser(payload) {
  await ensureUsersReady();

  const username = s(payload?.username);
  const passwordPlain = p(payload?.password);

  if (!username) throw createAccessError(400, "username_required");
  if (!passwordPlain) throw createAccessError(400, "password_required");

  const user = await findUserByUsername(username.toLowerCase());
  if (!user) throw createAccessError(401, "invalid_credentials");

  const ok = verifyPassword(passwordPlain, user.password);
  if (!ok) throw createAccessError(401, "invalid_credentials");

  return toPublicUser(user);
}

export async function getUserBySessionUsername(username) {
  await ensureUsersReady();

  const user = await findUserByUsername(s(username).toLowerCase());
  if (!user) return null;
  return toPublicUser(user);
}

export async function listVisibleUsers(viewer) {
  await ensureUsersReady();

  if (viewer.isAdmin) {
    const users = await listUsers();
    return users.map(toPublicUser);
  }

  const ownUser = await findUserByUsername(viewer.username.toLowerCase());
  return ownUser ? [toPublicUser(ownUser)] : [];
}

export async function updateVisibleUser(viewer, targetUsername, payload) {
  await ensureUsersReady();

  const target = s(targetUsername);
  if (!target) throw createAccessError(400, "username_required");

  ensureCanManage(viewer, target);

  const passwordPlain = p(payload?.password);
  if (!passwordPlain) throw createAccessError(400, "password_required");

  const updated = await updateUserByUsername(target.toLowerCase(), {
    password: hashPassword(passwordPlain),
  });

  if (!updated) throw createAccessError(404, "user_not_found");
  return toPublicUser(updated);
}

export async function deleteVisibleUser(viewer, targetUsername) {
  await ensureUsersReady();

  const target = s(targetUsername);
  if (!target) throw createAccessError(400, "username_required");

  ensureCanManage(viewer, target);

  const removed = await deleteUserByUsername(target.toLowerCase());
  if (!removed) throw createAccessError(404, "user_not_found");
  return toPublicUser(removed);
}
