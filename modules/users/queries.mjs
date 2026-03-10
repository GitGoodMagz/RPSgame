export const createUsersTableSql = `
  CREATE TABLE IF NOT EXISTS users (
    username TEXT PRIMARY KEY,
    password TEXT NOT NULL,
    created_at TEXT NOT NULL,
    tos_accepted_at TEXT,
    is_admin BOOLEAN NOT NULL DEFAULT FALSE
  )
`;

export const addIsAdminColumnSql = `
  ALTER TABLE users
  ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE
`;

export const listUsersSql = `
  SELECT username, password, created_at, tos_accepted_at, is_admin
  FROM users
  ORDER BY created_at DESC
`;

export const findUserByUsernameSql = `
  SELECT username, password, created_at, tos_accepted_at, is_admin
  FROM users
  WHERE LOWER(username) = $1
  LIMIT 1
`;

export const insertUserSql = `
  INSERT INTO users (username, password, created_at, tos_accepted_at, is_admin)
  VALUES ($1, $2, $3, $4, $5)
`;

export const updateUserByUsernameSql = `
  UPDATE users
  SET password = $2,
      tos_accepted_at = $3,
      is_admin = $4
  WHERE LOWER(username) = $1
`;

export const deleteUserByUsernameSql = `
  DELETE FROM users
  WHERE LOWER(username) = $1
  RETURNING username, password, created_at, tos_accepted_at, is_admin
`;
