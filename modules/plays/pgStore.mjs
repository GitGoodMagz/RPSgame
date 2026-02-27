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

export async function initPlaysTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS plays (
      id TEXT PRIMARY KEY,
      player_move TEXT NOT NULL,
      server_move TEXT NOT NULL,
      result TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL
    )
  `);
}

function rowToPlay(row) {
  return {
    id: row.id,
    playerMove: row.player_move,
    serverMove: row.server_move,
    result: row.result,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at
  };
}

export async function insertPlay(play) {
  const r = await pool.query(
    `INSERT INTO plays (id, player_move, server_move, result, created_at)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, player_move, server_move, result, created_at`,
    [play.id, play.playerMove, play.serverMove, play.result, play.createdAt]
  );

  return rowToPlay(r.rows[0]);
}

export async function listPlays() {
  const r = await pool.query(
    `SELECT id, player_move, server_move, result, created_at
     FROM plays
     ORDER BY created_at DESC`
  );

  return r.rows.map(rowToPlay);
}

export async function getPlayStats() {
  const totalsRes = await pool.query(
    `SELECT
       COUNT(*)::int AS total_plays,
       SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END)::int AS wins,
       SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END)::int AS losses,
       SUM(CASE WHEN result = 'draw' THEN 1 ELSE 0 END)::int AS draws
     FROM plays`
  );

  const movesRes = await pool.query(
    `SELECT player_move, COUNT(*)::int AS c
     FROM plays
     GROUP BY player_move`
  );

  const totals = totalsRes.rows[0] || { total_plays: 0, wins: 0, losses: 0, draws: 0 };

  const playerMoves = { rock: 0, paper: 0, scissors: 0 };
  for (const row of movesRes.rows) {
    const key = String(row.player_move || "");
    if (key in playerMoves) playerMoves[key] = row.c;
  }

  return {
    totalPlays: totals.total_plays ?? 0,
    wins: totals.wins ?? 0,
    losses: totals.losses ?? 0,
    draws: totals.draws ?? 0,
    playerMoves
  };
}
