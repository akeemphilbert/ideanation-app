<template>
  <div class="auth-callback">
    <div class="callback-container">
      <div class="callback-content">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <h2>Completing sign in...</h2>
        <p>Please wait while we redirect you.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const route = useRoute()

onMounted(async () => {
  // Handle the auth callback
  const { data, error } = await useSupabase().auth.getSession()
  
  if (error) {
    console.error('Auth callback error:', error)
    await router.push('/login?error=auth_callback_failed')
    return
  }

  if (data.session) {
    // Successful authentication, redirect to canvas or intended page
    const redirectTo = route.query.redirect as string || '/canvas'
    await router.push(redirectTo)
  } else {
    // No session, redirect to login
    await router.push('/login')
  }
})

// SEO
useHead({
  title: 'Completing Sign In - Ideanation',
  meta: [
    { name: 'robots', content: 'noindex' }
  ]
})
</script>

<style scoped>
.auth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.callback-container {
  max-width: 400px;
  width: 100%;
  padding: 0 24px;
}

.callback-content {
  background: white;
  border-radius: 16px;
  padding: 48px 32px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.loading-spinner {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top: 3px solid #6366f1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.callback-content h2 {
  font-size: 24px;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 8px;
}

.callback-content p {
  color: #64748b;
  font-size: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>