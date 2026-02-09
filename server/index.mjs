import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import usersRouter from "../modules/users/routes.mjs";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "..", "client")));
app.use(express.json());

app.get("/api/ping", (_req, res) => {
  res.json({ ok: true, message: "pong" });
});

app.use("/api/users", usersRouter);

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
const idemStore = new Map();

function idempotency() {
  return (req, res, next) => {
    const key = req.get("Idempotency-Key");
    if (!key) return res.status(400).json({ ok: false, error: "missing_idempotency_key" });

    const hit = idemStore.get(key);
    if (hit) return res.status(hit.statusCode).json(hit.body);

    const originalJson = res.json.bind(res);
    res.json = (body) => {
      const statusCode = res.statusCode || 200;
      idemStore.set(key, { statusCode, body });
      return originalJson(body);
    };

    next();
  };
}

app.post("/api/plays", idempotency(), (req, res) => {
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

app.get("/api/plays", (_req, res) => {
  res.json(plays);
});

app.get("/api/plays/stats", (_req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
