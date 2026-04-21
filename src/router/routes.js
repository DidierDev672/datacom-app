const routes = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            { path: '', component: () => import('pages/PageHome.vue') },
            {
                path: 'app',
                component: () => import('pages/app/modulo/PageModulo.vue'),
                children: [
                    /* {
                        path: 'abastecimiento',
                        component: () => import('pages/app/modulo/abastecimiento/Abastecimiento.vue')
                    }, */
                    {
                        path: 'municipios',
                        name: 'PageModuloMunicipio',
                        component: () =>
                            import(
                                'pages/app/modulo/municipio/PageModuloMunicipio.vue'
                            ),
                        children: [
                            {
                                path: '',
                                name: 'PageModuloMunicipioIndex',
                                component: () =>
                                    import(
                                        'pages/app/modulo/municipio/PageModuloMunicipioIndex.vue'
                                    ),
                            },
                        ],
                    },
                    {
                        path: 'comunidad',
                        name: 'PageModuloComunidad',
                        component: () =>
                            import(
                                'pages/app/modulo/comunidad/PageModuloComunidad.vue'
                            ),
                        children: [
                            {
                                path: '',
                                name: 'PageModuloComunidadIndex',
                                component: () =>
                                    import(
                                        'pages/app/modulo/comunidad/PageModuloComunidadIndex.vue'
                                    ),
                            },
                        ],
                    },
                    {
                        path: 'vivienda',
                        name: 'PageModuloVivienda',
                        component: () =>
                            import(
                                'pages/app/modulo/vivienda/PageModuloVivienda.vue'
                            ),
                        children: [
                            {
                                path: '',
                                name: 'PageModuloViviendaIndex',
                                component: () =>
                                    import(
                                        'pages/app/modulo/vivienda/PageModuloViviendaIndex.vue'
                                    ),
                            },
                        ],
                    }
                ],
            },

            {
                path: 'encuestas',
                component: () =>
                    import('pages/menu-encuestas/PageEncuesta.vue'),
                children: [
                    {
                        path: '',
                        name: 'PageMenuEncuestas',
                        component: () =>
                            import(
                                'pages/menu-encuestas/PageMenuEncuestas.vue'
                            ),
                    },
                    {
                        path: 'create/:id',
                        name: 'PageNewEncuesta',
                        component: () =>
                            import('pages/menu-encuestas/PageNewEncuesta'),
                    },
                    {
                        path: 'cerradas',
                        name: 'PageEncuestasCerradas',
                        component: () =>
                            import(
                                'pages/menu-encuestas/EncuestasCerradas.vue'
                            ),
                    },
                    {
                        path: 'proceso',
                        name: 'PageEncuestasEnProceso',
                        component: () =>
                            import(
                                'pages/menu-encuestas/EncuestasEnProceso.vue'
                            ),
                    },
                ],
            },
            {
                path: 'parametrizacion',
                component: () =>
                    import('pages/parametrizacion/PageParametrizacion.vue'),
                children: [
                    {
                        path: '',
                        name: 'PageMenuParametrizacion',
                        component: () =>
                            import(
                                'pages/parametrizacion/PageMenuParametrizacion.vue'
                            ),
                    },
                    {
                        path: 'categoria',
                        name: 'categoria',
                        component: () =>
                            import(
                                'pages/parametrizacion/categoria/PageCategoria.vue'
                            ),
                        children: [
                            {
                                path: '',
                                name: 'PageCategoriaIndex',
                                component: () =>
                                    import(
                                        'pages/parametrizacion/categoria/PageCategoriaIndex.vue'
                                    ),
                            },
                            {
                                path: ':id',
                                name: 'PageCategoriaEdit',
                                component: () =>
                                    import(
                                        'pages/parametrizacion/categoria/PageCategoriaCreate.vue'
                                    ),
                            },
                            {
                                path: 'create',
                                name: 'PageCategoriaCreate',
                                component: () =>
                                    import(
                                        'pages/parametrizacion/categoria/PageCategoriaCreate.vue'
                                    ),
                            },
                        ],
                    },
                    {
                        path: 'parametro',
                        name: 'parametro',
                        component: () =>
                            import(
                                'pages/parametrizacion/Parametro/PageParametro.vue'
                            ),
                        children: [
                            {
                                path: '',
                                name: 'PageParametroIndex',
                                component: () =>
                                    import(
                                        'pages/parametrizacion/Parametro/PageParametroIndex.vue'
                                    ),
                            },
                            {
                                path: ':id',
                                name: 'PageParametroEdit',
                                component: () =>
                                    import(
                                        'pages/parametrizacion/Parametro/PageParametroCreate.vue'
                                    ),
                            },
                            {
                                path: 'create',
                                name: 'PageParametroCreate',
                                component: () =>
                                    import(
                                        'pages/parametrizacion/Parametro/PageParametroCreate.vue'
                                    ),
                            },
                        ],
                    },
                    {
                        path: 'departamento',
                        name: 'departamento',
                        component: () =>
                            import(
                                'pages/parametrizacion/departamento/PageDepartamento.vue'
                            ),
                        children: [
                            {
                                path: '',
                                name: 'PageDepartamentoIndex',
                                component: () =>
                                    import(
                                        'pages/parametrizacion/departamento/DepartamentoIndex.vue'
                                    ),
                            },
                        ],
                    },
                    {
                        path: 'municipio',
                        name: 'municipio',
                        component: () =>
                            import(
                                'pages/parametrizacion/municipio/PageMunicipio.vue'
                            ),
                        children: [
                            {
                                path: '',
                                name: 'PageMunicipioIndex',
                                component: () =>
                                    import(
                                        'pages/parametrizacion/municipio/PageMunicipioIndex.vue'
                                    ),
                            },
                        ],
                    },
                    {
                        path: 'comunidad',
                        name: 'comunidad',
                        component: () =>
                            import(
                                'pages/parametrizacion/comunidad/PageComunidad.vue'
                            ),
                        children: [
                            {
                                path: '',
                                name: 'PageComunidadIndex',
                                component: () =>
                                    import(
                                        'pages/parametrizacion/comunidad/PageComunidadIndex.vue'
                                    ),
                            },
                            {
                                path: 'create',
                                name: 'PageComunidadCreate',
                                component: () =>
                                    import(
                                        'pages/parametrizacion/comunidad/PageComunidadCreate.vue'
                                    ),
                            },
                        ],
                    },
                    {
                        path: 'organizaciones-base',
                        name: 'nueva-organizacion',
                        component: () =>
                            import('pages/parametrizacion/jac/PageJac.vue'),
                        children: [
                            {
                                path: '',
                                name: 'PageJacCreate',
                                component: () =>
                                    import(
                                        'pages/parametrizacion/jac/PageJacCreate.vue'
                                    ),
                            },
                        ],
                    },
                    {
                        path: 'usuario',
                        name: 'usuario',
                        component: () =>
                            import(
                                'pages/parametrizacion/usuario/PageUsuario.vue'
                            ),
                        children: [
                            {
                                path: '',
                                name: 'PageUsuarioIndex',
                                component: () =>
                                    import(
                                        'pages/parametrizacion/usuario/PageUsuarioIndex.vue'
                                    ),
                            },
                            {
                                path: 'create',
                                name: 'PageUsuarioCreate',
                                component: () =>
                                    import(
                                        'pages/parametrizacion/usuario/PageUsuarioCreate.vue'
                                    ),
                            },
                            {
                                path: ':id',
                                name: 'PageUsuarioEdit',
                                component: () =>
                                    import(
                                        'pages/parametrizacion/usuario/PageUsuarioEdit.vue'
                                    ),
                            },
                        ],
                    },
                ],
            },
            {
                path: 'reporte',
                component: () => import('pages/reporte/PageReporte.vue'),
                children: [
                    {
                        path: '',
                        name: 'PageMenuReporte',
                        component: () =>
                            import('pages/reporte/PageMenuReporte'),
                    },
                    {
                        path: 'reporte-vivienda-encuestador',
                        name: 'ReporteViviendaEncuestador',
                        component: () =>
                            import(
                                'pages/reporte/ReporteViviendaEncuestador.vue'
                            ),
                    },
                    {
                        path: 'reporte-vivienda-consolidado',
                        name: 'ReporteViviendaConsolidado',
                        component: () =>
                            import(
                                'pages/reporte/ReporteViviendaConsolidado.vue'
                            ),
                    },
                    {
                        path: 'reporte-municipio-ficha',
                        name: 'ReporteMunicipioFicha',
                        component: () =>
                            import(
                                'pages/reporte/municipio/ReporteMunicipioFicha.vue'
                            ),
                    },
                    {
                        path: 'reporte-ico-organizacion',
                        name: 'ReporteIcoOrganizacionIndex',
                        component: () =>
                            import(
                                'pages/reporte/icos/ReporteIcoOrganizacionIndex.vue'
                            ),
                    },
                    {
                        path: 'ico/nacional/resumido/radar',
                        name: 'ReporteIcoNacionalRadarIndex',
                        component: () =>
                            import(
                                'pages/reporte/icos/nacional/ReporteIcoNacionalRadarIndex.vue'
                            ),
                    },
                    {
                        path: 'ico/departamento/resumido/radar',
                        name: 'ReporteIcoDepartamentoRadarIndex',
                        component: () =>
                            import(
                                'pages/reporte/icos/departamento-radar/ReporteIcoDepartamentoRadarIndex.vue'
                            ),
                    },
                    {
                        path: 'ico/departamento/resumido/csv',
                        name: 'ReporteIcoDepartamentoExcelResumidoIndex',
                        component: () =>
                            import(
                                'pages/reporte/icos/departamento-radar/ReporteIcoDepartamentoExcelResumidoIndex.vue'
                            ),
                    },
                    {
                        path: 'ico/departamento/extendido/csv',
                        name: 'ReporteIcoDepartamentoExcelExtendidoIndex',
                        component: () =>
                            import(
                                'pages/reporte/icos/departamento-radar/ReporteIcoDepartamentoExcelExtendidoIndex.vue'
                            ),
                    },
                    {
                        path: 'ico/municipio/resumido/radar',
                        name: 'ReporteIcoMunicipalRadarIndex',
                        component: () =>
                            import(
                                'pages/reporte/icos/municipal/ReporteIcoMunicipalRadarIndex.vue'
                            ),
                    },
                    {
                        path: 'reporte-ejemplo',
                        name: 'ReporteEjemplo',
                        component: () =>
                            import(
                                'pages/reporte/municipio/ReporteEjemplo.vue'
                            ),
                    },
                ],
            },

            {
                path: 'icos',
                component: () => import('pages/icos/PageIco.vue'),
                meta: { requiresAuth: true },
                children: [
                    {
                        path: '',
                        name: 'IcoIndex',
                        component: () => import('pages/icos/list/IcoIndex.vue'),
                        meta: { requiresAuth: true },
                    },
                    {
                        path: 'create',
                        name: 'IcoCreate',
                        component: () => import('pages/icos/IcoCreate.vue'),
                    },
                    {
                        path: 'view/:id',
                        name: 'IcoView',
                        component: () =>
                            import('pages/icos/detail/IcoView.vue'),
                    },
                ],
            },
            {
                path: 'plan-trabajo',
                component: () =>
                    import('pages/icos-plan-trabajo/PagePlanTrabajo.vue'),
                children: [
                    {
                        path: '',
                        name: 'PlanTrabajoIndex',
                        component: () =>
                            import(
                                'pages/icos-plan-trabajo/list/PlanTrabajoIndex.vue'
                            ),
                    },
                    {
                        path: 'create',
                        name: 'PlanTrabajoCreate',
                        component: () =>
                            import(
                                'pages/icos-plan-trabajo/detail/PlanTrabajoCreate.vue'
                            ),
                    },
                    {
                        path: ':id/actividades',
                        component: () =>
                            import(
                                'pages/icos-plan-trabajo/actividades/PlanTrabajoActividades.vue'
                            ),
                        children: [
                            {
                                path: '',
                                name: 'PlanTrabajoActividadesIndex',
                                component: () =>
                                    import(
                                        'pages/icos-plan-trabajo/actividades/list/PlanTrabajoActividadesIndex.vue'
                                    ),
                            },
                            {
                                path: 'create',
                                name: 'PlanTrabajoActividadCreate',
                                component: () =>
                                    import(
                                        'pages/icos-plan-trabajo/actividades/detail/PlanTrabajoActividadCreate.vue'
                                    ),
                            },
                            {
                                path: ':actividadId',
                                name: 'PlanTrabajoActividadEdit',
                                component: () =>
                                    import(
                                        'pages/icos-plan-trabajo/actividades/detail/PlanTrabajoActividadEdit.vue'
                                    ),
                            },
                        ],
                    },
                ],
            },
            {
                path: 'icos/:id',
                name: 'icos-view',
                component: () => import('pages/icos/IcoView.vue'),
            },
            {
                path: '/ficha-vivienda/:id',
                name: 'ficha-vivienda',
                component: () =>
                    import('pages/mod-viviendas/NuevaVivienda.vue'),
                children: [
                    {
                        path: '',
                        name: 'v-info-general',
                        component: () =>
                            import(
                                'pages/mod-viviendas/info-general/InfoGeneral.vue'
                            ),
                    },
                    {
                        path: 'informacion-vivienda',
                        name: 'informacion-vivienda',
                        component: () =>
                            import(
                                'pages/mod-viviendas/LocalizacionVivienda.vue'
                            ),
                    },
                    {
                        path: 'servicios-publicos',
                        name: 'servicios-vivienda',
                        component: () =>
                            import('pages/mod-viviendas/ServiciosVivienda.vue'),
                    },
                    {
                        path: 'saneamiento-basico',
                        name: 'saneamiento-basico',
                        component: () =>
                            import('pages/mod-viviendas/SaneamientoBasico.vue'),
                    },
                    {
                        path: 'personas',
                        name: 'personas-vivienda',
                        component: () =>
                            import('pages/mod-viviendas/PersonasVivienda.vue'),
                    },
                    {
                        path: 'agregar-persona',
                        name: 'agregar-persona',
                        component: () =>
                            import('pages/mod-viviendas/persona/Persona.vue'),
                    },
                    {
                        path: 'productos',
                        name: 'productos-vivienda',
                        component: () =>
                            import('pages/mod-viviendas/ProductosVivienda.vue'),
                    },
                    {
                        path: 'estado',
                        name: 'estado-vivienda',
                        component: () =>
                            import('pages/mod-viviendas/EstadoVivienda.vue'),
                    },
                    {
                        path: 'control-ficha',
                        name: 'control-vivienda',
                        component: () =>
                            import('pages/mod-viviendas/ControlVivienda.vue'),
                    },
                    {
                        path: 'fin-encuesta',
                        name: 'v-fin-encuesta',
                        component: () =>
                            import('pages/mod-viviendas/FinEncuesta.vue'),
                    },
                    {
                        path: 'view-vivienda',
                        name: 'v-ver-encuesta',
                        component: () => import('pages/mod-viviendas/View.vue'),
                    },
                ],
            },
            {
                path: 'editar-persona/:id',
                name: 'editar-persona',
                component: () =>
                    import('pages/mod-viviendas/persona/EditarPersona.vue'),
            },
            {
                path: '/jac',
                name: 'jac',
                component: () => import('pages/mod-jac/JacList.vue'),
            },
            {
                path: '/jac/:id/view',
                name: 'jac-detalle',
                component: () => import('pages/mod-jac/JacView.vue'),
                children: [
                    {
                        path: '',
                        name: 'jac-detalle-info-general',
                        component: () => import('pages/mod-jac/view/InfoGeneral.vue'),
                    },
                ]
            },

            { path: '', redirect: 'icos' },
        ],
    },
    {
        path: '/abastecimiento',
        name: 'abastecimiento',
        meta: { requiresAuth: true },
        component: () => import('layouts/AbastecimientoLayout.vue'),
        children: [
            {
                path: '',
                redirect: 'mis-ordenes'
            },
            {
                path: 'mis-ordenes',
                name: 'mis-ordenes-abastecimiento',
                component: () => import('pages/app/modulo/abastecimiento/OrdersList.vue')
            },
            {
                path: 'crear',
                name: 'crear-solicitud-abastecimiento',
                component: () => import('src/modules/solicitud-abastecimiento/ui/views/SolicitudAbastecimientoView.vue')
            },
            {
                path: 'solicitudes-registradas',
                name: 'lista-solicitudes-abastecimiento',
                component: () => import('src/modules/solicitud-abastecimiento/ui/views/ListaSolicitudesAbastecimientoView.vue')
            },
            {
                path: 'crear-orden',
                name: 'crear-orden-abastecimiento',
                component: () => import('pages/app/modulo/abastecimiento/Abastecimiento.vue')
            },
            {
              path: 'crear-plan-abastecimiento',
              name: 'Crear-plan-abastecimiento',
              component: () => import('pages/app/modulo/abastecimiento/CrearPlanAbastecimiento.vue')
            },
            {
              path: 'planes',
              name: 'lista-planes-abastecimiento',
              component: () => import('src/modules/abastecimiento/ui/views/ListarPlanesAbastecimientoView.vue')
            },
            {
              path: 'crear-rubros',
              name: 'crear-rubros',
              component: () => import('pages/app/modulo/abastecimiento/CrearRubro.vue'),
              // props: true
            },
            {
                path: 'editar-orden/:orderId',
                name: 'editar-orden-abastecimiento',
                component: () => import('pages/app/modulo/abastecimiento/Abastecimiento.vue'),
                props: true
            },
            {
                path: 'aprobaciones',
                name: 'aprobaciones-pendientes',
                component: () => import('pages/app/modulo/abastecimiento/PendingApprovalsPage.vue'),
                meta: { requiresRole: ['APPROVER', 'ADMIN'] }
            },
            {
                path: 'revision-aprobaciones',
                name: 'aprobacion-solicitudes-abastecimiento',
                component: () => import('src/modules/solicitud-abastecimiento/ui/views/AprobacionAbastecimientoView.vue')
            }
            ,
            {
                path: 'ordenes-compra',
                name: 'ordenes-compra-lista',
                component: () => import('pages/app/modulo/abastecimiento/PurchaseOrdersList.vue'),
                meta: { requiresRole: ['ADMIN', 'SUPPLY', 'SUPPLY_MANAGER'] }
            },
            {
                path: 'ordenes-compra/:id',
                name: 'ordenes-compra-detalle',
                component: () => import('pages/app/modulo/abastecimiento/PurchaseOrderDetail.vue'),
                props: true,
                meta: { requiresRole: ['ADMIN', 'SUPPLY', 'SUPPLY_MANAGER'] }
            }
            ,
            {
                path: 'crear-ocs/:orderId',
                name: 'crear-ocs',
                component: () => import('pages/app/modulo/abastecimiento/CreatePurchaseOrder.vue'),
                props: true
            },
            {
                path: 'proveedores/nuevo',
                name: 'registrar-proveedor-nuevo',
                component: () => import('src/modules/terceros/ui/views/ProveedorRegistroView.vue')
            },
            {
                path: 'proveedores',
                name: 'lista-proveedores-terceros',
                component: () => import('src/modules/terceros/ui/views/ProveedorListaView.vue')
            },
            {
                path: 'requisiciones',
                name: 'requisiciones-compras-lista',
                component: () => import('src/modules/requisicion-compras/ui/views/RequisicionesListView.vue')
            },
            {
                path: 'requisiciones/nueva',
                name: 'crear-requisicion-compras',
                component: () => import('src/modules/requisicion-compras/ui/views/RequisicionFormView.vue')
            },
            {
                path: 'autorizacion-compra',
                name: 'ordenes-compra-lista',
                component: () => import('src/modules/orden-compra/ui/views/OrdenCompraListView.vue')
            },
            {
                path: 'autorizacion-compra/nueva',
                name: 'crear-orden-compra',
                component: () => import('src/modules/orden-compra/ui/views/OrdenCompraCreateView.vue')
            },
            {
                path: 'autorizacion-compra/:id',
                name: 'detalle-orden-compra',
                component: () => import('src/modules/orden-compra/ui/views/OrdenCompraDetailView.vue')
            },
            {
                path: 'solicitudes-viaje',
                name: 'lista-solicitudes-viaje',
                component: () => import('src/modules/solicitud-viaje/ui/views/ListaSolicitudesViajeView.vue')
            },
            {
                path: 'solicitudes-viaje/nueva',
                name: 'crear-solicitud-viaje',
                component: () => import('src/modules/solicitud-viaje/ui/views/SolicitudViajeView.vue')
            },
            {
                path: 'transporte-aereo',
                name: 'lista-solicitudes-transporte',
                component: () => import('src/modules/solicitud-transporte/ui/views/SolicitudListView.vue')
            },
            {
                path: 'transporte-aereo/nueva',
                name: 'create-solicitud-transporte',
                component: () => import('src/modules/solicitud-transporte/ui/views/SolicitudCreateView.vue')
            },
            {
                path: 'transporte-terrestre',
                name: 'lista-solicitudes-terrestre',
                component: () => import('src/modules/solicitud-transporte-terrestre/ui/views/SolicitudTerrestreListView.vue')
            },
            {
                path: 'transporte-terrestre/nueva',
                name: 'create-solicitud-terrestre',
                component: () => import('src/modules/solicitud-transporte-terrestre/ui/views/SolicitudTerrestreCreateView.vue')
            }

        ]
    },
    {
        path: '/lista-proveedores-terceros',
        redirect: '/abastecimiento/proveedores'
    },
    {
        path: '/supplier',
        name: 'PageModuloSupplier',
        component: () =>
            import(
                'pages/app/modulo/supplier/PageModuloSupplier.vue'
            ),
        children: [
            {
                path: '',
                name: 'PageModuloSupplierIndex',
                component: () =>
                    import(
                        'pages/app/modulo/supplier/PageModuloSupplierIndex.vue'
                    ),
            },
        ],
    },
    {
        path: '/talento-humano',
        component: () => import('layouts/MainLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: 'registro',
                name: 'registro-colaborador',
                component: () => import('src/modules/talento-humano/ui/views/RegistroColaboradorView.vue')
            },
            {
                path: 'lista',
                name: 'lista-colaboradores',
                component: () => import('src/modules/talento-humano/ui/views/ListaColaboradoresView.vue')
            },
            {
                path: 'puestos-trabajo',
                name: 'puestos-trabajo-lista',
                component: () => import('src/modules/talento-humano/ui/views/PuestoTrabajoList.vue')
            },
            {
                path: 'puestos-trabajo/nuevo',
                name: 'puestos-trabajo-nuevo',
                component: () => import('src/modules/talento-humano/ui/views/PuestoTrabajoForm.vue')
            },
            {
                path: 'puestos-trabajo/editar/:id',
                name: 'puestos-trabajo-editar',
                component: () => import('src/modules/talento-humano/ui/views/PuestoTrabajoForm.vue')
            },
            { path: 'colaboradores/nuevo', component: () => import('src/modules/talento-humano/ui/views/ColaboradorForm.vue') }
        ]
    },
    {
        path: '/municipio/:id',
        name: 'municipio',
        meta: { requiresAuth: true },
        component: () => import('layouts/MunicipiosLayout.vue'),
        children: [
            {
                path: '',
                name: 'info-general',
                component: () =>
                    import('pages/mod-municipios/municipio/InfoGeneral.vue'),
            },
            {
                path: 'demografia',
                name: 'demografia',
                component: () =>
                    import('pages/mod-municipios/municipio/Demografia.vue'),
            },
            {
                path: 'view',
                name: 'ver-encuesta',
                component: () =>
                    import('pages/mod-municipios/municipio/View.vue'),
            },
            {
                path: 'poblacion',
                name: 'poblacion',
                component: () =>
                    import('pages/mod-municipios/municipio/Poblacion.vue'),
            },
            {
                path: 'calidad-vida',
                name: 'calidad-vida',
                component: () =>
                    import('pages/mod-municipios/municipio/CalidadVida.vue'),
            },
            {
                path: 'educacion',
                name: 'educacion',
                component: () =>
                    import('pages/mod-municipios/municipio/Educacion.vue'),
            },
            {
                path: 'viviendas-municipio',
                name: 'viviendas-municipio',
                component: () =>
                    import('pages/mod-municipios/municipio/Viviendas.vue'),
            },
            {
                path: 'cobertura-servicio',
                name: 'cobertura-servicio',
                component: () =>
                    import(
                        'pages/mod-municipios/municipio/CoberturaServicio.vue'
                    ),
            },
            {
                path: 'seguridad',
                name: 'seguridad',
                component: () =>
                    import('pages/mod-municipios/municipio/Seguridad.vue'),
            },
            {
                path: 'administracion',
                name: 'administracion',
                component: () =>
                    import(
                        'pages/mod-municipios/municipio/AdministracionPublica.vue'
                    ),
            },
            {
                path: 'secretarias',
                name: 'secretarias',
                component: () =>
                    import('pages/mod-municipios/municipio/Secretarias.vue'),
            },
            {
                path: 'politicas-publicas',
                name: 'politicas-publicas',
                component: () =>
                    import(
                        'pages/mod-municipios/municipio/PoliticasPublicas.vue'
                    ),
            },
            {
                path: 'organizaciones',
                name: 'organizaciones',
                component: () =>
                    import('pages/mod-municipios/municipio/Organizaciones.vue'),
            },
            {
                path: 'infraestructura-publica',
                name: 'infraestructura-publica',
                component: () =>
                    import(
                        'pages/mod-municipios/municipio/InfraestructuraPublica.vue'
                    ),
            },
            {
                path: 'finanza',
                name: 'finanza',
                component: () =>
                    import('pages/mod-municipios/municipio/Finanza.vue'),
            },
            {
                path: 'indicador',
                name: 'indicador',
                component: () =>
                    import('pages/mod-municipios/municipio/Indicador.vue'),
            },
            {
                path: 'territorio',
                name: 'territorio',
                component: () =>
                    import('pages/mod-municipios/municipio/Territorio.vue'),
            },
            {
                path: 'participacion',
                name: 'participacion',
                component: () =>
                    import('pages/mod-municipios/municipio/Participacion.vue'),
            },
            {
                path: 'medios',
                name: 'medios',
                component: () =>
                    import('pages/mod-municipios/municipio/Medios.vue'),
            },
            {
                path: 'economia',
                name: 'economia',
                component: () =>
                    import('pages/mod-municipios/municipio/Economia.vue'),
            },
            {
                path: 'productos',
                name: 'productos',
                component: () =>
                    import('pages/mod-municipios/municipio/Productos.vue'),
            },
            {
                path: 'fin-encuesta',
                name: 'fin-encuesta',
                component: () =>
                    import('pages/mod-municipios/municipio/FinEncuesta.vue'),
            },
        ],
    },
    {
        path: '/comunidad/:id',
        name: 'comunidad',
        meta: { requiresAuth: true },
        component: () => import('layouts/ComunidadLayout.vue'),
        children: [
            {
                path: '',
                name: 'c-info-general',
                component: () =>
                    import('pages/mod-comunidad/info-general/InfoGeneral.vue'),
            },
            {
                path: 'poblacion',
                name: 'c-poblacion',
                component: () =>
                    import('pages/mod-comunidad/poblacion/Poblacion.vue'),
            },
            {
                path: 'organizaciones',
                name: 'c-organizaciones',
                component: () =>
                    import(
                        'pages/mod-comunidad/organizaciones/Organizaciones.vue'
                    ),
            },
            {
                path: 'vias',
                name: 'c-vias-acceso',
                component: () => import('pages/mod-comunidad/vias/Vias.vue'),
            },
            {
                path: 'infraestructura',
                name: 'c-infraestructura',
                component: () =>
                    import(
                        'pages/mod-comunidad/infraestructura/Infraestructura.vue'
                    ),
            },
            {
                path: 'comunicaciones',
                name: 'c-comunicaciones',
                component: () =>
                    import('pages/mod-comunidad/comunicaciones/Medios.vue'),
            },
            {
                path: 'ecosistemas',
                name: 'c-ecosistema',
                component: () =>
                    import('pages/mod-comunidad/ecosistema/Ecosistema.vue'),
            },
            {
                path: 'salud',
                name: 'c-salud',
                component: () =>
                    import('pages/mod-comunidad/infrasalud/Infrasalud.vue'),
            },
            {
                path: 'calidad-de-vida',
                name: 'c-calidad-de-vida',
                component: () =>
                    import('pages/mod-comunidad/calidad-vida/CalidadVida.vue'),
            },
            {
                path: 'poblacion-infantil',
                name: 'c-poblacion-infantil',
                component: () =>
                    import(
                        'pages/mod-comunidad/poblacion-infantil/PoblacionInfantil.vue'
                    ),
            },
            {
                path: 'vivienda',
                name: 'c-vivienda',
                component: () =>
                    import('pages/mod-comunidad/viviendas/Viviendas.vue'),
            },
            {
                path: 'comite-emergencia',
                name: 'c-comite-emergencia',
                component: () =>
                    import(
                        'pages/mod-comunidad/comite-emergencia/ComiteEmergencia.vue'
                    ),
            },
            {
                path: 'actividades-economicas',
                name: 'c-actividades-economicas',
                component: () =>
                    import(
                        'pages/mod-comunidad/actividdes-economicas/actividades-economicas.vue'
                    ),
            },
            {
                path: 'participacion-ciudadana',
                name: 'c-participacion-ciudadana',
                component: () =>
                    import(
                        'pages/mod-comunidad/parcitipacion-ciudadana/participacion-ciudadana.vue'
                    ),
            },
            {
                path: 'programas-educativos',
                name: 'c-programas-educativos',
                component: () =>
                    import(
                        'pages/mod-comunidad/educacion/ProgramasEducativos.vue'
                    ),
            },
            {
                path: 'fiestas-tradicionales',
                name: 'c-fiestas-tradicionales',
                component: () =>
                    import(
                        'pages/mod-comunidad/fiestas-tradicionales/FiestasTradicionales.vue'
                    ),
            },
            {
                path: 'fin-encuesta',
                name: 'c-fin-encuesta',
                component: () => import('pages/mod-comunidad/FinEncuesta.vue'),
            },
            {
                path: 'view',
                name: 'c-ver-encuesta',
                component: () => import('pages/mod-comunidad/view.vue'),
            },
        ],
    },
    {
        path: '/jac/:id',
        name: 'jac-editar',
        meta: { requiresAuth: true },
        component: () => import('layouts/JacLayout.vue'),
        children: [
            {
                path: '',
                name: 'jac-info',
                component: () => import('pages/mod-jac/jac-info/JacInfo.vue'),
            },
            {
                path: 'representante-legal',
                name: 'jac-representante-legal',
                component: () =>
                    import('pages/mod-jac/jac-info/RepresentanteLegal.vue'),
            },
            {
                path: 'afiliados',
                name: 'jac-afiliados',
                component: () => import('pages/mod-jac/jac-info/Afiliados.vue'),
            },
            {
                path: 'contratos',
                name: 'j-contratos',
                component: () =>
                    import('pages/mod-jac/Contratos/Contratos.vue'),
            },
            {
                path: 'proyectos-productivos',
                name: 'j-proyectos-productivos',
                component: () =>
                    import(
                        'pages/mod-jac/ProyectosProductivos/ProyectosProductivos.vue'
                    ),
            },
            {
                path: 'participacion',
                name: 'j-participacion',
                component: () =>
                    import('pages/mod-jac/Participacion/Participacion.vue'),
            },
            {
                path: 'habilidades',
                name: 'j-habilidades',
                component: () =>
                    import('pages/mod-jac/habilidades/Habilidades.vue'),
            },
            {
                path: 'junta-directiva',
                name: 'j-junta-directiva',
                component: () =>
                    import('pages/mod-jac/JuntaDirectiva/JuntaDirectiva.vue'),
            },
            {
                path: 'fiscal',
                name: 'j-fiscal',
                component: () => import('pages/mod-jac/jac-info/Fiscal.vue'),
            },
            {
                path: 'comites-trabajo',
                name: 'j-comites-trabajo',
                component: () => import('pages/mod-jac/comites/Comites.vue'),
            },
            {
                path: 'organos-representacion',
                name: 'j-organos-representacion',
                component: () => import('pages/mod-jac/organos-representacion/OrganoRepresentacion.vue'),
            },
            {
                path: 'organos-justicia',
                name: 'j-organos-justicia',
                component: () => import('pages/mod-jac/organos-justicia/OrganoJusticia.vue'),
            },
            {
                path: 'nivel-gerencial',
                name: 'j-nivel-gerencial',
                component: () =>
                    import('pages/mod-jac/jac-info/NivelGerencial.vue'),
            },
            {
                path: 'nivel-administrativo',
                name: 'j-nivel-administrativo',
                component: () =>
                    import('pages/mod-jac/jac-info/NivelAdministrativo.vue'),
            },
            {
                path: 'balance',
                name: 'j-balance',
                component: () => import('pages/mod-jac/jac-info/Balance.vue'),
            },
        ],
    },
    {
        path: '/autoevaluacion/:id',
        name: 'autoevaluacion',
        meta: { requiresAuth: true },
        component: () => import('layouts/AutoevaluacionLayout.vue'),
        children: [
            {
                path: '',
                name: 'a-info-general',
                component: () =>
                    import(
                        'pages/mod-autoevaluacion/info-general/InfoGeneral.vue'
                    ),
            },
            {
                path: 'indicadores',
                name: 'a-indicadores',
                component: () =>
                    import(
                        'pages/mod-autoevaluacion/indicadores/Indicador.vue'
                    ),
            },
            {
                path: 'fin-encuesta',
                name: 'a-fin-encuesta',
                component: () =>
                    import('pages/mod-autoevaluacion/FinEncuesta.vue'),
            },
        ],
    },
    {
        path: '/auth',
        component: () => import('layouts/AuthLayout.vue'),
        children: [
            { path: '', component: () => import('pages/auth/PageLogin.vue') },
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '*',
        component: () => import('pages/Error404.vue'),
    },
];

export default routes;
