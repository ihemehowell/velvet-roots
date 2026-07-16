import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment");
}

// Service role key bypasses RLS — this client only ever runs on the server,
// never shipped to the browser. Keep it that way.
export const supabase = createClient(url, key, {
  auth: { persistSession: false },
  global: {
    fetch: (input, init) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10_000);
      return fetch(input, { ...init, signal: controller.signal }).finally(() => clearTimeout(timeout));
    },
  },
});