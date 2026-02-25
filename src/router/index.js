import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 })
})

// === ГЛОБАЛЬНЫЙ СТРАЖ МАРШРУТОВ ===
router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token')
  
  // Защита от "битого" кэша браузера
  if (token === 'undefined' || token === 'null') {
    localStorage.removeItem('token')
    token = null
  }

  // 1. Публичные страницы (доступны всем)
  const isPublicRoute = 
    to.path === '/' || 
    to.path === '/login' || 
    to.path === '/catalog' || 
    to.path === '/cart' || 
    to.path.startsWith('/product/')

  if (isPublicRoute) {
    next() // Пропускаем гостя
  } else {
    // 2. Закрытые страницы
    if (!token) {
      console.warn('[Router] Защищенный маршрут. Перенаправление на /login')
      next('/login')
    } else {
      next() // Токен есть, пропускаем
    }
  }
})

export default router
