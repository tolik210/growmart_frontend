import api from 'src/services/api'

export function login(body) {
  return api.post('/auth/login', body)
}

export function register(body) {
  return api.post('/auth/register', body)
}
