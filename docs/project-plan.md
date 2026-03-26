# Project Plan – Rock Paper Scissors (RPSgame)

## Overview

RPSgame is a web-based Rock–Paper–Scissors application with a client–server architecture.

Users can create an account, log in, and play against a server-generated opponent. Each user has their own game history and statistics.

## Client

Single-page application built with:

- HTML
- CSS
- ES Modules
- Web Components

Architecture principles:

- Custom elements
- `<template>` usage
- MVC-inspired separation (UI / Logic / Data)
- Observer pattern for state
- Single centralized fetch abstraction
- Relative URLs only

### Main views

**Access account**

- Register new account
- Log in to existing account

**Game**

- Play Rock / Paper / Scissors
- View latest round result
- View personal statistics

**Manage account**

- Change password
- Delete account
- View account metadata

**ADMIN**

- hardcoded
- can see/manage all current accounts
- can not play the game, only for management

## Server

Node.js server using:

- Express
- ES Modules (.mjs)
- Router-based API structure

API routes:

- /api/users
- /api/plays
- /api/ping

Responsibilities:

- authentication
- user management
- gameplay logic
- per-user statistics tracking

## Database

PostgreSQL database.

Stores:

- users
- user_play_history

Each play is linked to a username, ensuring per-user game history and statistics.

Passwords are hashed before storage.

## Gameplay

Flow:

1. player chooses move
2. server generates move
3. result is calculated
4. play stored for the authenticated user
5. user-specific statistics updated

## Authentication

Login creates a session stored in localStorage containing:

- token
- username

The token is used for authenticated API requests.

## Account metadata

Each account stores:

- creation date
- Terms of Service acceptance
- Privacy Policy acceptance

Metadata is shown in the manage account view.

## PWA

Supports:

- manifest
- service worker
- offline capability

Service worker is disabled during localhost development.
