export function getAuth() {
  return {
    access_token: localStorage.getItem('access_token') || '',
    refresh_token: localStorage.getItem('refresh_token') || '',
    role: localStorage.getItem('growmart_role') || '',
    iin_bin: localStorage.getItem('iin_bin') || ''
  }
}

export function setRole(role) {
  localStorage.setItem('growmart_role', role)
}

export function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('growmart_role')
  localStorage.removeItem('iin_bin')
}
