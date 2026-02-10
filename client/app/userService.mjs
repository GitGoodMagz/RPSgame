import { apiRequest } from "./api.mjs";

function normalizeUser(user) {
  return {
    username: String(user.username ?? ""),
    createdAt: user.createdAt ?? null,
    tosAcceptedAt: user.tosAcceptedAt ?? null
  };
}

export const UserService = {
  async listUsers() {
    const data = await apiRequest("/api/users");
    const raw = Array.isArray(data?.users) ? data.users : [];
    return raw.map(normalizeUser);
  },

  async createUser(username, password, tosAccepted) {
    const body = { username, password, tosAccepted: Boolean(tosAccepted) };
    const data = await apiRequest("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return normalizeUser(data?.user || {});
  },

  async editUser(username, newPassword) {
    const body = { password: newPassword || "" };
    const data = await apiRequest(`/api/users/${encodeURIComponent(username)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    return normalizeUser(data?.user || {});
  },

  async deleteUser(username) {
    const data = await apiRequest(`/api/users/${encodeURIComponent(username)}`, {
      method: "DELETE"
    });
    return normalizeUser(data?.user || {});
  }
};
