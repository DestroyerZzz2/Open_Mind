import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_CONFIG } from './supabase-config'

// Create a single client instance that will be reused
const supabaseClient = createBrowserClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
)

export function createClient() {
  return supabaseClient
}

// Export the client directly for components that need a stable reference
export { supabaseClient }
