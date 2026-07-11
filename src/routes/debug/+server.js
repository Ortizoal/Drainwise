import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { SUPABASE_SERVICE_ROLE_KEY } from '$env/static/private';

export function GET() {
  return new Response(JSON.stringify({
    public_url: PUBLIC_SUPABASE_URL ? 'set' : 'missing',
    anon_key: PUBLIC_SUPABASE_ANON_KEY ? 'set' : 'missing',
    service_role: SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'missing',
    node_version: process.version,
  }, null, 2), {
    headers: { 'content-type': 'application/json' }
  });
}
