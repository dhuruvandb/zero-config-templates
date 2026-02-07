<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits<{ switchToLogin: [] }>()

const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref<string | string[]>('')

const submit = async () => {
  error.value = ''
  try {
    await auth.register(email.value, password.value)
    email.value = ''
    password.value = ''
    error.value = ''
    emit('switchToLogin')
  } catch (err: any) {
    if (err?.errors && Array.isArray(err.errors)) {
      error.value = err.errors
    } else if (err?.message) {
      error.value = err.message
    } else {
      error.value = 'Registration failed'
    }
  }
}
</script>

<template>
  <div class="auth-card">
    <h2 class="auth-title">Register</h2>

    <ul v-if="Array.isArray(error) && error.length" class="error-msg">
      <li v-for="(msg, index) in error" :key="index">{{ msg }}</li>
    </ul>
    <p v-else-if="error" class="error-msg">{{ error }}</p>

    <form @submit.prevent="submit">
      <div class="auth-field">
        <label>Email:</label>
        <input v-model="email" type="email" placeholder="Enter your email" />
      </div>

      <div class="auth-field">
        <label>Password:</label>
        <input v-model="password" type="password" placeholder="Create a strong password" />
      </div>

      <button type="submit" class="auth-btn">Register</button>
    </form>

    <div class="auth-switch">
      Already have an account?
      <span @click="$emit('switchToLogin')">Login here</span>
    </div>
  </div>
</template>
