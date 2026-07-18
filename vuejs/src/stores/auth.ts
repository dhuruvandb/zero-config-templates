import { defineStore } from 'pinia'
import { authClient } from '../lib/auth-client'

export const useAuthStore = defineStore('auth', {
  actions: {
    async login(email: string, password: string) {
      const { error } = await authClient.signIn.email({ email, password })
      if (error) throw new Error(error.message || 'Login failed')
    },
    async register(email: string, password: string) {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name: email.split('@')[0],
      })
      if (error) throw new Error(error.message || 'Registration failed')
    },
    logout() {
      authClient.signOut()
    },
  },
})
