import { insertPlayForUser, selectPlayStatsByUsername } from "./queries.mjs";

const validMoves = new Set(["rock", "paper", "scissors"]);
const botMoves = ["rock", "paper", "scissors"];

function normalizeMove(value) {
  return String(value || "").trim().toLowerCase();
}

function pickBotMove() {
  return botMoves[Math.floor(Math.random() * botMoves.length)];
}

function getRoundResult(playerMove, serverMove) {
  if (playerMove === serverMove) return "draw";

  const winningPairs = {
    rock: "scissors",
    paper: "rock",
    scissors: "paper"
  };

  return winningPairs[playerMove] === serverMove ? "win" : "loss";
}

export function assertValidPlayerMove(playerMove) {
  const normalizedPlayerMove = normalizeMove(playerMove);

  if (!validMoves.has(normalizedPlayerMove)) {
    const error = new Error("invalid_player_move");
    error.statusCode = 400;
    throw error;
  }

  return normalizedPlayerMove;
}

export async function createPlayForUser({ username, playerMove }) {
  const normalizedPlayerMove = assertValidPlayerMove(playerMove);
  const serverMove = pickBotMove();
  const roundResult = getRoundResult(normalizedPlayerMove, serverMove);

  const insertedPlay = await insertPlayForUser({
    username,
    playerMove: normalizedPlayerMove,
    serverMove,
    roundResult
  });

  return {
    id: insertedPlay.id,
    username: insertedPlay.username,
    playerMove: insertedPlay.player_move,
    serverMove: insertedPlay.server_move,
    result: insertedPlay.result,
    createdAt: insertedPlay.created_at
  };
}

export async function getPlayStatsForUser(username) {
  const statsRow = await selectPlayStatsByUsername(username);

  return {
    totalPlays: statsRow?.total_plays ?? 0,
    wins: statsRow?.wins ?? 0,
    losses: statsRow?.losses ?? 0,
    draws: statsRow?.draws ?? 0
  };
}
