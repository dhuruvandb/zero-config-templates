<script setup lang="ts">
import { ref } from 'vue'
import { authClient } from '@/lib/auth-client'
import { useAuthStore } from '@/stores/auth'
import Auth from '@/components/Auth/Auth.vue'
import ItemsList from '@/components/Items/ItemsList.vue'

const auth = useAuthStore()
const { data: session, isPending } = authClient.useSession()
const isLoggedIn = ref(false)

// Watch session changes
session.value ? (isLoggedIn.value = true) : (isLoggedIn.value = false)
</script>

<template>
  <div v-if="isPending" class="loading">Loading...</div>

  <div v-else-if="!session">
    <Auth />
  </div>

  <div v-else class="app-wrapper">
    <div class="app-header">
      <h1>MERN Starter CRUD (Authenticated)</h1>

      <button class="logout-btn" @click="auth.logout()">Logout</button>
    </div>

    <ItemsList />
  </div>
</template>
