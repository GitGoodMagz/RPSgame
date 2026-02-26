import { Router } from "express";
import { hashPassword, verifyPassword } from "../password.mjs";
import {
  initUsersTable,
  listUsers,
  findUserByUsername,
  insertUser,
  updateUserByUsername,
  deleteUserByUsername
} from "./pgStore.mjs";

const router = Router();

function s(v) {
  return String(v ?? "").trim();
}

function p(v) {
  return String(v ?? "");
}

function toPublicUser(u) {
  return {
    username: u.username,
    password: null,
    tosAccepted: Boolean(u.tosAcceptedAt),
    createdAt: u.createdAt ?? null,
    tosAcceptedAt: u.tosAcceptedAt ?? null
  };
}

let didInit = false;
async function ensureInit() {
  if (didInit) return;
  await initUsersTable();
  didInit = true;
}

router.post("/register", async (req, res) => {
  try {
    await ensureInit();

    const username = s(req.body?.username);
    const passwordPlain = p(req.body?.password);
    const tosAccepted = Boolean(req.body?.tosAccepted);

    if (!username) return res.status(400).json({ ok: false, error: "username_required" });
    if (!passwordPlain) return res.status(400).json({ ok: false, error: "password_required" });

    const existing = await findUserByUsername(username.toLowerCase());
    if (existing) return res.status(409).json({ ok: false, error: "username_taken" });

    const now = new Date().toISOString();

    const user = {
      username,
      password: hashPassword(passwordPlain),
      createdAt: now,
      tosAcceptedAt: tosAccepted ? now : null
    };

    await insertUser(user);

    return res.status(201).json({ ok: true, user: toPublicUser(user) });
  } catch {
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    await ensureInit();

    const username = s(req.body?.username);
    const passwordPlain = p(req.body?.password);

    if (!username) return res.status(400).json({ ok: false, error: "username_required" });
    if (!passwordPlain) return res.status(400).json({ ok: false, error: "password_required" });

    const user = await findUserByUsername(username.toLowerCase());
    if (!user) return res.status(401).json({ ok: false, error: "invalid_credentials" });

    const ok = verifyPassword(passwordPlain, user.password);
    if (!ok) return res.status(401).json({ ok: false, error: "invalid_credentials" });

    return res.json({ ok: true, user: toPublicUser(user) });
  } catch {
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

router.get("/", async (_req, res) => {
  try {
    await ensureInit();
    const users = await listUsers();
    return res.json({ ok: true, users: users.map(toPublicUser) });
  } catch {
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

router.put("/:username", async (req, res) => {
  try {
    await ensureInit();

    const usernameParam = s(req.params?.username);
    if (!usernameParam) return res.status(400).json({ ok: false, error: "username_required" });

    const passwordPlain = p(req.body?.password);
    const tosAccepted = req.body?.tosAccepted;

    const patch = {};

    if (passwordPlain) {
      patch.password = hashPassword(passwordPlain);
    }

    if (typeof tosAccepted === "boolean") {
      patch.tosAcceptedAt = tosAccepted ? new Date().toISOString() : null;
    }

    const updated = await updateUserByUsername(usernameParam.toLowerCase(), patch);
    if (!updated) return res.status(404).json({ ok: false, error: "user_not_found" });

    return res.json({ ok: true, user: toPublicUser(updated) });
  } catch {
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

router.delete("/:username", async (req, res) => {
  try {
    await ensureInit();

    const usernameParam = s(req.params?.username);
    if (!usernameParam) return res.status(400).json({ ok: false, error: "username_required" });

    const removed = await deleteUserByUsername(usernameParam.toLowerCase());
    if (!removed) return res.status(404).json({ ok: false, error: "user_not_found" });

    return res.json({ ok: true, user: toPublicUser(removed) });
  } catch {
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

export default router;
