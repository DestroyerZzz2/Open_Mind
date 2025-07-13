import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_CONFIG } from './supabase-config'

// Create a single client instance that will be reused
const originalClient = createBrowserClient(
  SUPABASE_CONFIG.url,
  SUPABASE_CONFIG.anonKey
)

// Counter to track auth requests
let authCallCount = 0

// Wrap the auth.getUser method to add debugging
const originalGetUser = originalClient.auth.getUser.bind(originalClient.auth)
originalClient.auth.getUser = async () => {
  authCallCount++
  if (authCallCount % 10 === 0) { // Log every 10th call to reduce spam in console
    console.log(`🔥 AUTH REQUEST #${authCallCount} - CALLED FROM:`, new Error().stack?.split('\n')[2])
  }
  return originalGetUser()
}

const supabaseClient = originalClient

export function createClient() {
  return supabaseClient
}

// Export the client directly for components that need a stable reference
export { supabaseClient }
