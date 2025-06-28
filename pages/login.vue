<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <!-- Header -->
        <div class="login-header">
          <div class="brand-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="8" cy="8" r="3" fill="#6366f1" stroke="#4f46e5" stroke-width="1.5"/>
              <circle cx="24" cy="8" r="3" fill="#06b6d4" stroke="#0891b2" stroke-width="1.5"/>
              <circle cx="16" cy="24" r="3" fill="#10b981" stroke="#059669" stroke-width="1.5"/>
              <line x1="11" y1="8" x2="21" y2="8" stroke="#6b7280" stroke-width="1.5"/>
              <line x1="10" y1="11" x2="14" y2="21" stroke="#6b7280" stroke-width="1.5"/>
              <line x1="22" y1="11" x2="18" y2="21" stroke="#6b7280" stroke-width="1.5"/>
            </svg>
          </div>
          <h1 class="login-title">Welcome to Ideanation</h1>
          <p class="login-subtitle">
            {{ isSignUp ? 'Create your account to start building' : 'Sign in to continue building' }}
          </p>
        </div>

        <!-- Social Login -->
        <div class="social-login">
          <button 
            class="social-btn google-btn" 
            @click="handleGoogleSignIn"
            :disabled="loading"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
          
          <button 
            class="social-btn github-btn" 
            @click="handleGitHubSignIn"
            :disabled="loading"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            Continue with GitHub
          </button>
        </div>

        <!-- Divider -->
        <div class="divider">
          <span>or</span>
        </div>

        <!-- Email Form -->
        <form @submit.prevent="handleSubmit" class="login-form">
          <div class="form-group" v-if="isSignUp">
            <label for="fullName" class="form-label">Full Name</label>
            <input
              id="fullName"
              v-model="fullName"
              type="text"
              class="form-input"
              placeholder="Enter your full name"
              :required="isSignUp"
            />
          </div>

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
            class="btn-primary login-button"
            :disabled="loading"
          >
            <div v-if="loading" class="loading-spinner">
              <div class="spinner"></div>
            </div>
            {{ isSignUp ? 'Create account' : 'Sign in' }}
          </button>
        </form>

        <!-- Toggle Mode -->
        <div class="form-toggle">
          <button
            type="button"
            class="toggle-button"
            @click="isSignUp = !isSignUp"
          >
            {{ isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up" }}
          </button>
        </div>

        <!-- Forgot Password -->
        <div v-if="!isSignUp" class="forgot-password">
          <button
            type="button"
            class="forgot-button"
            @click="showForgotPassword = true"
          >
            Forgot your password?
          </button>
        </div>
        
        <!-- Error Message -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="success-message">
          {{ successMessage }}
        </div>
      </div>

      <!-- Forgot Password Modal -->
      <div v-if="showForgotPassword" class="modal-overlay" @click="showForgotPassword = false">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Reset Password</h3>
            <button class="close-button" @click="showForgotPassword = false">×</button>
          </div>
          <form @submit.prevent="handleForgotPassword" class="modal-form">
            <div class="form-group">
              <label for="resetEmail" class="form-label">Email</label>
              <input
                id="resetEmail"
                v-model="resetEmail"
                type="email"
                class="form-input"
                placeholder="Enter your email"
                required
              />
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="showForgotPassword = false">
                Cancel
              </button>
              <button type="submit" class="btn-primary" :disabled="loading">
                Send reset link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { signIn, signUp, signInWithGoogle, signInWithGitHub, resetPassword } = useAuth()
const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const fullName = ref('')
const resetEmail = ref('')
const isSignUp = ref(false)
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const showForgotPassword = ref(false)

const handleSubmit = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''
  
  try {
    const { error: authError } = isSignUp.value
      ? await signUp(email.value, password.value, fullName.value)
      : await signIn(email.value, password.value)
    
    if (authError) {
      error.value = authError.message
    } else {
      if (isSignUp.value) {
        successMessage.value = 'Account created! Please check your email to verify your account.'
      } else {
        // Redirect to intended page or canvas
        const redirectTo = route.query.redirect as string || '/canvas'
        await router.push(redirectTo)
      }
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
    console.error('Auth error:', err)
  } finally {
    loading.value = false
  }
}

const handleGoogleSignIn = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const { error: authError } = await signInWithGoogle()
    if (authError) {
      error.value = authError.message
    }
    // OAuth redirect will handle the rest
  } catch (err) {
    error.value = 'Failed to sign in with Google'
    console.error('Google auth error:', err)
  } finally {
    loading.value = false
  }
}

