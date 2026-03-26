# API Documentation – RPSgame

## Base URL

/api

---

## Authentication

Protected endpoints require authentication using:

Authorization: Bearer <token>

---

## Users

### POST /api/users

Create user

Request:
{
"username": "string",
"password": "string",
"tosAccepted": true
}

---

### POST /api/users/login

Login user

Request:
{
"username": "string",
"password": "string"
}

Response:
{
"username": "string",
"createdAt": "string",
"tosAcceptedAt": "string",
"isAdmin": false
}

---

### GET /api/users/me

Get current user (requires auth)

---

### PATCH /api/users/:username

Update user (password) (requires auth)

---

### DELETE /api/users/:username

Delete user (requires auth)

---

## Plays

### POST /api/plays

Create a play for the authenticated user (requires auth)

Request:
{
"playerMove": "rock | paper | scissors"
}

Response:
{
"id": "string",
"username": "string",
"playerMove": "string",
"serverMove": "string",
"result": "win | loss | draw",
"createdAt": "string"
}

---

### GET /api/plays/stats

Get statistics for the authenticated user (requires auth)

Response:
{
"totalPlays": number,
"wins": number,
"losses": number,
"draws": number
}

---

## Ping

### GET /api/ping

Response:
{
"message": "pong"
}

---

## Errors

Common responses:

- 400 Bad Request – invalid input
- 401 Unauthorized – missing or invalid token
- 403 Forbidden – not allowed
- 404 Not Found – resource not found
- 409 Conflict – username already exists

# API Tests

API endpoints are tested using Bruno.

Test files are located in:

server/tests/bruno

Tests include:

- create user
- login
- logout
- edit user
- delete user
- create play
- get stats
- ping

Tests verify:

- correct responses
- authentication behaviour
- database updates
- statistics calculation
