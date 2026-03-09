import { serverError } from "../i18n.mjs";

export default function idempotency(idemStore = new Map()) {
  return (req, res, next) => {
    const key = req.get("Idempotency-Key");
    if (!key) return serverError(req, res, 400, "missing_idempotency_key");

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
