import pg from "pg";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL || "";
if (!databaseUrl) {
  throw new Error("DATABASE_URL not set");
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

export async function initUsersTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      username TEXT PRIMARY KEY,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL,
      tos_accepted_at TEXT
    )
  `);
}

export async function listUsers() {
  const r = await pool.query(
    `SELECT username, password, created_at, tos_accepted_at
     FROM users
     ORDER BY created_at DESC`
  );
  return r.rows.map((row) => ({
    username: row.username,
    password: row.password,
    createdAt: row.created_at,
    tosAcceptedAt: row.tos_accepted_at
  }));
}

export async function findUserByUsername(usernameLower) {
  const r = await pool.query(
    `SELECT username, password, created_at, tos_accepted_at
     FROM users
     WHERE LOWER(username) = $1
     LIMIT 1`,
    [usernameLower]
  );
  const row = r.rows[0];
  if (!row) return null;
  return {
    username: row.username,
    password: row.password,
    createdAt: row.created_at,
    tosAcceptedAt: row.tos_accepted_at
  };
}

export async function insertUser(user) {
  await pool.query(
    `INSERT INTO users (username, password, created_at, tos_accepted_at)
     VALUES ($1, $2, $3, $4)`,
    [user.username, user.password, user.createdAt, user.tosAcceptedAt]
  );
}

export async function updateUserByUsername(usernameLower, patch) {
  const current = await findUserByUsername(usernameLower);
  if (!current) return null;

  const next = {
    ...current,
    ...patch
  };

  await pool.query(
    `UPDATE users
     SET password = $2,
         tos_accepted_at = $3
     WHERE LOWER(username) = $1`,
    [usernameLower, next.password, next.tosAcceptedAt]
  );

  return next;
}

export async function deleteUserByUsername(usernameLower) {
  const r = await pool.query(
    `DELETE FROM users
     WHERE LOWER(username) = $1
     RETURNING username, password, created_at, tos_accepted_at`,
    [usernameLower]
  );
  const row = r.rows[0];
  if (!row) return null;
  return {
    username: row.username,
    password: row.password,
    createdAt: row.created_at,
    tosAcceptedAt: row.tos_accepted_at
  };
}
