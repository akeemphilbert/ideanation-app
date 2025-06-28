import type { User, Session } from '@supabase/supabase-js'

interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export const useAuth = () => {
  const supabase = useSupabase()
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const profile = ref<Profile | null>(null)
  const loading = ref(true)

  // Initialize auth state
  const initAuth = async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      session.value = currentSession
      user.value = currentSession?.user ?? null
      
      if (currentSession?.user) {
        await fetchProfile()
      }
    } catch (error) {
      console.error('Error getting session:', error)
    } finally {
      loading.value = false
    }
  }

  // Fetch user profile
  const fetchProfile = async () => {
    if (!user.value) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      profile.value = data
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, currentSession) => {
      session.value = currentSession
      user.value = currentSession?.user ?? null
      
      if (currentSession?.user) {
        await fetchProfile()
      } else {
        profile.value = null
      }
      
      loading.value = false
    }
  )

  // Sign up with email and password
  const signUp = async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
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

  // Sign in with Google
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  }

  // Sign in with GitHub
  const signInWithGitHub = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  }

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (!error) {
      user.value = null
      session.value = null
      profile.value = null
    }
    return { error }
  }

  // Reset password
  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    })
    return { data, error }
  }

  // Update password
  const updatePassword = async (password: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password
    })
    return { data, error }
  }

  // Update profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user.value) return { error: new Error('No user logged in') }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.value.id)
      .select()
      .single()

    if (!error && data) {
      profile.value = data
    }

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
    profile: readonly(profile),
    loading: readonly(loading),
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGitHub,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    fetchProfile
  }
}