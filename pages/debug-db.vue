<template>
  <div class="debug-page">
    <div class="debug-container">
      <h1>Database Debug</h1>
      
      <div class="debug-section">
        <h2>Connection Status</h2>
        <button @click="runDebug" class="btn-primary" :disabled="loading">
          {{ loading ? 'Running...' : 'Run Database Debug' }}
        </button>
      </div>

      <div v-if="debugResults" class="debug-results">
        <h2>Debug Results</h2>
        <pre>{{ debugResults }}</pre>
      </div>

      <div class="debug-section">
        <h2>Manual Profile Creation</h2>
        <button @click="createTestProfile" class="btn-secondary" :disabled="loading">
          Create Test Profile
        </button>
      </div>

      <div class="debug-section">
        <h2>Environment Variables</h2>
        <div class="env-info">
          <p><strong>Supabase URL:</strong> {{ supabaseUrl }}</p>
          <p><strong>Has Anon Key:</strong> {{ hasAnonKey }}</p>
        </div>
      </div>

      <div class="debug-section">
        <h2>Current User</h2>
        <div v-if="user">
          <p><strong>User ID:</strong> {{ user.id }}</p>
          <p><strong>Email:</strong> {{ user.email }}</p>
          <p><strong>Created:</strong> {{ user.created_at }}</p>
        </div>
        <div v-else>
          <p>No user logged in</p>
        </div>
      </div>

      <div class="debug-section">
        <h2>Profile Data</h2>
        <div v-if="profile">
          <pre>{{ JSON.stringify(profile, null, 2) }}</pre>
        </div>
        <div v-else>
          <p>No profile data</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { user, profile, debugDatabase } = useAuth()
const supabase = useSupabase()
const config = useRuntimeConfig()

const loading = ref(false)
const debugResults = ref('')

const supabaseUrl = config.public.supabaseUrl
const hasAnonKey = !!config.public.supabaseAnonKey

const runDebug = async () => {
  loading.value = true
  debugResults.value = ''
  
  try {
    console.log('Starting database debug...')
    
    const results = {
      timestamp: new Date().toISOString(),
      environment: {
        supabaseUrl,
        hasAnonKey,
        nodeEnv: process.env.NODE_ENV
      },
      user: user.value ? {
        id: user.value.id,
        email: user.value.email,
        created_at: user.value.created_at
      } : null,
      profile: profile.value,
      tests: {}
    }

    // Test 1: Basic connection
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      results.tests.authConnection = {
        success: true,
        user: currentUser?.id || null
      }
    } catch (error) {
      results.tests.authConnection = {
        success: false,
        error: error.message
      }
    }

    // Test 2: Check if we can query any table - using correct schema specification
    try {
      const { data, error } = await supabase
        .schema('information_schema')
        .from('tables')
        .select('table_name')
        .eq('table_schema', 'public')
        .limit(1)
      
      results.tests.basicQuery = {
        success: !error,
        data: data?.length || 0,
        error: error?.message
      }
    } catch (error) {
      results.tests.basicQuery = {
        success: false,
        error: error.message
      }
    }

    // Test 3: Check profiles table specifically
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .limit(1)
      
      results.tests.profilesTable = {
        success: !error,
        error: error?.message,
        code: error?.code
      }
    } catch (error) {
      results.tests.profilesTable = {
        success: false,
        error: error.message
      }
    }

    // Test 4: Try to list all tables - using correct schema specification
    try {
      const { data, error } = await supabase
        .schema('information_schema')
        .from('tables')
        .select('table_name')
        .eq('table_schema', 'public')
      
      results.tests.listTables = {
        success: !error,
        tables: data?.map(t => t.table_name) || [],
        error: error?.message
      }
    } catch (error) {
      results.tests.listTables = {
        success: false,
        error: error.message
      }
    }

    debugResults.value = JSON.stringify(results, null, 2)
    
    // Also run the auth debug
    await debugDatabase()
    
  } catch (error) {
    debugResults.value = `Debug failed: ${error.message}`
  } finally {
    loading.value = false
  }
}

const createTestProfile = async () => {
  if (!user.value) {
    alert('Please log in first')
    return
  }

  loading.value = true
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: user.value.id,
        email: user.value.email,
        full_name: 'Test User',
        avatar_url: null
      })
      .select()
      .single()

    if (error) {
      alert(`Error creating profile: ${error.message}`)
    } else {
      alert('Profile created successfully!')
      console.log('Created profile:', data)
    }
  } catch (error) {
    alert(`Failed to create profile: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// SEO
useHead({
  title: 'Database Debug - Ideanation',
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
})
</script>

<style scoped>
.debug-page {
  min-height: 100vh;
  padding: 40px 20px;
  background: #f8fafc;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.debug-container {
  max-width: 800px;
  margin: 0 auto;
}

.debug-container h1 {
  font-size: 32px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 32px;
}

.debug-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.debug-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #e2e8f0;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover:not(:disabled) {
  border-color: #6366f1;
  color: #6366f1;
}

.debug-results {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e2e8f0;
}

.debug-results pre {
  background: #f1f5f9;
  padding: 16px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 14px;
  line-height: 1.5;
}

.env-info p {
  margin: 8px 0;
  font-family: monospace;
  font-size: 14px;
}

.env-info strong {
  color: #374151;
}
</style>