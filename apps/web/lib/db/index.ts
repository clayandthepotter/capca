import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// prepare:false — serverless poolers (Neon/Supabase pgbouncer) run in
// transaction mode, which doesn't support prepared statements. Harmless
// for the local docker Postgres too.
const client = postgres(process.env.DATABASE_URL!, { prepare: false });

export const db = drizzle(client, { schema });
