# RPS API (REST-ish)

## Base URL
Same origin (served by the Express server)

## Resource
A **play** represents one Rock–Paper–Scissors round.

Server-returned fields:
- `id` (string)
- `playerMove` ("rock" | "paper" | "scissors")
- `serverMove` ("rock" | "paper" | "scissors")
- `result` ("win" | "loss" | "draw")
- `createdAt` (ISO timestamp)

---

## POST /api/plays
Create a play (one round).

### Headers
- `Content-Type: application/json`
- `Idempotency-Key: <string>` (required)

### Request body
```json
{ "playerMove": "rock" }

cat > docs/api.md <<'EOF'
# RPS API (REST-ish)

## Base URL
Same origin (served by the Express server)

## Resource
A **play** represents one Rock–Paper–Scissors round.

Server-returned fields:
- `id` (string)
- `playerMove` ("rock" | "paper" | "scissors")
- `serverMove` ("rock" | "paper" | "scissors")
- `result` ("win" | "loss" | "draw")
- `createdAt` (ISO timestamp)

---

## POST /api/plays
Create a play (one round).

### Headers
- `Content-Type: application/json`
- `Idempotency-Key: <string>` (required)

### Request body
```json
{ "playerMove": "rock" }

{
  "id": "play_...",
  "playerMove": "rock",
  "serverMove": "paper",
  "result": "loss",
  "createdAt": "..."
}

[
  {
    "id": "play_...",
    "playerMove": "rock",
    "serverMove": "paper",
    "result": "loss",
    "createdAt": "..."
  }
]

{
  "totalPlays": 0,
  "wins": 0,
  "losses": 0,
  "draws": 0,
  "playerMoves": { "rock": 0, "paper": 0, "scissors": 0 }
}