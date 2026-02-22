import { defineStore } from 'pinia'
import { apiLogin, apiMe, apiRefresh } from 'src/services/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: localStorage.getItem('access_token'),
    refreshToken: localStorage.getItem('refresh_token'),
    role: localStorage.getItem('growmart_role'),
    initialized: false
  }),

  getters: {
    isAuthenticated: (state) => !!state.accessToken
  },

  actions: {

    async login(payload) {
      const res = await apiLogin(payload)

      this.accessToken = res.access_token
      this.refreshToken = res.refresh_token

      localStorage.setItem('access_token', res.access_token)
      localStorage.setItem('refresh_token', res.refresh_token)

      await this.fetchMe()
    },

    async fetchMe() {
      const me = await apiMe()
      this.user = me
      this.role = me.role
      localStorage.setItem('growmart_role', me.role)
    },

    async refresh() {
      if (!this.refreshToken) throw new Error('No refresh token')

      const res = await apiRefresh(this.refreshToken)

      this.accessToken = res.access_token
      localStorage.setItem('access_token', res.access_token)

      return res.access_token
    },

    async init() {
      if (!this.accessToken) {
        this.initialized = true
        return
      }

      try {
        await this.fetchMe()
      } catch {
        await this.refresh()
        await this.fetchMe()
      }

      this.initialized = true
    },

    logout() {
      this.user = null
      this.accessToken = null
      this.refreshToken = null
      this.role = null

      localStorage.clear()
    }
  }
})
