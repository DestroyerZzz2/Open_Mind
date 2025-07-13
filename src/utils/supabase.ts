import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_CONFIG } from './supabase-config'

// Create a single client instance that will be reused
const originalClient = createBrowserClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
)

// Wrap the auth.getUser method to add debugging
const originalGetUser = originalClient.auth.getUser.bind(originalClient.auth)
originalClient.auth.getUser = async () => {
  console.log('🚨 AUTH.GETUSER() CALLED FROM:', new Error().stack)
  return originalGetUser()
}

const supabaseClient = originalClient

export function createClient() {
  return supabaseClient
}

// Export the client directly for components that need a stable reference
export { supabaseClient }
