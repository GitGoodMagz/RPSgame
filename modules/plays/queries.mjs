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

let didInitUserPlayHistory = false;

async function ensureUserPlayHistoryReady() {
  if (didInitUserPlayHistory) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS user_play_history (
      id BIGSERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      player_move TEXT NOT NULL,
      server_move TEXT NOT NULL,
      result TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  didInitUserPlayHistory = true;
}

export async function insertPlayForUser({ username, playerMove, serverMove, roundResult }) {
  await ensureUserPlayHistoryReady();

  const result = await pool.query(
    `
      INSERT INTO user_play_history (username, player_move, server_move, result)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, player_move, server_move, result, created_at
    `,
    [username, playerMove, serverMove, roundResult]
  );

  return result.rows[0];
}

export async function selectPlayStatsByUsername(username) {
  await ensureUserPlayHistoryReady();

  const result = await pool.query(
    `
      SELECT
        COUNT(*)::int AS total_plays,
        COUNT(*) FILTER (WHERE result = 'win')::int AS wins,
        COUNT(*) FILTER (WHERE result = 'loss')::int AS losses,
        COUNT(*) FILTER (WHERE result = 'draw')::int AS draws
      FROM user_play_history
      WHERE username = $1
    `,
    [username]
  );

  return result.rows[0];
}
