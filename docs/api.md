# API Documentation – RPSgame

Base path:

/api

## Users API

Create user

POST /api/users

Body:

{
  "username": "player",
  "password": "password"
}

Login

POST /api/users/login

Body:

{
  "username": "player",
  "password": "password"
}

Logout

POST /api/users/logout

Requires authentication.

Edit user password

PATCH /api/users/:username

Delete user

DELETE /api/users/:username

## Plays API

Create play

POST /api/plays

Body:

{
  "move": "rock"
}

Server generates opponent move and returns the result.

Get statistics

GET /api/plays/stats

Returns:

- total plays
- wins
- losses
- draws
