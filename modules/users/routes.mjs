import express from "express";
import bcrypt from "bcryptjs";
import { createUser, deleteUser } from "./store.mjs";
import auth from "../middleware/auth.mjs";

const router = express.Router();

router.post("/", async (req, res) => {
  const { username, password, acceptToS } = req.body || {};

  if (typeof username !== "string" || username.trim().length < 3) {
    return res.status(400).json({ ok: false, error: "INVALID_USERNAME" });
  }

  if (acceptToS !== true) {
    return res.status(400).json({ ok: false, error: "TOS_NOT_ACCEPTED" });
  }

  if (typeof password !== "string" || password.length < 6) {
    return res.status(400).json({ ok: false, error: "INVALID_PASSWORD" });
  }

  const clean = username.trim();
  const passHash = await bcrypt.hash(password, 10);

  try {
    const { user, token } = createUser({
      username: clean,
      passHash,
      tosAcceptedAt: new Date().toISOString(),
    });

    return res.status(201).json({
      ok: true,
      user: { id: user.id, username: user.username, createdAt: user.createdAt },
      token,
    });
  } catch (e) {
    const status = e.status || 500;
    return res.status(status).json({ ok: false, error: e.message || "ERROR" });
  }
});

router.get("/me", auth, (req, res) => {
  res.json({
    ok: true,
    user: {
      id: req.user.id,
      username: req.user.username,
      createdAt: req.user.createdAt,
      consent: req.user.consent,
    },
  });
});

router.delete("/me", auth, (req, res) => {
  const ok = deleteUser(req.user.id);
  if (!ok) return res.status(404).json({ ok: false, error: "USER_NOT_FOUND" });
  return res.status(204).send();
});

export default router;
