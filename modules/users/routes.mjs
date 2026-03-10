import { Router } from "express";
import { serverError } from "../i18n.mjs";
import requireAuth from "../middleware/requireAuth.mjs";
import { createSession, deleteSession } from "./sessions.mjs";
import {
  ensureUsersReady,
  registerUser,
  loginUser,
  listVisibleUsers,
  updateVisibleUser,
  deleteVisibleUser
} from "./service.mjs";

const router = Router();

function sendKnownError(req, res, error) {
  if (error?.code && error?.status) {
    return serverError(req, res, error.status, error.code);
  }

  return serverError(req, res, 500, "server_error");
}

router.post("/register", async (req, res) => {
  try {
    const user = await registerUser(req.body || {});
    const token = createSession(user.username);
    return res.status(201).json({ ok: true, token, user });
  } catch (error) {
    return sendKnownError(req, res, error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await loginUser(req.body || {});
    const token = createSession(user.username);
    return res.json({ ok: true, token, user });
  } catch (error) {
    return sendKnownError(req, res, error);
  }
});

router.post("/logout", requireAuth, async (req, res) => {
  try {
    await ensureUsersReady();
    deleteSession(req.authToken);
    return res.json({ ok: true });
  } catch {
    return serverError(req, res, 500, "server_error");
  }
});

router.get("/me", requireAuth, async (req, res) => {
  try {
    await ensureUsersReady();
    return res.json({ ok: true, user: req.authUser });
  } catch {
    return serverError(req, res, 500, "server_error");
  }
});

router.get("/", requireAuth, async (req, res) => {
  try {
    const users = await listVisibleUsers(req.authUser);
    return res.json({ ok: true, users });
  } catch (error) {
    return sendKnownError(req, res, error);
  }
});

router.put("/:username", requireAuth, async (req, res) => {
  try {
    const user = await updateVisibleUser(req.authUser, req.params?.username, req.body || {});
    return res.json({ ok: true, user });
  } catch (error) {
    return sendKnownError(req, res, error);
  }
});

router.delete("/:username", requireAuth, async (req, res) => {
  try {
    const user = await deleteVisibleUser(req.authUser, req.params?.username);
    if (req.authUser.username.toLowerCase() === user.username.toLowerCase()) {
      deleteSession(req.authToken);
    }
    return res.json({ ok: true, user });
  } catch (error) {
    return sendKnownError(req, res, error);
  }
});

export default router;
