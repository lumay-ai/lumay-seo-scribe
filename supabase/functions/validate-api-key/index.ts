import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { provider, api_key } = await req.json();

    if (!provider || !api_key) {
      return new Response(JSON.stringify({ valid: false, error: 'Provider and API key are required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let valid = false;
    let error = '';

    if (provider === 'openai') {
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${api_key}` },
      });
      const body = await res.text();
      if (res.ok) {
        valid = true;
      } else {
        error = res.status === 401 ? 'Invalid API key' : `OpenAI error: ${res.status}`;
      }
    } else if (provider === 'gemini') {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models?key=${api_key}`
      );
      const body = await res.text();
      if (res.ok) {
        valid = true;
      } else {
        error = res.status === 400 || res.status === 403 ? 'Invalid API key' : `Gemini error: ${res.status}`;
      }
    } else if (provider === 'anthropic') {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': api_key,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1,
          messages: [{ role: 'user', content: 'Hi' }],
        }),
      });
      const body = await res.text();
      if (res.ok || res.status === 200) {
        valid = true;
      } else if (res.status === 401) {
        error = 'Invalid API key';
      } else {
        // Any other response means the key was accepted (e.g. 400 for bad model is still a valid key)
        valid = true;
      }
    } else if (provider === 'openrouter') {
      const res = await fetch('https://openrouter.ai/api/v1/auth/key', {
        headers: { Authorization: `Bearer ${api_key}` },
      });
      const body = await res.text();
      if (res.ok) {
        valid = true;
      } else {
        error = res.status === 401 ? 'Invalid API key' : `OpenRouter error: ${res.status}`;
      }
    } else {
      error = `Unsupported provider: ${provider}`;
    }

    return new Response(JSON.stringify({ valid, error: valid ? undefined : error }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('Validate API key error:', e);
    return new Response(JSON.stringify({ valid: false, error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
