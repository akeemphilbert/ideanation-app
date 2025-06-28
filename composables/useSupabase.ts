import { createClient } from '@supabase/supabase-js'

let supabase: ReturnType<typeof createClient> | null = null

export const useSupabase = () => {
  if (!supabase) {
    const config = useRuntimeConfig()
    
    supabase = createClient(
      config.public.supabaseUrl,
      config.public.supabaseAnonKey,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true
        }
      }
    )
  }
  
  return supabase
}

// Server-side Supabase client with service role key
export const useSupabaseServer = () => {
  const config = useRuntimeConfig()
  
  return createClient(
    config.public.supabaseUrl,
    config.supabaseServiceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}