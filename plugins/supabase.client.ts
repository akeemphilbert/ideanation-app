export default defineNuxtPlugin(async () => {
  // Initialize Supabase client on app start
  const supabase = useSupabase()
  
  // Get initial session
  const { data: { session } } = await supabase.auth.getSession()
  
  // Provide session to the app
  return {
    provide: {
      supabase,
      session
    }
  }
})