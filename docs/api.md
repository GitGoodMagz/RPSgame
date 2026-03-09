# RPS API (REST-ish)

Base URL: same origin (served by Express)

All requests and responses use JSON.

---

## GET /api/ping

Health check endpoint.

Response

{
  "ok": true,
  "message": "pong"
}

---

## GET /api/users

List all users.

Response

{
  "users": [
    {
      "username": "player1",
      "createdAt": "ISO timestamp",
      "tosAcceptedAt": "ISO timestamp"
    }
  ]
}

---

## POST /api/users/register

Create a new user.

Headers

Content-Type: application/json

Body

{
  "username": "string",
  "password": "string",
  "tosAccepted": true
}

Response

{
  "user": {
    "username": "string",
    "createdAt": "ISO timestamp",
    "tosAcceptedAt": "ISO timestamp"
  }
}

---

## PUT /api/users/:username

Update a user password.

Headers

Content-Type: application/json

Body

{
  "password": "string"
}

Response

{
  "user": {
    "username": "string",
    "createdAt": "ISO timestamp",
    "tosAcceptedAt": "ISO timestamp"
  }
}

---

## DELETE /api/users/:username

Delete a user.

Response

{
  "user": {
    "username": "string"
  }
}

---

## Errors

Errors return JSON with an error code.

Example

{
  "error": "username_taken"
}
