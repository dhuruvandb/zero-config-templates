<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'
import ForgotPasswordForm from './ForgotPasswordForm.vue'

const mode = ref<'login' | 'register' | 'forgot-password'>('login')
</script>

<template>
  <LoginForm
    v-if="mode === 'login'"
    @switch-to-register="mode = 'register'"
    @switch-to-forgot-password="mode = 'forgot-password'"
  />
  <RegisterForm v-else-if="mode === 'register'" @switch-to-login="mode = 'login'" />
  <ForgotPasswordForm v-else @switch-to-login="mode = 'login'" />
</template>
