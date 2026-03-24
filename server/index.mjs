import express from "express";
import usersRouter from "../modules/users/routes.mjs";
import playsRouter from "./routes/plays.mjs";
import pingRouter from "./routes/ping.mjs";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("client"));

app.use("/api/users", usersRouter);
app.use("/api/plays", playsRouter);
app.use("/api/ping", pingRouter);

app.use((error, request, response, next) => {
  console.error(error);
  const statusCode = error.statusCode || 500;
  const errorCode = error.message || "server_error";
  response.status(statusCode).json({ error: errorCode });
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
