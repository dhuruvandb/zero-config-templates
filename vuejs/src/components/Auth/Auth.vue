<script setup lang="ts">
import { ref } from 'vue'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'

const mode = ref<'login' | 'register'>('login')
</script>

<template>
  <LoginForm v-if="mode === 'login'" @switch-to-register="mode = 'register'" />
  <RegisterForm v-else @switch-to-login="mode = 'login'" />
</template>
