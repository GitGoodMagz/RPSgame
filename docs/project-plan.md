# Project Plan – Rock Paper Scissors (RPSgame)

## Overview

Web-based Rock–Paper–Scissors application implemented with a client–server architecture.

## Client

- Single-page client using HTML, CSS, and ES modules
- Served by the Express server (same origin)
- UI built with custom Web Components
- Uses relative URLs
- One shared fetch function for all API calls
- Code separated into state/observer, API/service layer, navigation, utilities, and Web Components
- Views split into separate pages: createUser.html and manageUser.html are separate view files, with index.html as the entry/redirect.

### Implemented

- User creation with Terms of Service and Privacy Policy acceptance
- Modal display of Terms of Service and Data Privacy Policy
- List users
- Edit user password
- Delete user
- Client-side state handling and view switching
- UI logic prevents invalid actions (no edit/delete without users)

## Server

- Node.js with Express
- Uses ES Modules (`.mjs`)
- REST-ish API
- Serves static client files

## User Accounts

- Create, update, and delete users
- User data stored in a local JSON file
- Passwords hashed before storage

### Password handling

- `bcrypt` initially tested
- Refactored to Node.js built-in `crypto` with PBKDF2
- External dependency removed

## REST-ish API

### Users

- `POST /api/users/register`
- `GET /api/users`
- `PUT /api/users/:username`
- `DELETE /api/users/:username`

### Plays

- `POST /api/plays`
- `GET /api/plays`
- `GET /api/plays/stats`

## Middleware

- Custom idempotency middleware implemented
- Uses `Idempotency-Key`
- Applied to play creation endpoint

## API Scaffold & Testing

- Express routes implemented for plays and stats
- In-memory storage for game data
- Bruno test collection included
- API documented in `docs/api.md`

## Module System Migration

- Migrated from CommonJS to ES Modules
- Temporary duplicate `package.json` and `package-lock.json` created during migration
- Project structure consolidated to a single root scope

## Storage

- Users stored in a local JSON file
- Plays stored in memory

## Current State

- Server API complete
- User system complete
- Client user management implemented
- Refactored client structure for readability: the previous single app.mjs file was split into multiple ES module files under client/app/ (state/observer logic, API and user service, navigation, shared DOM helpers, and Web Components). client/app.mjs now acts only as the entry point that imports and wires these modules together.
