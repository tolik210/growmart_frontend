import axios from 'axios'

const api = axios.create({
  // Если у тебя Nginx настроен на проксирование /api, достаточно оставить так:
  baseURL: '/api' 
})

// Перехватчик: перед каждым запросом берем токен и кладем в заголовки
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

export default api
