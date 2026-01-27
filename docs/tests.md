Testing

Static content

Tested /tos.html and /dataPrivacyPolicy.html
Result: Pages load correctly
Meaning: Terms of Service and Data Privacy Policy are accessible to users before consent.

API availability

Tested GET /api/ping
Result: { "ok": true, "message": "pong" }
Meaning: Server is running and API is reachable.

Idempotency

Tested POST /api/plays twice with the same Idempotency-Key
Result: First request 201 Created, second request 409 Conflict
Meaning: Duplicate requests are correctly rejected.

User creation with consent

Tested POST /api/users with acceptToS: true
Result: 201 Created with user data and token
Meaning: Users can be created through the API when active consent is given.

User creation without consent

Tested POST /api/users with acceptToS: false
Result: 400 Bad Request
Meaning: Active consent is required before account creation.

Authenticated user access

Tested GET /api/users/me with valid token
Result: 200 OK
Meaning: Token correctly identifies and authenticates the user.

Account deletion / consent retraction

Tested DELETE /api/users/me
Result: 204 No Content
Meaning: Users can delete their account and retract consent.

Token invalidation

Tested GET /api/users/me after account deletion
Result: 401 Unauthorized
Meaning: Tokens are invalidated after account deletion.