// Runs before `next build` on Vercel: pushes the Drizzle schema to the
// configured database so deploys are self-migrating. Skips silently when no
// DATABASE_URL is present (e.g. CI without a database) or when explicitly
// disabled with SKIP_DB_PUSH=1.
import { execSync } from "node:child_process";

if (!process.env.DATABASE_URL) {
  console.log("[db] DATABASE_URL not set — skipping schema push");
  process.exit(0);
}
if (process.env.SKIP_DB_PUSH === "1") {
  console.log("[db] SKIP_DB_PUSH=1 — skipping schema push");
  process.exit(0);
}

console.log("[db] pushing schema to database…");
execSync("npx drizzle-kit push --force", { stdio: "inherit" });
console.log("[db] schema is up to date");
