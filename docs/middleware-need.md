The application is a PWA and can continue working with cached content.

When the client reconnects, requests may be retried.

Retried play requests can otherwise create duplicate play records.

The middleware uses an `Idempotency-Key` to prevent duplicate processing.

This keeps stored play data correct without adding duplicate-handling logic to the route.
