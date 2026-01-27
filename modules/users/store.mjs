import crypto from "crypto";

const usersById = new Map();
const userIdByName = new Map();
const userIdByToken = new Map();

function createUser({ username, passHash, tosAcceptedAt }) {
  if (userIdByName.has(username)) {
    const err = new Error("USERNAME_TAKEN");
    err.status = 409;
    throw err;
  }

  const id = crypto.randomUUID();
  const token = crypto.randomUUID();

  const user = {
    id,
    username,
    passHash,
    createdAt: new Date().toISOString(),
    consent: { tosAcceptedAt },
  };

  usersById.set(id, user);
  userIdByName.set(username, id);
  userIdByToken.set(token, id);

  return { user, token };
}

function userFromToken(token) {
  const id = userIdByToken.get(token);
  if (!id) return null;
  return usersById.get(id) ?? null;
}

function deleteUser(id) {
  const user = usersById.get(id);
  if (!user) return false;

  usersById.delete(id);
  userIdByName.delete(user.username);

  for (const [t, uid] of userIdByToken.entries()) {
    if (uid === id) userIdByToken.delete(t);
  }

  return true;
}

export { createUser, userFromToken, deleteUser };
