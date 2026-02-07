<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import Auth from '@/components/Auth/Auth.vue'
import ItemsList from '@/components/Items/ItemsList.vue'

const auth = useAuthStore()
const isLoggedIn = computed(() => !!auth.accessToken)
</script>

<template>
  <div v-if="!isLoggedIn">
    <Auth />
  </div>

  <div v-else class="app-wrapper">
    <div class="app-header">
      <h1>MERN Starter CRUD (Authenticated)</h1>

      <button class="logout-btn" @click="auth.logout()">Logout</button>
    </div>

    <ItemsList :access-token="auth.accessToken" />
  </div>
</template>
