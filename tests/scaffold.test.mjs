import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
const read = (path) => readFileSync(new URL("../" + path, import.meta.url), "utf8");
test("required application entry points exist", () => {
  for (const file of ["src/app/layout.tsx","src/app/page.tsx","src/app/about/page.tsx","src/app/api/health/route.ts","src/app/robots.ts"]) assert.ok(existsSync(new URL("../" + file, import.meta.url)), file);
});
test("demo is not presented as actual property offers and requests no indexing", () => {
  assert.match(read("src/app/page.tsx"), /fictional real-estate platform/);
  assert.match(read("src/app/layout.tsx"), /index: false/);
  assert.match(read("next.config.ts"), /noindex, nofollow/);
});
test("environment template contains no credentials", () => {
  for (const line of read(".env.example").split("\n")) if (line && !line.startsWith("#")) assert.match(line, /^[A-Z_]+=$/);
  assert.match(read(".gitignore"), /\.env\*/);
});
