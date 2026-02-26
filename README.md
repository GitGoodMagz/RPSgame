# Rock Paper Scissors (RPSgame)

A web-based Rock–Paper–Scissors application built with a structured client–server architecture.

---

## Live Deployment

Application URL:  
https://rpsgame-ml6j.onrender.com

The application is deployed as a Render Web Service.

User data is stored persistently in a PostgreSQL database hosted on Render.

---

## Architecture

### Client

- Single Page Application (SPA)
- Custom Web Components
- ES Modules
- Centralized state using the Observer pattern
- Single fetch abstraction for API communication
- Relative URLs only

### Server

- Node.js with Express
- Router-based API structure
- Middleware separated into modules
- REST-ish JSON API

---

## Storage

- User accounts stored in PostgreSQL (Render)
- Play data stored in memory (non-persistent)

---

## Documentation

- Project Plan: `docs/project-plan.md`
- API Documentation: `docs/api.md`

---

## Tech Stack

- JavaScript (ES Modules)
- Node.js
- Express
- PostgreSQL
- Render (Web Service + Database)
- Web Components
