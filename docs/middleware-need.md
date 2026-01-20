The application is a PWA and will work offline.

When reconnecting, the client can retry requests.

Retried requests can cause duplicate game results.

The middleware prevents duplicate processing using an Idempotency-Key.

This keeps game data correct without adding more logic.