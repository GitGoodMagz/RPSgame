# Project Plan – Rock Paper Scissors (RPSgame)

## Overview

RPSgame is a web-based Rock–Paper–Scissors application implemented with a client–server architecture.

The project currently focuses on account management and application infrastructure.

The system consists of:

- A Single Page Application (SPA) frontend
- A REST-ish JSON API
- A router-based Express backend
- PostgreSQL persistent storage
- Progressive Web App capabilities

---

## Client

The client is implemented using:

- HTML
- CSS
- JavaScript ES modules
- Web Components

Architecture principles:

- MVC-inspired separation
- Observer pattern for shared state
- Single fetch abstraction for API calls
- `<template>`-based UI components
- Relative URLs

Features implemented:

- Create user
- List users
- Update user password
- Delete user
- Terms of Service consent
- Internationalization (English / Norwegian)
- Accessible UI
- Progressive Web App support

---

## Server

The backend uses:

- Node.js
- Express
- Router-based API structure
- Middleware for request handling
- PostgreSQL storage

Responsibilities:

- User management
- Password hashing
- API validation
- Error handling
- Idempotency protection for retryable requests

---

## Data

User accounts store:

- username
- password hash
- account creation time
- Terms of Service acceptance timestamp

Passwords are never stored in plain text.

---

## Progressive Web App

The application supports installation as a PWA.

Features:

- Web App Manifest
- Service Worker
- App shell caching
- Offline fallback page
