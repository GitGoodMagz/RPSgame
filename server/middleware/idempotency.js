const seen = new Map();

function idempotency({ ttlMs = 10 * 60 * 1000 } = {}) {
  return (req, res, next) => {
    const key = req.headers["idempotency-key"];
    if (!key) return res.status(400).json({ ok: false, error: "Missing Idempotency-Key" });

    const now = Date.now();
    const exp = seen.get(key);
    if (exp && exp > now) return res.status(409).json({ ok: false, error: "Duplicate request" });

    seen.set(key, now + ttlMs);
    next();
  };
}

module.exports = { idempotency };
