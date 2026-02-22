import api from './api'

export async function apiLogin({ iin_bin, password }) {
  const r = await api.post('/auth/login', { iin_bin, password })
  return r.data
}

export async function apiMe() {
  const r = await api.get('/auth/me')
  return r.data
}

export async function apiLogout() {
  const r = await api.post('/auth/logout', {}) // refresh_token в cookie
  return r.data
}
