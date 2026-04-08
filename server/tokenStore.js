import pg from "pg";

const { Pool } = pg;
const TOKEN_ROW_ID = "instagram";

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const pool = hasDatabaseUrl
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : null;

let schemaReady = false;

async function ensureSchema() {
  if (!pool || schemaReady) return;

  await pool.query(`
    CREATE TABLE IF NOT EXISTS instagram_token_state (
      id TEXT PRIMARY KEY,
      client_token TEXT NOT NULL,
      last_refresh BIGINT NOT NULL
    )
  `);

  schemaReady = true;
}

export function isTokenStoreEnabled() {
  return Boolean(pool);
}

export async function getTokenState() {
  if (!pool) return null;

  await ensureSchema();

  const result = await pool.query(
    "SELECT client_token, last_refresh FROM instagram_token_state WHERE id = $1",
    [TOKEN_ROW_ID],
  );

  return result.rows[0] || null;
}

export async function upsertTokenState(clientToken, lastRefresh = Date.now()) {
  if (!pool) return false;

  await ensureSchema();

  await pool.query(
    `INSERT INTO instagram_token_state (id, client_token, last_refresh)
     VALUES ($1, $2, $3)
     ON CONFLICT (id)
     DO UPDATE SET
       client_token = EXCLUDED.client_token,
       last_refresh = EXCLUDED.last_refresh`,
    [TOKEN_ROW_ID, clientToken, lastRefresh],
  );

  return true;
}
