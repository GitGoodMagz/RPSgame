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
