import { Router } from "express";
import { hashPassword, verifyPassword } from "../password.mjs";
import { readUsers, writeUsers } from "./store.mjs";

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

router.post("/register", async (req, res) => {
  try {
    const username = s(req.body?.username);
    const passwordPlain = p(req.body?.password);
    const tosAccepted = Boolean(req.body?.tosAccepted);

    if (!username) return res.status(400).json({ ok: false, error: "username_required" });
    if (!passwordPlain) return res.status(400).json({ ok: false, error: "password_required" });

    const users = await readUsers();
    const exists = users.some((u) => (u.username ?? "").toLowerCase() === username.toLowerCase());
    if (exists) return res.status(409).json({ ok: false, error: "username_taken" });

    const now = new Date().toISOString();

    const user = {
      username,
      password: hashPassword(passwordPlain),
      createdAt: now,
      tosAcceptedAt: tosAccepted ? now : null
    };

    users.push(user);
    await writeUsers(users);

    return res.status(201).json({ ok: true, user: toPublicUser(user) });
  } catch {
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const username = s(req.body?.username);
    const passwordPlain = p(req.body?.password);

    if (!username) return res.status(400).json({ ok: false, error: "username_required" });
    if (!passwordPlain) return res.status(400).json({ ok: false, error: "password_required" });

    const users = await readUsers();
    const user = users.find((u) => (u.username ?? "").toLowerCase() === username.toLowerCase());
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
    const users = await readUsers();
    return res.json({ ok: true, users: users.map(toPublicUser) });
  } catch {
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

router.put("/:username", async (req, res) => {
  try {
    const usernameParam = s(req.params?.username);
    if (!usernameParam) return res.status(400).json({ ok: false, error: "username_required" });

    const users = await readUsers();
    const idx = users.findIndex((u) => (u.username ?? "").toLowerCase() === usernameParam.toLowerCase());
    if (idx === -1) return res.status(404).json({ ok: false, error: "user_not_found" });

    const passwordPlain = p(req.body?.password);
    const tosAccepted = req.body?.tosAccepted;

    if (passwordPlain) {
      users[idx].password = hashPassword(passwordPlain);
    }

    if (typeof tosAccepted === "boolean") {
      users[idx].tosAcceptedAt = tosAccepted ? new Date().toISOString() : null;
    }

    await writeUsers(users);
    return res.json({ ok: true, user: toPublicUser(users[idx]) });
  } catch {
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

router.delete("/:username", async (req, res) => {
  try {
    const usernameParam = s(req.params?.username);
    if (!usernameParam) return res.status(400).json({ ok: false, error: "username_required" });

    const users = await readUsers();
    const idx = users.findIndex((u) => (u.username ?? "").toLowerCase() === usernameParam.toLowerCase());
    if (idx === -1) return res.status(404).json({ ok: false, error: "user_not_found" });

    const removed = users.splice(idx, 1)[0];
    await writeUsers(users);

    return res.json({ ok: true, user: toPublicUser(removed) });
  } catch {
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

export default router;
