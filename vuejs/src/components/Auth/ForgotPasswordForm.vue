<script setup lang="ts">
import { ref } from 'vue'
import { authClient } from '@/lib/auth-client'

const emit = defineEmits<{ switchToLogin: [] }>()

const email = ref('')
const error = ref('')
const loading = ref(false)
const success = ref(false)

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    const { error: err } = await authClient.requestPasswordReset({
      email: email.value,
      redirectTo: `${window.location.origin}/reset-password`,
    })
    if (err) throw new Error(err.message || 'Failed to send reset email')
    success.value = true
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Something went wrong'
    error.value = message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div v-if="success" class="auth-card" style="text-align: center">
    <h2 class="auth-title">Check your email</h2>
    <p class="error-msg">
      If an account exists for {{ email }}, you will receive a password reset link shortly.
    </p>
    <div class="auth-switch">
      <span @click="emit('switchToLogin')">Back to Sign In</span>
    </div>
  </div>

  <div v-else class="auth-card">
    <h2 class="auth-title">Reset your password</h2>

    <p v-if="error" class="error-msg">{{ error }}</p>

    <form @submit.prevent="submit">
      <div class="auth-field">
        <label>Email:</label>
        <input v-model="email" type="email" placeholder="Enter your email" />
      </div>

      <button type="submit" class="auth-btn" :disabled="loading">
        {{ loading ? 'Sending...' : 'Send Reset Link' }}
      </button>
    </form>

    <div class="auth-switch">
      Remember your password?
      <span @click="emit('switchToLogin')">Back to Sign In</span>
    </div>
  </div>
</template>
