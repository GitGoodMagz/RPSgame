## Testing

The middleware was tested manually using HTTP requests.

- A POST request to `/api/play` with a unique `Idempotency-Key` is accepted.
- Repeating the same request with the same key results in a rejected request.

This confirms that duplicate requests are detected and blocked before reaching the route handler.
