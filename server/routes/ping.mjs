import { Router } from "express";

const pingRouter = Router();

pingRouter.get("/", (_req, res) => {
  res.json({ ok: true, message: "pong" });
});

export default pingRouter;
