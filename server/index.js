const path = require("path");
const express = require("express");
const { idempotency } = require("./middleware/idempotency");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "..", "client")));
app.use(express.json());

app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "pong" });
});

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

const plays = [];
const stats = {
  totalPlays: 0,
  wins: 0,
  losses: 0,
  draws: 0,
  playerMoves: { rock: 0, paper: 0, scissors: 0 },
};

app.post("/api/plays", idempotency(), (req, res) => {
  const { playerMove } = req.body || {};
  const allowed = new Set(["rock", "paper", "scissors"]);

  if (!allowed.has(playerMove)) {
    return res.status(400).json({ ok: false, error: "Invalid playerMove" });
  }

  const serverMove = ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)];
  const result = decideResult(playerMove, serverMove);

  const play = {
    id: makeId("play"),
    playerMove,
    serverMove,
    result,
    createdAt: new Date().toISOString(),
  };

  plays.push(play);

  stats.totalPlays += 1;
  stats.playerMoves[playerMove] += 1;
  if (result === "win") stats.wins += 1;
  if (result === "loss") stats.losses += 1;
  if (result === "draw") stats.draws += 1;

  res.status(201).json(play);
});

app.get("/api/plays", (req, res) => {
  res.json(plays);
});

app.get("/api/stats", (req, res) => {
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
