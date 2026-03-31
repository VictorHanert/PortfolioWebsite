import { createClient } from '@supabase/supabase-js';

type SeedRow = {
  name: string;
  country: string;
  description: string;
  category: string[];
  budget_level: number;
  distance_category: 'Short' | 'Mid' | 'Long';
  embedding: number[];
};

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const requestOrigin = req.headers.get('origin') || '*';
  const corsHeaders = {
    'Access-Control-Allow-Origin': requestOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-seed-token',
    'Content-Type': 'application/json',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: corsHeaders,
    });
  }

  try {
    const seedToken = process.env.SEED_ADMIN_TOKEN;
    if (!seedToken) {
      return new Response(JSON.stringify({ error: 'SEED_ADMIN_TOKEN is not configured on server' }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const providedToken = req.headers.get('x-seed-token');
    if (providedToken !== seedToken) {
      return new Response(JSON.stringify({ error: 'Unauthorized seed request' }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(
        JSON.stringify({
          error:
            'Missing SUPABASE_URL/VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables',
        }),
        { status: 500, headers: corsHeaders }
      );
    }

    const body = await req.json();
    const reset = body?.reset !== false;
    const rows: SeedRow[] = Array.isArray(body?.rows) ? body.rows : [];

    if (rows.length === 0) {
      return new Response(JSON.stringify({ error: 'rows[] is required' }), {
        status: 400,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const projectRef = new URL(supabaseUrl).hostname.split('.')[0] ?? 'unknown';

    if (reset) {
      const { error: resetError } = await supabase
        .from('travel_destinations')
        .delete()
        .not('id', 'is', null);

      if (resetError) {
        return new Response(JSON.stringify({ error: `Reset failed: ${resetError.message}` }), {
          status: 500,
          headers: corsHeaders,
        });
      }
    }

    const { data: insertedRows, error: insertError } = await supabase
      .from('travel_destinations')
      .insert(rows)
      .select('id');

    if (insertError) {
      return new Response(JSON.stringify({ error: `Insert failed: ${insertError.message}` }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    const { count: rowCount, error: countError } = await supabase
      .from('travel_destinations')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      return new Response(JSON.stringify({ error: `Count failed: ${countError.message}` }), {
        status: 500,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({
        successCount: insertedRows?.length ?? rows.length,
        errorCount: 0,
        resetApplied: reset,
        projectRef,
        tableRowCount: rowCount ?? null,
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown seed error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
