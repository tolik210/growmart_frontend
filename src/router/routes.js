const routes = [
  { path: '/', component: () => import('pages/WelcomePage.vue') },
  { path: '/product/:id', component: () => import('pages/ProductDetails.vue') },
  { path: '/cart', component: () => import('pages/CartPage.vue') },
  { path: '/catalog', component: () => import('pages/Home.vue') },
  { path: '/login', component: () => import('pages/LoginPage.vue') },
  {
    path: '/seller',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/SellerCabinet.vue') },
      { path: 'products', component: () => import('pages/seller/SellerProducts.vue') },
      { path: 'orders', component: () => import('pages/seller/SellerOrders.vue') }
    ]
  },
  { path: '/buyer', component: () => import('pages/buyer/BuyerCabinet.vue') },
  { path: '/buyer/orders', component: () => import('pages/buyer/BuyerOrders.vue') },
  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') }
]

export default routes
