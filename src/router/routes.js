const routes = [
  {
    path: '/giris', component: () => import('pages/GirisPage.vue')
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', redirect: to => { return '/giris' } },
      { path: 'zimmetbazli', component: () => import('src/pages/ZimmetBazliListePage.vue') },
      { path: 'kullaniciListesi', component: () => import('src/pages/KullaniciListesiPage.vue') }

    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
