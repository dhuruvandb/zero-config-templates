<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits<{ switchToRegister: []; switchToForgotPassword: [] }>()

const auth = useAuthStore()

import { authClient } from '@/lib/auth-client'

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const socialLoading = ref<string | null>(null)

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed'
    error.value = message
  } finally {
    loading.value = false
  }
}

const handleSocialLogin = async (provider: 'google' | 'github') => {
  socialLoading.value = provider
  try {
    await authClient.signIn.social({ provider, callbackURL: '/' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : `${provider} login failed`
    error.value = message
    socialLoading.value = null
  }
}
</script>

<template>
  <div class="auth-card">
    <h2 class="auth-title">Login</h2>

    <p v-if="error" class="error-msg">{{ error }}</p>

    <form @submit.prevent="submit">
      <div class="auth-field">
        <label>Email:</label>
        <input v-model="email" type="email" placeholder="Enter your email" />
      </div>

      <div class="auth-field">
        <label>Password:</label>
        <input v-model="password" type="password" placeholder="Enter your password" />
      </div>

      <button type="submit" class="auth-btn" :disabled="loading">
        {{ loading ? 'Signing in...' : 'Login' }}
      </button>
    </form>

    <div class="auth-social">
      <p class="auth-or">Or continue with</p>
      <div class="auth-social-buttons">
        <button
          type="button"
          class="auth-btn auth-social-btn"
          :disabled="socialLoading === 'google'"
          @click="handleSocialLogin('google')"
        >
          {{ socialLoading === 'google' ? 'Redirecting...' : 'Google' }}
        </button>
        <button
          type="button"
          class="auth-btn auth-social-btn"
          :disabled="socialLoading === 'github'"
          @click="handleSocialLogin('github')"
        >
          {{ socialLoading === 'github' ? 'Redirecting...' : 'GitHub' }}
        </button>
      </div>
    </div>

    <div class="auth-switch">
      <span @click="emit('switchToForgotPassword')">Forgot password?</span>
    </div>

    <div class="auth-switch">
      New user?
      <span @click="emit('switchToRegister')">Create an account</span>
    </div>
  </div>
</template>
