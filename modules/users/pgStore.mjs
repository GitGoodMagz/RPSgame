import pg from "pg";
import {
  createUsersTableSql,
  addIsAdminColumnSql,
  listUsersSql,
  findUserByUsernameSql,
  insertUserSql,
  updateUserByUsernameSql,
  deleteUserByUsernameSql
} from "./queries.mjs";

const { Pool } = pg;

const databaseUrl = process.env.DATABASE_URL || "";
if (!databaseUrl) {
  throw new Error("DATABASE_URL not set");
}

const pool = new Pool({
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

function parsePassword(value) {
  if (value && typeof value === "object") return value;

  try {
    return JSON.parse(String(value || ""));
  } catch {
    return null;
  }
}

function mapUserRow(row) {
  return {
    username: row.username,
    password: parsePassword(row.password),
    createdAt: row.created_at,
    tosAcceptedAt: row.tos_accepted_at,
    isAdmin: Boolean(row.is_admin)
  };
}

export async function initUsersTable() {
  await pool.query(createUsersTableSql);
  await pool.query(addIsAdminColumnSql);
}

export async function listUsers() {
  const result = await pool.query(listUsersSql);
  return result.rows.map(mapUserRow);
}

export async function findUserByUsername(usernameLower) {
  const result = await pool.query(findUserByUsernameSql, [usernameLower]);
  const row = result.rows[0];
  if (!row) return null;
  return mapUserRow(row);
}

export async function insertUser(user) {
  await pool.query(insertUserSql, [
    user.username,
    JSON.stringify(user.password),
    user.createdAt,
    user.tosAcceptedAt,
    Boolean(user.isAdmin)
  ]);
}

export async function updateUserByUsername(usernameLower, patch) {
  const current = await findUserByUsername(usernameLower);
  if (!current) return null;

  const next = {
    ...current,
    ...patch
  };

  await pool.query(updateUserByUsernameSql, [
    usernameLower,
    JSON.stringify(next.password),
    next.tosAcceptedAt,
    Boolean(next.isAdmin)
  ]);

  return next;
}

export async function deleteUserByUsername(usernameLower) {
  const result = await pool.query(deleteUserByUsernameSql, [usernameLower]);
  const row = result.rows[0];
  if (!row) return null;
  return mapUserRow(row);
}
