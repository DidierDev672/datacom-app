
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // { path: '', component: () => import('pages/PageHome.vue') },
      { path: 'encuestas', component: () => import('pages/menu-encuestas/PageMenuEncuestas.vue') },
      { path: 'encuestas/lista', name:'listado-encuesta', component: () => import('pages/menu-encuestas/EncuestasList') },
      { path: 'nueva-encuesta/:id', name:'nueva-encuesta', component: () => import('pages/menu-encuestas/PageNewEncuesta') },
      { path: 'encuesta-proceso', name:'encuesta-proceso', component: () => import('pages/menu-encuestas/EncuestasEnProceso') },
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
        path: 'parametros',
        name: 'parametros',
        component: () => import('pages/parametrizacion/Parametros/PageParametros.vue')
      },
      {
        path: 'parametro/:id',
        name: 'parametro',
        component: () => import('pages/parametrizacion/Parametros/PageParametro.vue')
      },
      {
        path: 'parametro',
        name: 'nuevo-parametro',
        component: () => import('pages/parametrizacion/Parametros/PageParametro.vue')
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
      },
      { path: '', redirect: 'encuestas' },
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
        path: 'poblacion',
        name: 'poblacion',
        component: () => import('pages/mod-municipios/municipio/Poblacion.vue'),
      },
      {
        path: 'calidad-vida',
        name: 'calidad-vida',
        component: () => import('pages/mod-municipios/municipio/CalidadVida.vue'),
      },
      {
        path: 'educacion',
        name: 'educacion',
        component: () => import('pages/mod-municipios/municipio/Educacion.vue'),
      },
      {
        path: 'viviendas-municipio',
        name: 'viviendas-municipio',
        component: () => import('pages/mod-municipios/municipio/Viviendas.vue'),
      },
      {
        path: 'cobertura-servicio',
        name: 'cobertura-servicio',
        component: () => import('pages/mod-municipios/municipio/CoberturaServicio.vue'),
      },
      {
        path: 'seguridad',
        name: 'seguridad',
        component: () => import('pages/mod-municipios/municipio/Seguridad.vue'),
      },
      {
        path: 'administracion',
        name: 'administracion',
        component: () => import('pages/mod-municipios/municipio/AdministracionPublica.vue'),
      },
      {
        path: 'secretarias',
        name: 'secretarias',
        component: () => import('pages/mod-municipios/municipio/Secretarias.vue'),
      },
      {
        path: 'politicas-publicas',
        name: 'politicas-publicas',
        component: () => import('pages/mod-municipios/municipio/PoliticasPublicas.vue'),
      },
      {
        path: 'organizaciones',
        name: 'organizaciones',
        component: () => import('pages/mod-municipios/municipio/Organizaciones.vue'),
      },
      {
        path: 'infraestructura-publica',
        name: 'infraestructura-publica',
        component: () => import('pages/mod-municipios/municipio/InfraestructuraPublica.vue'),
      },
      {
        path: 'finanza',
        name: 'finanza',
        component: () => import('pages/mod-municipios/municipio/Finanza.vue'),
      },
      {
        path: 'indicador',
        name: 'indicador',
        component: () => import('pages/mod-municipios/municipio/Indicador.vue'),
      },
      {
        path: 'territorio',
        name: 'territorio',
        component: () => import('pages/mod-municipios/municipio/Territorio.vue'),
      },
      {
        path: 'participacion',
        name: 'participacion',
        component: () => import('pages/mod-municipios/municipio/Participacion.vue'),
      },
      {
        path: 'medios',
        name: 'medios',
        component: () => import('pages/mod-municipios/municipio/Medios.vue'),
      },
      {
        path: 'economia',
        name: 'economia',
        component: () => import('pages/mod-municipios/municipio/Economia.vue'),
      },
      {
        path: 'productos',
        name: 'productos',
        component: () => import('pages/mod-municipios/municipio/Productos.vue'),
      },
      {
        path: 'fin-encuesta',
        name: 'fin-encuesta',
        component: () => import('pages/mod-municipios/municipio/FinEncuesta.vue'),
      },
    ]
  },
  {
    path: '/comunidad/:id',
    name: 'comunidad',
    component: () => import('layouts/ComunidadLayout.vue'),
    children: [
      {
        path: '',
        name: 'c-info-general',
        component: () => import('pages/mod-comunidad/info-general/InfoGeneral.vue'),
      },
      {
        path: 'poblacion',
        name: 'c-poblacion',
        component: () => import('pages/mod-comunidad/poblacion/Poblacion.vue'),
      },
      {
        path: 'organizaciones',
        name: 'c-organizaciones',
        component: () => import('pages/mod-comunidad/organizaciones/Organizaciones.vue'),
      },
      {
        path: 'vias',
        name: 'c-vias-acceso',
        component: () => import('pages/mod-comunidad/vias/Vias.vue'),
      },
      {
        path: 'infraestructura',
        name: 'c-infraestructura',
        component: () => import('pages/mod-comunidad/infraestructura/Infraestructura.vue'),
      },
      {
        path: 'comunicaciones',
        name: 'c-comunicaciones',
        component: () => import('pages/mod-comunidad/comunicaciones/Medios.vue'),
      },
      {
        path: 'ecosistemas',
        name: 'c-ecosistema',
        component: () => import('pages/mod-comunidad/ecosistema/Ecosistema.vue'),
      },
      {
        path: 'salud',
        name: 'c-salud',
        component: () => import('pages/mod-comunidad/infrasalud/Infrasalud.vue'),
      },
      {
        path: 'calidad-de-vida',
        name: 'c-calidad-de-vida',
        component: () => import('pages/mod-comunidad/calidad-vida/CalidadVida.vue'),
      },
      {
        path: 'poblacion-infantil',
        name: 'c-poblacion-infantil',
        component: () => import('pages/mod-comunidad/poblacion-infantil/PoblacionInfantil.vue'),
      },
      {
        path: 'vivienda',
        name: 'c-vivienda',
        component: () => import('pages/mod-comunidad/viviendas/Viviendas.vue'),
      },
      {
        path: 'comite-emergencia',
        name: 'c-comite-emergencia',
        component: () => import('pages/mod-comunidad/viviendas/Viviendas.vue'),
      },
      {
        path: 'actividades-economicas',
        name: 'c-actividades-economicas',
        component: () => import('pages/mod-comunidad/viviendas/Viviendas.vue'),
      },
      {
        path: 'participacion-ciudadana',
        name: 'c-participacion-ciudadana',
        component: () => import('pages/mod-comunidad/viviendas/Viviendas.vue'),
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
