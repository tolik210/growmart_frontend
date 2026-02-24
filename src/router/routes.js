const routes = [
  // Главная страница приветствия
  {
    path: '/',
    component: () => import('pages/WelcomePage.vue')
  },
  // Каталог (Маркетплейс)
  {
    path: '/catalog',
    component: () => import('pages/Home.vue')
  },
  // Страница входа и регистрации (ИСПРАВЛЕНО на LoginPage.vue)
  {
    path: '/login',
    component: () => import('pages/LoginPage.vue')
  },
  // Раздел фермера
  {
    path: '/seller',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SellerCabinet.vue') },
      { path: 'products', component: () => import('pages/seller/SellerProducts.vue') }
    ]
  },
  // Страница 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
