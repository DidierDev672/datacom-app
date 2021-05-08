
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/PageHome.vue') },
      { path: 'encuestas', component: () => import('pages/menu-encuestas/PageMenuEncuestas.vue') },
      { path: 'parametrizacion', component: () => import('pages/parametrizacion/PageMenuParametrizacion.vue') },
      { path: 'reportes', component: () => import('pages/reportes/PageMenuReportes.vue') },
      {
        path: 'categorias',
        name: 'categorias',
        component: () => import('pages/parametrizacion/categorias/PageCategorias.vue')
      },
      {
        path: 'categoria/:id',
        name: 'categoria',
        component: () => import('pages/parametrizacion/categorias/PageCategoria.vue')
      },
      {
        path: 'categoria',
        name: 'nueva-categoria',
        component: () => import('pages/parametrizacion/categorias/PageCategoria.vue')
      }
    ]
  },
  {
    path: '/auth',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      { path: '', component: () => import('pages/auth/PageLogin.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
