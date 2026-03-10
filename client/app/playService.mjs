import { apiRequest } from "./api.mjs";

function makeIdempotencyKey(playerMove) {
  return `play-${playerMove}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function normalizePlay(play) {
  return {
    id: String(play.id ?? ""),
    username: String(play.username ?? ""),
    playerMove: String(play.playerMove ?? ""),
    serverMove: String(play.serverMove ?? ""),
    result: String(play.result ?? ""),
    createdAt: play.createdAt ?? null
  };
}

function normalizeStats(stats) {
  return {
    totalPlays: Number(stats.totalPlays ?? 0),
    wins: Number(stats.wins ?? 0),
    losses: Number(stats.losses ?? 0),
    draws: Number(stats.draws ?? 0),
    playerMoves: {
      rock: Number(stats.playerMoves?.rock ?? 0),
      paper: Number(stats.playerMoves?.paper ?? 0),
      scissors: Number(stats.playerMoves?.scissors ?? 0)
    }
  };
}

export const PlayService = {
  async createPlay(playerMove) {
    const data = await apiRequest("/api/plays", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Idempotency-Key": makeIdempotencyKey(playerMove)
      },
      body: JSON.stringify({ playerMove })
    });

    return normalizePlay(data || {});
  },

  async getStats() {
    const data = await apiRequest("/api/plays/stats");
    return normalizeStats(data || {});
  }
};
