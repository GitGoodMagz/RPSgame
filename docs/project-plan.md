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

## REST API
- Game endpoint
- Auth endpoints

## PWA
- Installable app

## Offline
- Play without internet
- Sync when online

## Tasks for middleware

# Design
Define idempotency behavior
Decide how the server should handle duplicate requests by requiring an Idempotency-Key and preventing repeated processing.
# Implementation
Implement and apply idempotency middleware
Create an Express-compatible middleware that detects duplicate requests and apply it to the game-related POST endpoint.
# Documentation
Document middleware purpose and usage
Describe what problem the middleware solves, how it works, and where it is used in the application.