# API
GET /api/health: application liveness only.
POST /api/auth/login: URL-encoded email and password, exact same-origin required; 303 on successful login or invalid/rate-limited credentials, 403 invalid origin, 503 unconfigured/unavailable database. HttpOnly SameSite=Lax session cookie; Secure and __Host- prefix in production. POST /api/auth/logout: same origin required, revoke database session, clear cookie on success. /admin, /agent, /app enforce distinct roles on the server.
