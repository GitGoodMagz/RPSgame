# Project Plan – Rock Paper Scissors

## Client
- Game interface
- Player input
- Result display

## Server
- Game logic
- API handling

## User Accounts
- Register
- Login

## Database (PostgreSQL)
- Store users
- Store results

## REST-ish API
- POST /api/plays (create a play)
- GET /api/plays (list plays)
- GET /api/stats (aggregate results)

## PWA
- Installable app

## Offline
- Play without internet
- Sync when online

## Tasks for middleware

### Design
- Define idempotency behavior (Idempotency-Key prevents duplicate processing)

### Implementation
- Implement and apply idempotency middleware to POST endpoints that create plays

### Documentation
- Document middleware purpose and usage

## Tasks for API scaffold
- Define and document the RPS API (plays + stats)
- Scaffold Express routes for /api/plays and /api/stats using in-memory data
- Add Bruno test collection to the repo

## tested bcrypt

- going back to built-in crypto + PBKDF2 hashing
- Initially, the project used bcrypt for password hashing. While this is a common industry standard, it was considered unnecessary for the limited scope of this assignment. To reduce external dependencies and keep the solution simpler and more transparent, the password handling was refactored to use Node.js’ built-in crypto module with PBKDF2.

## started with CommonJS > ES Modules
- started off with commonjs, but migrated everything to ES modules/.mjs to use the ES module syntax
- As a side effect of this migration, duplicate package.json and package-lock.json files were temporarily created when dependencies were installed from different directories. This resulted in separate Node.js project scopes (root vs /server).