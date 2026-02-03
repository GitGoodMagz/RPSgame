import crypto from "crypto";

const ITERATIONS = 310000;
const KEYLEN = 32; // 256-bit
const DIGEST = "sha256";
const SALT_BYTES = 16;

export function hashPassword(password) {
  if (typeof password !== "string" || password.length === 0) {
    throw new Error("Password must be a non-empty string.");
  }

  const salt = crypto.randomBytes(SALT_BYTES).toString("hex");

  const hash = crypto
    .pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST)
    .toString("hex");

  return {
    algo: "pbkdf2",
    digest: DIGEST,
    iterations: ITERATIONS,
    salt,
    hash
  };
}

export function verifyPassword(password, stored) {
  if (typeof password !== "string" || password.length === 0) return false;
  if (!stored || stored.algo !== "pbkdf2") return false;
  if (!stored.salt || !stored.hash || !stored.iterations || !stored.digest) return false;

  const hashCheck = crypto
    .pbkdf2Sync(password, stored.salt, stored.iterations, KEYLEN, stored.digest)
    .toString("hex");

  const a = Buffer.from(stored.hash, "hex");
  const b = Buffer.from(hashCheck, "hex");

  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
