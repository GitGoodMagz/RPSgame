RPS API (REST-ish)
Base URL

Same origin (served by the Express server)

All requests and responses use JSON.

Resource: Play

A play represents one Rock–Paper–Scissors round.

Server-returned fields:

id (string)

playerMove ("rock" | "paper" | "scissors")

serverMove ("rock" | "paper" | "scissors")

result ("win" | "loss" | "draw")

createdAt (ISO timestamp)

POST /api/plays

Create a play (one round).

This endpoint is protected by idempotency.
If the same request is sent again with the same Idempotency-Key, the server returns the original response and does not create a new play.

Headers

Content-Type: application/json

Idempotency-Key: <string> (required)

Request body
{ "playerMove": "rock" }

Response
{
  "id": "play_1700000000000_ab12cd",
  "playerMove": "rock",
  "serverMove": "paper",
  "result": "loss",
  "createdAt": "2026-01-27T12:00:00.000Z"
}

GET /api/plays

Return all recorded plays.

Response
[
  {
    "id": "play_1700000000000_ab12cd",
    "playerMove": "rock",
    "serverMove": "paper",
    "result": "loss",
    "createdAt": "2026-01-27T12:00:00.000Z"
  }
]

GET /api/plays/stats

Return aggregated statistics for all plays.

This endpoint calculates results based on all stored plays.

Response
{
  "totalPlays": 1,
  "wins": 0,
  "losses": 1,
  "draws": 0,
  "playerMoves": {
    "rock": 1,
    "paper": 0,
    "scissors": 0
  }
}

Resource: User

A user represents a registered player.

Stored fields:

username

password (stored as a one-way hash)

createdAt

tosAcceptedAt

Passwords are never stored in plain text.

POST /api/users/register

Register a new user.

Passwords are hashed using a built-in Node.js crypto method before storage.

Request body
{
  "username": "player1",
  "password": "secret123",
  "tosAccepted": true
}

Response
{
  "ok": true,
  "user": {
    "username": "player1",
    "createdAt": "2026-01-27T12:05:00.000Z",
    "tosAcceptedAt": "2026-01-27T12:05:00.000Z"
  }
}

POST /api/users/login

Authenticate a user.

The submitted password is hashed and compared with the stored hash.

Request body
{
  "username": "player1",
  "password": "secret123"
}

Response
{
  "ok": true,
  "user": {
    "username": "player1",
    "createdAt": "2026-01-27T12:05:00.000Z",
    "tosAcceptedAt": "2026-01-27T12:05:00.000Z"
  }
}


If credentials are invalid, the server responds with status 401.

GET /api/users

Return a list of registered users.

Only non-sensitive fields are returned.

Response
{
  "ok": true,
  "users": [
    {
      "username": "player1",
      "createdAt": "2026-01-27T12:05:00.000Z",
      "tosAcceptedAt": "2026-01-27T12:05:00.000Z"
    }
  ]
}