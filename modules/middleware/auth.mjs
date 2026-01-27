import { userFromToken } from "../users/store.mjs";

function auth(req, res, next) {
  const raw = req.get("Authorization") || "";
  const token = raw.startsWith("Bearer ") ? raw.slice(7) : "";

  if (!token) return res.status(401).json({ ok: false, error: "MISSING_TOKEN" });

  const user = userFromToken(token);
  if (!user) return res.status(401).json({ ok: false, error: "INVALID_TOKEN" });

  req.user = user;
  next();
}

export default auth;
