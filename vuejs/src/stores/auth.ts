import { defineStore } from 'pinia'
import api from '../api/api'

type RegisterError = { errors: string[] } | { message: string }

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('token') as string | null,
  }),
  actions: {
    async login(email: string, password: string) {
      const res = await api.post('/api/auth/login', { email, password })

      if (!res?.accessToken) {
        throw new Error(res?.message || 'Login failed')
      }

      this.accessToken = res.accessToken
      localStorage.setItem('token', res.accessToken)
    },
    async register(email: string, password: string) {
      const res = await api.post('/api/auth/register', { email, password })

      if (!res?.accessToken) {
        if (Array.isArray(res?.errors)) {
          const messages = res.errors.map((e: { msg?: string }) => e.msg || 'Invalid input')
          const err: RegisterError = { errors: messages }
          throw err
        }

        const err: RegisterError = { message: res?.message || 'Registration failed' }
        throw err
      }

      return true
    },
    logout() {
      this.accessToken = null
      localStorage.removeItem('token')
    },
  },
})
