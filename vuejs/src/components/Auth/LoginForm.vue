<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

defineEmits<{ switchToRegister: [] }>()

const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

const submit = async () => {
  error.value = ''
  try {
    await auth.login(email.value, password.value)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Login failed'
    error.value = message
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

      <button type="submit" class="auth-btn">Login</button>
    </form>

    <div class="auth-switch">
      New user?
      <span @click="$emit('switchToRegister')">Create an account</span>
    </div>
  </div>
</template>
