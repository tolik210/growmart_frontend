const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/WelcomePage.vue') },
      { path: 'product/:id', component: () => import('pages/ProductDetails.vue') },
      { path: 'cart', component: () => import('pages/CartPage.vue') },
      { path: 'catalog', component: () => import('pages/Home.vue') },
      { path: 'profile', component: () => import('pages/ProfilePage.vue') },
      { path: 'admin', component: () => import('pages/AdminPanel.vue') },

      { path: 'buyer', component: () => import('pages/buyer/BuyerCabinet.vue') },
      { path: 'buyer/orders', component: () => import('pages/buyer/BuyerOrders.vue') },

      { path: 'seller', component: () => import('pages/SellerCabinet.vue') },
      { path: 'seller/products', component: () => import('pages/seller/SellerProducts.vue') },
      { path: 'seller/orders', component: () => import('pages/seller/SellerOrders.vue') },
      { path: 'seller/analytics', component: () => import('pages/seller/SellerAnalytics.vue') },
      
      // Наш новый маршрут для подписания договора
      { path: 'order/:id/sign', component: () => import('pages/SignContract.vue') }
    ]
  },
  { path: '/login', component: () => import('pages/LoginPage.vue') },
  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') }
]

export default routes
