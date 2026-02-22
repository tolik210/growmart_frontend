import axios from 'axios'
import { getAccessToken } from './tokenMemory'

const api = axios.create({
  // Возвращаем единый шлюз для Nginx
  baseURL: 'https://v1.growmart.ltd/api'
})

api.interceptors.request.use(config => {
  // МАГИЯ ЗДЕСЬ: Если компонент отправил запрос с '/api/', мы его отрезаем,
  // чтобы не получилось дублирования (/api/api/...)
  if (config.url && config.url.startsWith('/api/')) {
    config.url = config.url.substring(4); // отрезаем первые 4 символа ("/api")
  }

  // Работа с токеном
  const token = getAccessToken() || localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  return config
}, error => {
  return Promise.reject(error)
})

export default api
