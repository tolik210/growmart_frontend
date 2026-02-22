import { getAuth } from './authState'
import { roleToPath } from './roleRedirect'

export function requireAuth(to) {
  const a = getAuth()
  if (!a.access_token) return '/login'
  return true
}

export function requireRole(roles = []) {
  return () => {
    const a = getAuth()
    if (!a.access_token) return '/login'
    if (!roles.length) return true
    if (!roles.includes(a.role)) return roleToPath(a.role || '')
    return true
  }
}
