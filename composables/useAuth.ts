import type { User, Session } from '@supabase/supabase-js'

export const useAuth = () => {
  const supabase = useSupabase()
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(true)

  // Initialize auth state
  const initAuth = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      session.value = currentSession
      user.value = currentSession?.user ?? null
    } catch (error) {
      console.error('Error getting session:', error)
    } finally {
      loading.value = false
    }
  }

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, currentSession) => {
      session.value = currentSession
      user.value = currentSession?.user ?? null
      loading.value = false
    }
  )

  // Sign up with email and password
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })
    return { data, error }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  }

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    return { data, error }
  }

  // Update password
  const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    return { data, error }
  }

  // Initialize on composable creation
  onMounted(() => {
    initAuth()
  })

  // Cleanup subscription on unmount
  onUnmounted(() => {
    subscription?.unsubscribe()
  })

  return {
    user: readonly(user),
    session: readonly(session),
    loading: readonly(loading),
    signUp,
    signIn,
    signOut,
    resetPassword,
    updatePassword
  }
}