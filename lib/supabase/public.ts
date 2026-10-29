import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, assertSupabaseEnv } from "@/lib/env";

/**
 * Cookie-less client for reading the portal's public, read-only data.
 *
 * The portal has no authentication, so public reads do not need the
 * cookie-based SSR client in ./server.ts. Not touching cookies lets the
 * read functions run inside `"use cache"` and be prerendered.
 */
export function createPublicClient() {
  assertSupabaseEnv();
  return createSupabaseClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