const handleGitHubSignIn = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const { error: authError } = await signInWithGitHub()
    if (authError) {
      error.value = authError.message
    }
    // OAuth redirect will handle the rest
  } catch (err) {
    error.value = 'Failed to sign in with GitHub'
    console.error('GitHub auth error:', err)
  } finally {
    loading.value = false
  }
}

const handleForgotPassword = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const { error: resetError } = await resetPassword(resetEmail.value)
    if (resetError) {
      error.value = resetError.message
    } else {
      successMessage.value = 'Password reset link sent to your email!'
      showForgotPassword.value = false
      resetEmail.value = ''
    }
  } catch (err) {
    error.value = 'Failed to send reset email'
    console.error('Reset password error:', err)
  } finally {
    loading.value = false
  }
}

// Check for error in URL params
onMounted(() => {
  if (route.query.error) {
    error.value = 'Authentication failed. Please try again.'
  }
})

// Redirect if already authenticated
const { user } = useAuth()
watch(user, (newUser) => {
  if (newUser) {
    const redirectTo = route.query.redirect as string || '/canvas'
    router.push(redirectTo)
  }
})

// SEO
useHead({
  title: 'Sign In - Ideanation',
  meta: [
    { name: 'description', content: 'Sign in to Ideanation to start building your startup ideas.' }
  ]
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 24px;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.brand-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.login-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 8px;
}

.login-subtitle {
  color: #64748b;
  font-size: 16px;
  line-height: 1.5;
}

.social-login {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: white;
  color: #374151;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.social-btn:hover:not(:disabled) {
  border-color: #6366f1;
  background: #f8fafc;
}

.social-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.google-btn:hover:not(:disabled) {
  border-color: #4285F4;
}

.github-btn:hover:not(:disabled) {
  border-color: #24292e;
}

.divider {
  position: relative;
  text-align: center;
  margin: 24px 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e2e8f0;
}

.divider span {
  background: white;
  color: #64748b;
  padding: 0 16px;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: white;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.login-button {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.loading-spinner {
  display: flex;
  align-items: center;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.form-toggle {
  text-align: center;
  margin-bottom: 16px;
}

.toggle-button {
  background: none;
  border: none;
  color: #6366f1;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
  transition: color 0.2s ease;
}

.toggle-button:hover {
  color: #4f46e5;
}

.forgot-password {
  text-align: center;
  margin-bottom: 16px;
}

.forgot-button {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  text-decoration: underline;
  font-size: 14px;
  transition: color 0.2s ease;
}

.forgot-button:hover {
  color: #374151;
}

.error-message {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px;
  color: #dc2626;
  font-size: 14px;
  text-align: center;
}

.success-message {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 12px;
  color: #16a34a;
  font-size: 14px;
  text-align: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 24px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.modal-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: #f1f5f9;
  color: #374151;
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-secondary {
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-secondary:hover {
  border-color: #6366f1;
  color: #6366f1;
}

.btn-primary {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
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

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 480px) {
  .login-page {
    padding: 16px;
  }
  
  .login-card {
    padding: 24px;
  }
  
  .login-title {
    font-size: 20px;
  }
  
  .login-subtitle {
    font-size: 14px;
  }
}
</style>