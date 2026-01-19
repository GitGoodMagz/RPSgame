const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve the client folder as static files
app.use(express.static(path.join(__dirname, "..", "client")));

// Simple test endpoint (REST-ish API placeholder)
app.get("/api/ping", (req, res) => {
  res.json({ ok: true, message: "pong" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
