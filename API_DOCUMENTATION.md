# API
GET /api/health — application liveness only, returns 200 with status, service and scope; does not assert database connectivity. No data mutation endpoints exist yet. Future endpoints must validate input, enforce role and organization scope server-side, and apply abuse protection.
