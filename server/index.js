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

app.post("/api/play", idempotency(), (req, res) => {
  const { choice } = req.body || {};
  res.json({ ok: true, received: choice ?? null });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
