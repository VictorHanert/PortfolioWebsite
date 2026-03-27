// Supabase Client — Paste your project URL and anon key here.
// These are safe to include in the client bundle (they are public/anon keys).

const SUPABASE_URL = '';
const SUPABASE_ANON_KEY = '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Lazy-init so the app doesn't crash when keys are missing
let _client: any = null;

export async function getSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  if (_client) return _client;

  const { createClient } = await import('@supabase/supabase-js');
  _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return _client;
}
