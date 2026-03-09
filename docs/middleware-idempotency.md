## Testing

The middleware was tested manually using HTTP requests.

- A POST request to `/api/plays` with a unique `Idempotency-Key` is accepted.
- Repeating the same request with the same key returns the cached response.

This confirms that duplicate requests are handled before the route creates a new play.
