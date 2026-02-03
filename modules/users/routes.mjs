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

    return res.status(201).json({
      ok: true,
      user: { username: user.username, createdAt: user.createdAt, tosAcceptedAt: user.tosAcceptedAt }
    });
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

    return res.json({
      ok: true,
      user: { username: user.username, createdAt: user.createdAt ?? null, tosAcceptedAt: user.tosAcceptedAt ?? null }
    });
  } catch {
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

router.get("/", async (_req, res) => {
  try {
    const users = await readUsers();
    return res.json({
      ok: true,
      users: users.map((u) => ({
        username: u.username,
        createdAt: u.createdAt ?? null,
        tosAcceptedAt: u.tosAcceptedAt ?? null
      }))
    });
  } catch {
    return res.status(500).json({ ok: false, error: "server_error" });
  }
});

export default router;
