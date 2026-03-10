# Project Plan – Rock Paper Scissors (RPSgame)

## Overview
RPSgame is a web-based Rock–Paper–Scissors application with a client–server architecture.

Users can create an account, log in, and play Rock–Paper–Scissors against a server-generated opponent (bot). Each round is stored and statistics are tracked per user.

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
- Choose login or create account
- Register a new account
- Log in to an existing account

**Game**
- Play Rock / Paper / Scissors
- See latest round result
- See total statistics

**Manage account**
- Change password
- Delete account
- View account metadata

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
- statistics tracking

## Database

PostgreSQL database.

Stores:

- users
- game plays

Passwords are hashed before storage.

## Gameplay

The player plays against a server-generated move.

Flow:

1. player chooses move
2. server generates move
3. server calculates result
4. play stored in database
5. statistics updated

Moves:

- rock
- paper
- scissors

Results:

- win
- loss
- draw

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

The project supports Progressive Web App features:

- manifest
- service worker
- offline capability

Service worker is disabled during localhost development.

## Future improvements

Possible future features:

- multiplayer matches
- player lobby
- player challenges
- live matches
