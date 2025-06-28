<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <h1 class="login-title handwritten">Welcome to Ideanation</h1>
        <p class="login-subtitle">Sign in to start building your startup ideas</p>
        
        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              class="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-input"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <button
            type="submit"
            class="btn-sketch btn-primary login-button"
            :disabled="loading"
          >
            {{ isSignUp ? 'Sign Up' : 'Sign In' }}
          </button>
          
          <div class="form-toggle">
            <button
              type="button"
              class="toggle-button"
              @click="isSignUp = !isSignUp"
            >
              {{ isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up" }}
            </button>
          </div>
        </form>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { signIn, signUp } = useAuth()
const router = useRouter()

const email = ref('')
const password = ref('')
const isSignUp = ref(false)
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const { error: authError } = isSignUp.value
      ? await signUp(email.value, password.value)
      : await signIn(email.value, password.value)
    
    if (authError) {
      error.value = authError.message
    } else {
      // Redirect to canvas page on successful auth
      await router.push('/canvas')
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Auth error:', err)
  } finally {
    loading.value = false
  }
}

// Redirect if already authenticated
const { user } = useAuth()
watch(user, (newUser) => {
  if (newUser) {
    router.push('/canvas')
  }
})

// SEO
useHead({
  title: 'Login - Ideanation',
  meta: [
    { name: 'description', content: 'Sign in to Ideanation to start building your startup ideas.' }
  ]
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #fefefe 0%, #f8f8f8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border: 3px solid var(--color-primary);
  border-radius: 8px;
  padding: 2rem;
  transform: rotate(-0.5deg);
  box-shadow: 8px 8px 0px rgba(0,0,0,0.1);
}

.login-title {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: var(--color-primary);
  text-align: center;
}

.login-subtitle {
  text-align: center;
  color: var(--color-secondary);
  margin-bottom: 2rem;
  font-family: var(--font-handwritten);
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-family: var(--font-handwritten);
  font-weight: 600;
  color: var(--color-primary);
}

.form-input {
  padding: 12px;
  border: 2px solid var(--color-primary);
  border-radius: 4px;
  font-family: var(--font-handwritten);
  font-size: 1rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
  transform: rotate(0deg);
}

.login-button {
  width: 100%;
  padding: 12px;
  font-size: 1.1rem;
  margin-top: 1rem;
}

.form-toggle {
  text-align: center;
  margin-top: 1rem;
}

.toggle-button {
  background: none;
  border: none;
  color: var(--color-secondary);
  font-family: var(--font-handwritten);
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s ease;
}

.toggle-button:hover {
  color: var(--color-primary);
}

.error-message {
  background: #ffebee;
  border: 1px solid #f44336;
  border-radius: 4px;
  padding: 12px;
  margin-top: 1rem;
  color: #d32f2f;
  font-family: var(--font-handwritten);
  text-align: center;
}

@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
    transform: rotate(0deg);
  }
  
  .login-title {
    font-size: 1.5rem;
  }
}
</style>