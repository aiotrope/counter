import { serve } from './deps.js';
import { sql } from './database.js';

const handleRequest = async (request) => {
  let now = Date.now();

  let dateString = new Date(now);

  await sql`INSERT INTO visit_log (created_at) VALUES (TO_TIMESTAMP(${now} / 1000.0))`;

  const rows = await sql`SELECT COUNT(*) FROM visit_log`;

  const count = rows[0].count;

  const hello = `Hello from server -- date: ${dateString} -- count: ${count}`;

  return new Response(hello);
};

const portConfig = { hostname: '0.0.0.0', port: 7777 };

serve(handleRequest, portConfig);

// Deno.serve({ hostname: '0.0.0.0', port: 7777 }, handleRequest);
