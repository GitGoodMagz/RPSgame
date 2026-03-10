import { serverError } from "../i18n.mjs";
import { getSessionUsername, deleteSession } from "../users/sessions.mjs";
import { ensureUsersReady, getUserBySessionUsername } from "../users/service.mjs";

export default async function requireAuth(req, res, next) {
  await ensureUsersReady();

  const authorization = String(req.headers.authorization || "");
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  const token = match?.[1] || "";

  if (!token) {
    return serverError(req, res, 401, "unauthorized");
  }

  const sessionUsername = getSessionUsername(token);
  if (!sessionUsername) {
    return serverError(req, res, 401, "unauthorized");
  }

  const user = await getUserBySessionUsername(sessionUsername);
  if (!user) {
    deleteSession(token);
    return serverError(req, res, 401, "unauthorized");
  }

  req.authToken = token;
  req.authUser = user;
  next();
}
