export function GET() {
  return Response.json({ status: "ok", service: "indore-prime-properties", scope: "application-liveness" }, { headers: { "Cache-Control": "no-store" } });
}
