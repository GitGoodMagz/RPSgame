import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import usersRouter from "../modules/users/routes.mjs";
import pingRouter from "./routes/ping.mjs";
import playsRouter from "./routes/plays.mjs";

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientPath = path.join(__dirname, "..", "client");

app.use(express.static(clientPath));
app.use(express.json());

app.use("/api/ping", pingRouter);
app.use("/api/users", usersRouter);
app.use("/api/plays", playsRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
