import { apiRequest } from "./api.mjs";

function normalizeUser(user) {
  return {
    username: String(user.username ?? ""),
    createdAt: user.createdAt ?? null,
    tosAcceptedAt: user.tosAcceptedAt ?? null,
    isAdmin: Boolean(user.isAdmin)
  };
}

function normalizeAuthPayload(data) {
  return {
    token: String(data?.token ?? ""),
    user: normalizeUser(data?.user || {})
  };
}

export const UserService = {
  async registerUser(username, password, tosAccepted) {
    const data = await apiRequest("/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password,
        tosAccepted: Boolean(tosAccepted)
      })
    });

    return normalizeAuthPayload(data);
  },

  async loginUser(username, password) {
    const data = await apiRequest("/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username,
        password
      })
    });

    return normalizeAuthPayload(data);
  },

  async logoutUser() {
    await apiRequest("/api/users/logout", {
      method: "POST"
    });
  },

  async me() {
    const data = await apiRequest("/api/users/me");
    return normalizeUser(data?.user || {});
  },

  async listUsers() {
    const data = await apiRequest("/api/users");
    const raw = Array.isArray(data?.users) ? data.users : [];
    return raw.map(normalizeUser);
  },

  async editUser(username, password) {
    const data = await apiRequest(`/api/users/${encodeURIComponent(username)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        password
      })
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
