
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
      },
      {
        path: '/ficha-vivienda',
        name: 'nueva-ficha-vivienda',
        component: () => import('pages/mod-viviendas/NuevaVivienda.vue'),
        children: [
          { path: 'localizacion', name: 'localizacion-vivienda', component: () => import('pages/mod-viviendas/LocalizacionVivienda.vue') },
          { path: 'estado', name: 'estado-vivienda', component: () => import('pages/mod-viviendas/EstadoVivienda.vue') },
          { path: 'servicios-publicos', name: 'servicios-vivienda', component: () => import('pages/mod-viviendas/ServiciosVivienda.vue') },
          { path: 'productos', name: 'productos-vivienda', component: () => import('pages/mod-viviendas/ProductosVivienda.vue') },
          { path: 'personas', name: 'personas-vivienda', component: () => import('pages/mod-viviendas/PersonasVivienda.vue') },
          { path: 'control-ficha', name: 'control-vivienda', component: () => import('pages/mod-viviendas/ControlVivienda.vue') },
          
        ]
      },
      {
        path: '/municipios',
        name: 'municipios',
        component: () => import('pages/mod-municipios/ListaMunicipios.vue'),
      }
    ]
  },
  {
    path: '/municipio/:id',
    name: 'municipio',
    component: () => import('layouts/MunicipiosLayout.vue'),
    children: [
      {
        path: '',
        name: 'info-general',
        component: () => import('pages/mod-municipios/municipio/InfoGeneral.vue'),
      },
      {
        path: 'calidad-vida',
        name: 'calidad-vida',
        component: () => import('pages/mod-municipios/municipio/CalidadVida.vue'),
      },
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
