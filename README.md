# Rock Paper Scissors (RPSgame)

A web-based Rock–Paper–Scissors application built with a client–server architecture.

## Live Application

https://rpsgame-ml6j.onrender.com

## Features

Feature map:  
https://miro.com/app/board/uXjVGO2CLQc=/?share_link_id=92355642496

- User registration and login
- Play against server (bot)
- Per-user game history and statistics
- Account management (change password, delete account)

## Architecture

The project consists of:

- Single Page Application (SPA) client
- Express-based REST-ish API
- Router-based backend
- PostgreSQL persistent storage

## Internationalization

The application supports multiple languages.

Supported languages:

- English (`en`)
- Norwegian (`nb`)

Both server-side and client-side error messages are localized based on the browser language.

Server language detection uses the `Accept-Language` request header.

Client language detection uses `navigator.languages`.

## Progressive Web App

The application is installable as a Progressive Web App.

Implemented features:

- Web App Manifest
- Service Worker
- App shell caching
- Offline fallback page

## Accessibility

Accessibility improvements follow WCAG guidelines.

Implemented improvements:

- Semantic HTML structure
- Accessible form labels
- Keyboard navigation support
- Focus indicators
- ARIA live regions for dynamic status messages

The application scores **100 in Lighthouse Accessibility**.

## Project Plan

See: `docs/project-plan.md`

## API Documentation

See: `docs/api.md`

## Tech Stack

- JavaScript (ES Modules)
- Node.js
- Express
- PostgreSQL
- Web Components
- Service Worker
