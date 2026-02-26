# Project Plan – Rock Paper Scissors (RPSgame)

## Overview

RPSgame is a web-based Rock–Paper–Scissors application built with a client–server architecture.

The system consists of:

- A Single Page Application (SPA) frontend
- A REST-ish JSON API
- A router-based Express backend
- Replaceable storage implementation

---

## Client

The client is implemented as a Single Page Application served by the Express backend (same origin).

### Characteristics

- Single HTML entry point (`index.html`)
- Hash-based client-side routing
- ES Modules
- Custom Web Components
- `<template>`-based rendering
- Centralized application state
- Observer pattern for state updates
- Single fetch abstraction for all API calls
- Relative URLs only

### Structure

- UI components: `user-create`, `user-manage`
- State module
- Service/API module
- Navigation module
- Utility modules

No direct fetch calls inside UI components.

---

## Server

- Node.js with Express
- ES Modules (`.mjs`)
- Bootstrap-only server entry (`server/index.mjs`)
- API logic defined in router modules
- Static client served by Express

### Routes

- `/api/users`
- `/api/plays`
- `/api/ping`

Middleware is defined in separate modules and applied per route.

---

## API

### Users

- `POST /api/users/register`
- `GET /api/users`
- `PUT /api/users/:username`
- `DELETE /api/users/:username`

Passwords are hashed before storage.  
Sensitive fields are excluded from responses.

### Plays

- `POST /api/plays`
- `GET /api/plays`
- `GET /api/plays/stats`

Each play contains:

- id
- playerMove
- serverMove
- result
- createdAt

---

## Middleware

Idempotency middleware:

- Requires `Idempotency-Key` header
- Applied to `POST /api/plays`
- Replays cached response for duplicate requests

---

## Storage

User storage is implemented behind a storage module interface.

Current implementation:

- Persistent user storage
- In-memory play storage

Storage implementation can be replaced without changing API routes or client code.

---

## Security

- Password hashing using PBKDF2 (`crypto`)
- No plaintext password storage
- Sensitive data not returned to client
- No authentication sessions or tokens

## Deployment

The server is deployed as a Render Web Service.

A managed PostgreSQL instance on Render provides persistent storage.
