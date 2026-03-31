import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

// Lazy-init singleton
let _client: SupabaseClient | null = null;

export async function getSupabaseClient() {
    if (!isSupabaseConfigured) {
        console.warn("Supabase is not configured. Check your .env or Vercel variables.");
        return null;
    }
    if (_client) return _client;

    _client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    return _client;
}