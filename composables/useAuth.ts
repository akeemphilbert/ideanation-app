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

  // Fetch user profile with better error handling
  const fetchProfile = async () => {
    if (!user.value) return

    try {
      console.log('Fetching profile for user:', user.value.id)
      
      // First, let's check if the table exists by trying a simple query
      const { data: tableCheck, error: tableError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)

      if (tableError) {
        console.error('Profiles table check failed:', tableError)
        
        // If table doesn't exist, we'll create a minimal profile in memory
        profile.value = {
          id: user.value.id,
          email: user.value.email || '',
          full_name: user.value.user_metadata?.full_name || null,
          avatar_url: user.value.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        return
      }

      // If table exists, try to fetch the profile
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.value.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Profile doesn't exist, create one
          console.log('Profile not found, creating new profile')
          await createProfile()
        } else {
          console.error('Error fetching profile:', error)
          throw error
        }
      } else {
        profile.value = data
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error)
      
      // Fallback: create profile from user metadata
      if (user.value) {
        profile.value = {
          id: user.value.id,
          email: user.value.email || '',
          full_name: user.value.user_metadata?.full_name || null,
          avatar_url: user.value.user_metadata?.avatar_url || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    }
  }

  // Create profile if it doesn't exist
  const createProfile = async () => {
    if (!user.value) return

    try {
      const profileData = {
        id: user.value.id,
        email: user.value.email || '',
        full_name: user.value.user_metadata?.full_name || null,
        avatar_url: user.value.user_metadata?.avatar_url || null
      }

      const { data, error } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        // Use fallback profile
        profile.value = {
          ...profileData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      } else {
        profile.value = data
      }
    } catch (error) {
      console.error('Error in createProfile:', error)
    }
  }

  // Listen for auth changes
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    async (event, currentSession) => {
      console.log('Auth state changed:', event, currentSession?.user?.id)
      
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
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      })
      
      console.log('Sign up result:', { data, error })
      return { data, error }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    }
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      console.log('Sign in result:', { data, error })
      return { data, error }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    }
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

    try {
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
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    }
  }

  //function for getting the access token
  const getAccessToken = async () => {
    const { data, error } = await supabase.auth.getSession()
    return data.session?.access_token
  }

  //function for getting the user from the access token
  const getUserFromToken = async (token: string) => {
    const { data, error } = await supabase.auth.getUser(token)
    return data.user
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
    fetchProfile,
    createProfile,
    getAccessToken,
    getUserFromToken
  }
}