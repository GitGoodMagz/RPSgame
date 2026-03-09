# Project Plan – Rock Paper Scissors (RPSgame)

## Overview

RPSgame is a web-based Rock–Paper–Scissors application built with a client–server architecture.

The system consists of:

- A Single Page Application (SPA) frontend
- A REST-ish JSON API
- A router-based Express backend
- PostgreSQL persistent storage
- Progressive Web App capabilities

---

## Client

The client is implemented as a Single Page Application served by the Express backend.

### Characteristics

- Single HTML entry point (`index.html`)
- Hash-based client-side routing
- ES Modules
- Custom Web Components
- `<template>`-based rendering
- Centralized application state
- Observer pattern for state updates
- Single fetch abstraction for API calls
- Relative URLs only

### UI Components

- `user-create`
- `user-manage`

### Modules

- state management
- API service layer
- navigation module
- DOM helpers
- internationalization module

---

## Internationalization

The application supports multiple languages.

Supported languages:

- English (`en`)
- Norwegian (`nb`)

Server responses use the `Accept-Language` request header.

Client-side UI text and error messages use the browser language via `navigator.languages`.

---

## Progressive Web App

The application is installable as a Progressive Web App.

Implementation includes:

- Web App Manifest
- Service Worker
- App shell caching
- Offline fallback page

---

## Accessibility

Accessibility improvements follow WCAG guidelines.

Implemented improvements include:

- Semantic HTML structure
- Accessible form labels
- Keyboard navigation
- Focus indicators
- ARIA live regions for dynamic status messages

The application achieves a Lighthouse accessibility score of **100**.

---

## Server

The backend is built with Node.js and Express.

### Characteristics

- ES Modules (`.mjs`)
- Router-based API structure
- Static client served by Express
- Middleware modules separated from routes

### Routes

- `/api/users`
- `/api/plays`
- `/api/ping`

---

## Storage

Application data is stored in PostgreSQL hosted on Render.

User accounts and play records are stored persistently in the database.

The server connects using the `DATABASE_URL` environment variable.

---

## Security

- Password hashing using PBKDF2 (`crypto`)
- No plaintext password storage
- Sensitive data not returned to client
- No authentication sessions or tokens
