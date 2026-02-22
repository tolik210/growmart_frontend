const routes = [
  { path: '/', component: () => import('pages/LoginPage.vue') },
  { path: '/login', component: () => import('pages/LoginPage.vue') },
  {
    path: '/seller',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/seller/SellerCabinet.vue') },
      { path: 'products', component: () => import('pages/seller/SellerProducts.vue') },
      { path: 'profile', component: () => import('pages/seller/ProfilePage.vue') },
      // ДОБАВЛЯЕМ СЮДА:
      { path: 'contracts', component: () => import('pages/seller/SellerContracts.vue') },
      { path: 'contracts/:id', component: () => import('pages/seller/SellerContractView.vue') }
    ]
  },
  {
    path: '/buyer',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/buyer/BuyerCabinet.vue') },
      { path: 'catalog', component: () => import('pages/buyer/BuyerCatalog.vue') },
      { path: 'contracts', component: () => import('pages/buyer/BuyerContracts.vue') },
      { path: 'contracts/:id', component: () => import('pages/buyer/BuyerContractView.vue') }
    ]
  },
  { path: '/:catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') }
]
export default routes
