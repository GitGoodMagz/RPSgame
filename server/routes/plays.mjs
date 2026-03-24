import { Router } from "express";
import requireAuth from "../../modules/middleware/requireAuth.mjs";
import { createPlayForUser, getPlayStatsForUser } from "../../modules/plays/service.mjs";

const router = Router();

router.post("/", requireAuth, async (request, response, next) => {
  try {
    const createdPlay = await createPlayForUser({
      username: request.authUser.username,
      playerMove: request.body?.playerMove
    });

    response.status(201).json(createdPlay);
  } catch (error) {
    if (error.statusCode) {
      return response.status(error.statusCode).json({ error: error.message });
    }

    next(error);
  }
});

router.get("/stats", requireAuth, async (request, response, next) => {
  try {
    const userPlayStats = await getPlayStatsForUser(request.authUser.username);
    response.json(userPlayStats);
  } catch (error) {
    next(error);
  }
});

export default router;
