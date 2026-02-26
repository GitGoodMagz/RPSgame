# RPS API (REST-ish)

Base URL: Same origin (served by Express)

All requests and responses use JSON.

---

## Resource: Play

Fields:

- id (string)
- playerMove ("rock" | "paper" | "scissors")
- serverMove ("rock" | "paper" | "scissors")
- result ("win" | "loss" | "draw")
- createdAt (ISO timestamp)

---

## POST /api/plays

Create a play.

Headers:

- Content-Type: application/json
- Idempotency-Key: <string> (required)

Request body:

{
"playerMove": "rock"
}

Success (201):

{
"id": "...",
"playerMove": "rock",
"serverMove": "...",
"result": "...",
"createdAt": "..."
}

Error responses:

- 400 – Missing Idempotency-Key
- 400 – Invalid player move

Duplicate requests with the same `Idempotency-Key`
return the cached response and do not create a new play.

---

## GET /api/plays

Return all recorded plays.

Success (200):

[
{
"id": "...",
"playerMove": "...",
"serverMove": "...",
"result": "...",
"createdAt": "..."
}
]

---

## GET /api/plays/stats

Return aggregated statistics.

Success (200):

{
"totalPlays": number,
"wins": number,
"losses": number,
"draws": number,
"playerMoves": {
"rock": number,
"paper": number,
"scissors": number
}
}

---

## Resource: User

Stored fields:

- username
- password (hashed)
- createdAt
- tosAcceptedAt

Passwords are never stored in plaintext.

---

## POST /api/users/register

Register a new user.

Request body:

{
"username": "player1",
"password": "secret123",
"tosAccepted": true
}

Success (201):

{
"ok": true,
"user": {
"username": "...",
"createdAt": "...",
"tosAcceptedAt": "..."
}
}

Error responses:

- 400 – Missing username or password
- 409 – Username already taken
- 500 – Server error

---

## GET /api/users

Return all users (non-sensitive fields only).

Success (200):

{
"ok": true,
"users": [
{
"username": "...",
"createdAt": "...",
"tosAcceptedAt": "..."
}
]
}

---

## PUT /api/users/:username

Update user password.

Request body:

{
"password": "newSecret123"
}

Success (200):

{
"ok": true,
"user": {
"username": "...",
"createdAt": "...",
"tosAcceptedAt": "..."
}
}

Error responses:

- 400 – Invalid password
- 404 – User not found
- 500 – Server error

---

## DELETE /api/users/:username

Delete a user.

Success (200):

{
"ok": true,
"user": {
"username": "...",
"createdAt": "...",
"tosAcceptedAt": "..."
}
}

Error responses:

- 404 – User not found
- 500 – Server error
