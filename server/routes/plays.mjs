import { Router } from "express";
import idempotency from "../../modules/middleware/idempotency.mjs";
import { serverError } from "../../modules/i18n.mjs";
import { initPlaysTable, insertPlay, listPlays, getPlayStats } from "../../modules/plays/pgStore.mjs";

const playsRouter = Router();

function makeId(prefix = "play") {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function decideResult(playerMove, serverMove) {
  if (playerMove === serverMove) return "draw";
  if (
    (playerMove === "rock" && serverMove === "scissors") ||
    (playerMove === "paper" && serverMove === "rock") ||
    (playerMove === "scissors" && serverMove === "paper")
  ) return "win";
  return "loss";
}

function randomServerMove() {
  const moves = ["rock", "paper", "scissors"];
  return moves[Math.floor(Math.random() * moves.length)];
}

let didInit = false;
async function ensureInit() {
  if (didInit) return;
  await initPlaysTable();
  didInit = true;
}

playsRouter.post("/", idempotency(), async (req, res) => {
  try {
    await ensureInit();

    const { playerMove } = req.body || {};
    if (!["rock", "paper", "scissors"].includes(playerMove)) {
      return serverError(req, res, 400, "invalid_player_move", {
        allowed: ["rock", "paper", "scissors"]
      });
    }

    const serverMove = randomServerMove();
    const result = decideResult(playerMove, serverMove);

    const play = {
      id: makeId("play"),
      playerMove,
      serverMove,
      result,
      createdAt: new Date().toISOString()
    };

    const saved = await insertPlay(play);
    return res.status(201).json(saved);
  } catch {
    return serverError(req, res, 500, "server_error");
  }
});

playsRouter.get("/", async (req, res) => {
  try {
    await ensureInit();
    const plays = await listPlays();
    return res.json(plays);
  } catch {
    return serverError(req, res, 500, "server_error");
  }
});

playsRouter.get("/stats", async (req, res) => {
  try {
    await ensureInit();
    const stats = await getPlayStats();
    return res.json(stats);
  } catch {
    return serverError(req, res, 500, "server_error");
  }
});

export default playsRouter;
