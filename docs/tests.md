# Testing

## Static content

Tested:

/ToS.html
/dataPrivacyPolicy.html

Result

Pages load correctly.

Meaning

Terms of Service and Data Privacy Policy are available to users before creating an account.

---

## API availability

Tested

GET /api/ping

Result

{ "ok": true, "message": "pong" }

Meaning

Server is running and API is reachable.

---

## User creation

Tested

POST /api/users/register

Result

User is created when valid data is provided.

Meaning

User registration works correctly.

---

## User listing

Tested

GET /api/users

Result

Returns a list of users.

Meaning

Stored users can be retrieved from the API.

---

## User update

Tested

PUT /api/users/:username

Result

User password updates successfully.

Meaning

User editing works.

---

## User deletion

Tested

DELETE /api/users/:username

Result

User is removed.

Meaning

User data can be deleted from the system.

---

## Play creation

Tested

POST /api/plays with Idempotency-Key

Result

A play is created and duplicate retries return the cached response.

Meaning

Idempotency protection works for play creation.

---

## Play statistics

Tested

GET /api/plays/stats

Result

Returns aggregated play statistics.

Meaning

Play statistics are available through the API.
