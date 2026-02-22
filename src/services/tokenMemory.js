let accessToken = ''

export function setAccessToken(t) {
  accessToken = t || ''
}

export function getAccessToken() {
  return accessToken
}

export function clearAccessToken() {
  accessToken = ''
}
