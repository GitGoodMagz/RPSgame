const seen = new Map();

function idempotency(options = {}) {
  const ttlMs = Number.isFinite(options.ttlMs) ? options.ttlMs : 10 * 60 * 1000;

  return (req, res, next) => {
    const key = req.get("Idempotency-Key");

    if (!key) {
      return res.status(400).json({ ok: false, error: "Missing Idempotency-Key" });
    }

    const now = Date.now();
    const expiresAt = seen.get(key);

    if (expiresAt && expiresAt > now) {
      return res.status(409).json({ ok: false, error: "Duplicate request" });
    }

    seen.set(key, now + ttlMs);
    next();
  };
}

export default idempotency;
