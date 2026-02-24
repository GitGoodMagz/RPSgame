import { Router } from "express";
import idempotency from "../../modules/middleware/idempotency.mjs";

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

const plays = [];

playsRouter.post("/", idempotency(), (req, res) => {
  const { playerMove } = req.body || {};
  if (!["rock", "paper", "scissors"].includes(playerMove)) {
    return res.status(400).json({
      ok: false,
      error: "invalid_player_move",
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

  plays.push(play);
  return res.status(201).json(play);
});

playsRouter.get("/", (_req, res) => {
  res.json(plays);
});

playsRouter.get("/stats", (_req, res) => {
  const totalPlays = plays.length;
  let wins = 0;
  let losses = 0;
  let draws = 0;
  const playerMoves = { rock: 0, paper: 0, scissors: 0 };

  for (const p of plays) {
    if (p?.playerMove in playerMoves) playerMoves[p.playerMove] += 1;
    if (p?.result === "win") wins += 1;
    else if (p?.result === "loss") losses += 1;
    else if (p?.result === "draw") draws += 1;
  }

  res.json({ totalPlays, wins, losses, draws, playerMoves });
});

export default playsRouter;
