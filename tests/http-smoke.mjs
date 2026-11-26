import assert from "node:assert/strict";
const origin = process.env.TEST_ORIGIN || "http://localhost:3000";
for (const path of ["/", "/about", "/robots.txt", "/api/health"]) {
  const res = await fetch(origin + path);
  assert.equal(res.status, 200, path);
  assert.match(res.headers.get("x-robots-tag") || "", /noindex/);
  if (path === "/api/health") assert.equal((await res.json()).scope, "application-liveness");
  else if (path === "/") assert.match(await res.text(), /fictional real-estate platform/);
}
console.log("HTTP smoke tests passed");
