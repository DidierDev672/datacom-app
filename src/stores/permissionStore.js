import { defineStore } from "pinia";
import client from "src/api/client";
import { colaboradoresApi } from "src/api/colaboradores.api";

/**
 * Store de gestión de permisos por trabajador/colaborador.
 * Diseñado para Vue 2 + Pinia con @pinia/vue2 (ya instalado en boot/pinia.js).
 * Usa el cliente Axios global (src/api/client.js) que ya inyecta JWT y X-Tenantid.
 *
 * Los colaboradores se obtienen del endpoint: GET /api/v1/colaboradores
 * y se mapean al formato interno de trabajadores para mantener compatibilidad
 * con los componentes de UI existentes.
 */
export const usePermissionStore = defineStore("permissions", {
  state: () => ({
    // Resultados de búsqueda de trabajadores (mapeados desde ColaboradorDTO[])
    // Estructura interna: { id, code, fullName, position, department, active }
    workers: [],
    // Trabajador actualmente seleccionado por el administrador
    selectedWorker: null,
    // Catálogo completo de módulos con sus acciones (ModuleWithActionsDTO[])
    modules: [],
    // ID del módulo activo en la columna central
    activeModuleId: null,
    // IDs de acciones (module_actions.id) que el trabajador tiene permitidas
    grantedActionIds: [],
    isLoadingWorkers: false,
    isLoadingModules: false,
    isLoadingPermissions: false,
    isSaving: false,
    error: null,
  }),

  getters: {
    // ¿Algún actionId de este módulo está marcado?
    moduleHasAnyPermission: (state) => (moduleId) => {
      const mod = state.modules.find((m) => m.id === moduleId);
      if (!mod || !mod.actions) return false;
      return mod.actions.some(
        (a) => state.grantedActionIds.indexOf(a.id) !== -1
      );
    },

    // ¿TODAS las actions de este módulo están marcadas?
    moduleHasAllPermissions: (state) => (moduleId) => {
      const mod = state.modules.find((m) => m.id === moduleId);
      if (!mod || !mod.actions || mod.actions.length === 0) return false;
      return mod.actions.every(
        (a) => state.grantedActionIds.indexOf(a.id) !== -1
      );
    },

    // Módulo cuyas acciones se muestran en la columna 3
    actionsOfActiveModule: (state) => {
      if (state.activeModuleId === null || state.activeModuleId === undefined)
        return null;
      return state.modules.find((m) => m.id === state.activeModuleId) || null;
    },

    // Conteo en tiempo real para el badge superior
    totalGrantedCount: (state) => state.grantedActionIds.length,
  },

  actions: {
    /**
     * Busca colaboradores usando el endpoint /api/v1/colaboradores.
     * Mapea los campos de ColaboradorDTO al formato interno de trabajadores.
     * @param {string} term - Término de búsqueda (nombre, código o documento)
     */
    async searchWorkers(term) {
      this.isLoadingWorkers = true;
      this.error = null;
      try {
        // Llamada al endpoint de colaboradores
        const colaboradores = await colaboradoresApi.search(term);

        // Mapeo de ColaboradorDTO a WorkerSummaryDTO interno
        this.workers = (colaboradores || []).map((c) => ({
          id: c.id,
          code: c.codigoCargo || c.numeroDocumento || "N/A",
          fullName: c.nombreCompleto || "Sin nombre",
          position: c.cargoAsignado || c.nombreCargo || "Sin cargo",
          department: c.areaDepartamento || "Sin departamento",
          active: c.estado === "Activo" || c.estado === "ACTIVO" || true,
        }));
      } catch (err) {
        this.error =
          err && err.message
            ? err.message
            : "No se pudieron cargar los colaboradores";
        this.workers = [];
      } finally {
        this.isLoadingWorkers = false;
      }
    },

    /**
     * Carga los módulos del sistema definidos en el layout principal.
     * Estos coinciden con los ítems del menú de navegación en MainLayout.vue.
     * Cada módulo tiene las 6 acciones estándar: READ, CREATE, UPDATE, DELETE, VALIDATE, AUTHORIZE.
     */
    async fetchModules() {
      this.isLoadingModules = true;
      this.error = null;
      try {
        // Módulos extraídos de MainLayout.vue (essentialLinks)
        // Estructura: id, code, name, icon, description, displayOrder, actions[]
        // Sub-ítems derivados de routes.js y MainLayout.vue (essentialLinks + children de rutas)
        const systemModules = [
          {
            id: 1,
            code: "INICIO",
            name: "Inicio",
            icon: "home",
            description: "Página principal del sistema",
            displayOrder: 1,
            // Vista directa sin sub-páginas (ruta: /, componente: PageHome.vue)
            subItems: [],
            actions: this.generateStandardActions(1),
          },
          {
            id: 2,
            code: "ENCUESTAS",
            name: "Encuestas",
            icon: "bar_chart",
            description: "Gestión de encuestas y formularios",
            displayOrder: 2,
            // Rutas hijas de /encuestas (PageEncuesta.vue → children en routes.js)
            subItems: [
              {
                id: 201,
                title: "Listado de encuestas",
                icon: "list",
                link: "/encuestas",
                routeName: "PageMenuEncuestas",
              },
              {
                id: 202,
                title: "Encuestas cerradas",
                icon: "lock",
                link: "/encuestas/cerradas",
                routeName: "PageEncuestasCerradas",
              },
              {
                id: 203,
                title: "Encuestas en proceso",
                icon: "pending_actions",
                link: "/encuestas/proceso",
                routeName: "PageEncuestasEnProceso",
              },
            ],
            actions: this.generateStandardActions(2),
          },
          {
            id: 3,
            code: "MUNICIPIOS",
            name: "Municipios",
            icon: "location_city",
            description: "Gestión de información municipal",
            displayOrder: 3,
            // Ruta: /app/municipios → PageModuloMunicipioIndex (sin sub-rutas adicionales en nav)
            subItems: [
              {
                id: 301,
                title: "Lista de municipios",
                icon: "list",
                link: "/app/municipios",
                routeName: "PageModuloMunicipioIndex",
              },
            ],
            actions: this.generateStandardActions(3),
          },
          {
            id: 4,
            code: "COMUNIDADES",
            name: "Comunidades",
            icon: "people",
            description: "Gestión de comunidades",
            displayOrder: 4,
            // Ruta: /app/comunidad → PageModuloComunidadIndex
            subItems: [
              {
                id: 401,
                title: "Lista de comunidades",
                icon: "list",
                link: "/app/comunidad",
                routeName: "PageModuloComunidadIndex",
              },
            ],
            actions: this.generateStandardActions(4),
          },
          {
            id: 5,
            code: "VIVIENDAS",
            name: "Viviendas",
            icon: "house",
            description: "Registro y seguimiento de viviendas",
            displayOrder: 5,
            // Ruta: /app/vivienda → PageModuloViviendaIndex (fichas abren layout propio /ficha-vivienda/:id)
            subItems: [
              {
                id: 501,
                title: "Lista de viviendas",
                icon: "list",
                link: "/app/vivienda",
                routeName: "PageModuloViviendaIndex",
              },
              {
                id: 502,
                title: "Nueva ficha de vivienda",
                icon: "add_home",
                link: "/ficha-vivienda/nueva",
                routeName: "v-info-general",
              },
            ],
            actions: this.generateStandardActions(5),
          },
          {
            id: 6,
            code: "JAC",
            name: "JAC",
            icon: "groups",
            description: "Junta de Acción Comunal",
            displayOrder: 6,
            // Rutas: /jac (lista) y /jac/:id/view (detalle) en routes.js
            subItems: [
              {
                id: 601,
                title: "Lista de JAC",
                icon: "list",
                link: "/jac",
                routeName: "jac",
              },
              {
                id: 602,
                title: "Detalle de JAC",
                icon: "info",
                link: "/jac/:id/view",
                routeName: "jac-detalle",
              },
            ],
            actions: this.generateStandardActions(6),
          },
          {
            id: 7,
            code: "ICOS",
            name: "Icos",
            icon: "edit",
            description: "Indicadores de Calidad de Vida",
            displayOrder: 7,
            // Rutas hijas de /icos en routes.js: index (list), create, view/:id
            subItems: [
              {
                id: 701,
                title: "Lista de ICOs",
                icon: "list",
                link: "/icos",
                routeName: "IcoIndex",
              },
              {
                id: 702,
                title: "Crear ICO",
                icon: "add",
                link: "/icos/create",
                routeName: "IcoCreate",
              },
              {
                id: 703,
                title: "Ver detalle ICO",
                icon: "visibility",
                link: "/icos/view/:id",
                routeName: "IcoView",
              },
            ],
            actions: this.generateStandardActions(7),
          },
          {
            id: 8,
            code: "PLANES_TRABAJO",
            name: "Planes de Trabajo",
            icon: "assignment",
            description: "Gestión de planes de trabajo",
            displayOrder: 8,
            // Rutas hijas de /plan-trabajo en routes.js: index, create, :id/actividades (con sub-rutas)
            subItems: [
              {
                id: 801,
                title: "Lista de planes de trabajo",
                icon: "list",
                link: "/plan-trabajo",
                routeName: "PlanTrabajoIndex",
              },
              {
                id: 802,
                title: "Crear plan de trabajo",
                icon: "add",
                link: "/plan-trabajo/create",
                routeName: "PlanTrabajoCreate",
              },
              {
                id: 803,
                title: "Actividades del plan",
                icon: "checklist",
                link: "/plan-trabajo/:id/actividades",
                routeName: "PlanTrabajoActividadesIndex",
              },
              {
                id: 804,
                title: "Crear actividad",
                icon: "add_task",
                link: "/plan-trabajo/:id/actividades/create",
                routeName: "PlanTrabajoActividadCreate",
              },
            ],
            actions: this.generateStandardActions(8),
          },
          {
            id: 9,
            code: "ABASTECIMIENTO",
            name: "Abastecimiento",
            icon: "inventory",
            description: "Gestión de abastecimiento y compras",
            displayOrder: 9,
            // Rutas hijas de /abastecimiento (AbastecimientoLayout) en routes.js
            subItems: [
              {
                id: 901,
                title: "Mis órdenes",
                icon: "inbox",
                link: "/abastecimiento/mis-ordenes",
                routeName: "mis-ordenes-abastecimiento",
              },
              {
                id: 902,
                title: "Crear solicitud de abastecimiento",
                icon: "add",
                link: "/abastecimiento/crear",
                routeName: "crear-solicitud-abastecimiento",
              },
              {
                id: 903,
                title: "Solicitudes registradas",
                icon: "list",
                link: "/abastecimiento/solicitudes-registradas",
                routeName: "lista-solicitudes-abastecimiento",
              },
              {
                id: 904,
                title: "Planes de abastecimiento",
                icon: "event_note",
                link: "/abastecimiento/planes",
                routeName: "lista-planes-abastecimiento",
              },
              {
                id: 905,
                title: "Aprobaciones pendientes",
                icon: "approval",
                link: "/abastecimiento/aprobaciones",
                routeName: "aprobaciones-pendientes",
              },
              {
                id: 906,
                title: "Revisión de aprobaciones",
                icon: "rate_review",
                link: "/abastecimiento/revision-aprobaciones",
                routeName: "aprobacion-solicitudes-abastecimiento",
              },
              {
                id: 907,
                title: "Órdenes de compra (lista)",
                icon: "shopping_cart",
                link: "/abastecimiento/ordenes-compra",
                routeName: "ordenes-compra-lista",
              },
              {
                id: 908,
                title: "Gestión órdenes de compra",
                icon: "add_shopping_cart",
                link: "/abastecimiento/ordenes-compra/gestion",
                routeName: "gestion-orden-compra",
              },
              {
                id: 922,
                title: "Lista de gestión de compras",
                icon: "format_list_bulleted",
                link: "/abastecimiento/ordenes-compra/transacciones",
                routeName: "lista-transacciones-compra",
              },
              {
                id: 923,
                title: "Comparación de proveedores",
                icon: "compare_arrows",
                link: "/abastecimiento/ordenes-compra/comparacion-proveedores",
                routeName: "comparacion-proveedores-compra",
              },
              {
                id: 924,
                title: "Lista de comparaciones",
                icon: "format_list_bulleted",
                link: "/abastecimiento/ordenes-compra/comparaciones-proveedores",
                routeName: "lista-comparaciones-proveedores-compra",
              },
              {
                id: 909,
                title: "Requisiciones",
                icon: "receipt_long",
                link: "/abastecimiento/requisiciones",
                routeName: "requisiciones-compras-lista",
              },
              {
                id: 910,
                title: "Nueva requisición",
                icon: "post_add",
                link: "/abastecimiento/requisiciones/nueva",
                routeName: "crear-requisicion-compras",
              },
              {
                id: 911,
                title: "Cotizaciones",
                icon: "request_quote",
                link: "/abastecimiento/cotizaciones",
                routeName: "cotizaciones-list",
              },
              {
                id: 912,
                title: "Nueva cotización",
                icon: "add",
                link: "/abastecimiento/cotizaciones/nueva",
                routeName: "cotizacion-create",
              },
              {
                id: 913,
                title: "Transporte aéreo",
                icon: "flight",
                link: "/abastecimiento/transporte-aereo",
                routeName: "lista-solicitudes-transporte",
              },
              {
                id: 914,
                title: "Nueva solicitud de transporte aéreo",
                icon: "flight_takeoff",
                link: "/abastecimiento/transporte-aereo/nueva",
                routeName: "create-solicitud-transporte",
              },
              {
                id: 915,
                title: "Transporte terrestre",
                icon: "directions_car",
                link: "/abastecimiento/transporte-terrestre",
                routeName: "lista-solicitudes-terrestre",
              },
              {
                id: 916,
                title: "Nueva solicitud de transporte terrestre",
                icon: "directions_bus",
                link: "/abastecimiento/transporte-terrestre/nueva",
                routeName: "create-solicitud-terrestre",
              },
              {
                id: 917,
                title: "Solicitudes de viaje",
                icon: "luggage",
                link: "/abastecimiento/solicitudes-viaje",
                routeName: "lista-solicitudes-viaje",
              },
              {
                id: 918,
                title: "Nueva solicitud de viaje",
                icon: "add",
                link: "/abastecimiento/solicitudes-viaje/nueva",
                routeName: "crear-solicitud-viaje",
              },
              {
                id: 919,
                title: "Proveedores",
                icon: "store",
                link: "/abastecimiento/proveedores",
                routeName: "lista-proveedores-terceros",
              },
              {
                id: 920,
                title: "Registrar proveedor",
                icon: "add_business",
                link: "/abastecimiento/proveedores/nuevo",
                routeName: "registrar-proveedor-nuevo",
              },
            ],
            actions: this.generateStandardActions(9),
          },
          {
            id: 10,
            code: "TALENTO_HUMANO",
            name: "Talento Humano",
            icon: "person",
            description: "Gestión de empleados y colaboradores",
            displayOrder: 10,
            // Hijos directos de essentialLinks en MainLayout.vue (children de "Gestión de empleados")
            // + rutas bajo /talento-humano en routes.js
            subItems: [
              {
                id: 1003,
                title: "Ver detalle de departamento",
                icon: "visibility",
                link: "/talento-humano/departamentos/view/:id",
                routeName: "departamento-view",
              },
              {
                id: 1004,
                title: "Editar departamento",
                icon: "edit",
                link: "/talento-humano/departamentos/edit/:id",
                routeName: "departamento-edit",
              },
              {
                id: 1005,
                title: "Lista de puestos de trabajo",
                icon: "work",
                link: "/talento-humano/puestos-trabajo",
                routeName: "puestos-trabajo-lista",
              },
              {
                id: 1006,
                title: "Crear puesto de trabajo",
                icon: "add",
                link: "/talento-humano/puestos-trabajo/nuevo",
                routeName: "puestos-trabajo-nuevo",
              },
              {
                id: 1007,
                title: "Editar puesto de trabajo",
                icon: "edit",
                link: "/talento-humano/puestos-trabajo/editar/:id",
                routeName: "puestos-trabajo-editar",
              },
              {
                id: 1008,
                title: "Registro de empleado",
                icon: "person_add",
                link: "/talento-humano/colaboradores/nuevo",
                routeName: "registro-colaborador",
              },
              {
                id: 1012,
                title: "Datos básicos de empleado",
                icon: "badge",
                link: "/talento-humano/empleados/datos-basicos",
                routeName: "employee-basic-data",
              },
              {
                id: 1013,
                title: "Lista de empleados",
                icon: "people",
                link: "/talento-humano/empleados/lista",
                routeName: "lista-empleados",
              },
              {
                id: 1009,
                title: "Gestión de colaboradores",
                icon: "groups",
                link: "/talento-humano/lista",
                routeName: "lista-colaboradores",
              },
              {
                id: 1011,
                title: "Registrar departamentos",
                icon: "domain_add",
                link: "/talento-humano/departamentos/nuevo",
                routeName: "departamento-create",
              },
              {
                id: 1014,
                title: "Lista de departamentos",
                icon: "corporate_fare",
                link: "/talento-humano/departamentos",
                routeName: "departamentos-lista",
              },
              {
                id: 1015,
                title: "Asignar permisos operativos",
                icon: "admin_panel_settings",
                link: "/talento-humano/permisos-operativos",
                routeName: "colaborador-permisos-create",
              },
              {
                id: 1016,
                title: "Crear usuario del sistema",
                icon: "person_add",
                link: "/talento-humano/usuarios/crear",
                routeName: "crear-usuario-sistema",
              },
              {
                id: 1010,
                title: "Permisos para colaboradores",
                icon: "lock",
                link: "/admin/permissions",
                routeName: "worker-permissions",
              },
            ],
            actions: this.generateStandardActions(10),
          },
          {
            id: 11,
            code: "PARAMETRIZACION",
            name: "Parametrización",
            icon: "settings",
            description: "Configuración del sistema",
            displayOrder: 11,
            // Rutas hijas de /parametrizacion en routes.js
            subItems: [
              {
                id: 1101,
                title: "Menú de parametrización",
                icon: "menu",
                link: "/parametrizacion",
                routeName: "PageMenuParametrizacion",
              },
              {
                id: 1102,
                title: "Categorías",
                icon: "category",
                link: "/parametrizacion/categoria",
                routeName: "PageCategoriaIndex",
              },
              {
                id: 1103,
                title: "Crear categoría",
                icon: "add",
                link: "/parametrizacion/categoria/create",
                routeName: "PageCategoriaCreate",
              },
              {
                id: 1104,
                title: "Parámetros",
                icon: "tune",
                link: "/parametrizacion/parametro",
                routeName: "PageParametroIndex",
              },
              {
                id: 1105,
                title: "Crear parámetro",
                icon: "add",
                link: "/parametrizacion/parametro/create",
                routeName: "PageParametroCreate",
              },
              {
                id: 1106,
                title: "Departamentos (param.)",
                icon: "domain",
                link: "/parametrizacion/departamento",
                routeName: "PageDepartamentoIndex",
              },
              {
                id: 1107,
                title: "Municipios (param.)",
                icon: "location_city",
                link: "/parametrizacion/municipio",
                routeName: "PageMunicipioIndex",
              },
              {
                id: 1108,
                title: "Comunidades (param.)",
                icon: "people",
                link: "/parametrizacion/comunidad",
                routeName: "PageComunidadIndex",
              },
              {
                id: 1109,
                title: "Crear comunidad",
                icon: "add",
                link: "/parametrizacion/comunidad/create",
                routeName: "PageComunidadCreate",
              },
              {
                id: 1110,
                title: "Organizaciones de base",
                icon: "groups",
                link: "/parametrizacion/organizaciones-base",
                routeName: "PageJacCreate",
              },
              {
                id: 1111,
                title: "Usuarios",
                icon: "manage_accounts",
                link: "/parametrizacion/usuario",
                routeName: "PageUsuarioIndex",
              },
              {
                id: 1112,
                title: "Crear usuario",
                icon: "person_add",
                link: "/parametrizacion/usuario/create",
                routeName: "PageUsuarioCreate",
              },
            ],
            actions: this.generateStandardActions(11),
          },
          {
            id: 12,
            code: "REPORTES",
            name: "Reportes",
            icon: "assessment",
            description: "Reportes y exportación de datos",
            displayOrder: 12,
            // Rutas hijas de /reporte en routes.js
            subItems: [
              {
                id: 1201,
                title: "Menú de reportes",
                icon: "menu",
                link: "/reporte",
                routeName: "PageMenuReporte",
              },
              {
                id: 1202,
                title: "Reporte vivienda encuestador",
                icon: "home",
                link: "/reporte/reporte-vivienda-encuestador",
                routeName: "ReporteViviendaEncuestador",
              },
              {
                id: 1203,
                title: "Reporte vivienda consolidado",
                icon: "summarize",
                link: "/reporte/reporte-vivienda-consolidado",
                routeName: "ReporteViviendaConsolidado",
              },
              {
                id: 1204,
                title: "Ficha municipio",
                icon: "location_city",
                link: "/reporte/reporte-municipio-ficha",
                routeName: "ReporteMunicipioFicha",
              },
              {
                id: 1205,
                title: "Reporte ICO organización",
                icon: "bar_chart",
                link: "/reporte/reporte-ico-organizacion",
                routeName: "ReporteIcoOrganizacionIndex",
              },
              {
                id: 1206,
                title: "Reporte ICO nacional (radar)",
                icon: "radar",
                link: "/reporte/ico/nacional/resumido/radar",
                routeName: "ReporteIcoNacionalRadarIndex",
              },
              {
                id: 1207,
                title: "Reporte ICO departamental (radar)",
                icon: "donut_large",
                link: "/reporte/ico/departamento/resumido/radar",
                routeName: "ReporteIcoDepartamentoRadarIndex",
              },
              {
                id: 1208,
                title: "Reporte ICO departamental (CSV)",
                icon: "table_chart",
                link: "/reporte/ico/departamento/resumido/csv",
                routeName: "ReporteIcoDepartamentoExcelResumidoIndex",
              },
              {
                id: 1209,
                title: "Reporte ICO departamental extendido (CSV)",
                icon: "grid_on",
                link: "/reporte/ico/departamento/extendido/csv",
                routeName: "ReporteIcoDepartamentoExcelExtendidoIndex",
              },
              {
                id: 1210,
                title: "Reporte ICO municipal (radar)",
                icon: "pie_chart",
                link: "/reporte/ico/municipio/resumido/radar",
                routeName: "ReporteIcoMunicipalRadarIndex",
              },
            ],
            actions: this.generateStandardActions(12),
          },
        ];

        this.modules = systemModules;

        // Establecer el primer módulo como activo por defecto
        if (systemModules.length > 0 && !this.activeModuleId) {
          this.activeModuleId = systemModules[0].id;
        }
      } catch (err) {
        this.error =
          err && err.message
            ? err.message
            : "No se pudieron cargar los módulos";
        this.modules = [];
      } finally {
        this.isLoadingModules = false;
      }
    },

    /**
     * Genera las 6 acciones estándar para un módulo.
     * @param {number} moduleId - ID del módulo padre
     * @returns {Array} Lista de acciones con IDs únicos
     */
    generateStandardActions(moduleId) {
      const baseId = moduleId * 100; // Para asegurar IDs únicos por módulo
      return [
        {
          id: baseId + 1,
          code: "READ",
          label: "Ver formularios",
          displayOrder: 1,
        },
        { id: baseId + 2, code: "CREATE", label: "Crear", displayOrder: 2 },
        {
          id: baseId + 3,
          code: "UPDATE",
          label: "Actualizar",
          displayOrder: 3,
        },
        { id: baseId + 4, code: "DELETE", label: "Eliminar", displayOrder: 4 },
        { id: baseId + 5, code: "VALIDATE", label: "Validar", displayOrder: 5 },
        {
          id: baseId + 6,
          code: "AUTHORIZE",
          label: "Autorizar",
          displayOrder: 6,
        },
      ];
    },

    async fetchWorkerPermissions(workerId) {
      if (workerId === null || workerId === undefined) return;
      this.isLoadingPermissions = true;
      this.error = null;
      try {
        const response = await client.get(
          "/api/workers/" + workerId + "/permissions"
        );
        const data = response.data || {};
        this.grantedActionIds = Array.isArray(data.grantedActionIds)
          ? data.grantedActionIds.slice()
          : [];

        // UX: al cargar permisos, seleccionar automáticamente el primer módulo
        // que tenga al menos una acción marcada; si no hay, el primer módulo del catálogo.
        const firstWithPerm = this.modules.find(
          (m) =>
            m.actions &&
            m.actions.some((a) => this.grantedActionIds.indexOf(a.id) !== -1)
        );
        if (firstWithPerm) {
          this.activeModuleId = firstWithPerm.id;
        } else if (this.modules.length > 0) {
          this.activeModuleId = this.modules[0].id;
        }
      } catch (err) {
        this.error =
          err && err.message
            ? err.message
            : "No se pudieron cargar los permisos";
        this.grantedActionIds = [];
      } finally {
        this.isLoadingPermissions = false;
      }
    },

    async savePermissions() {
      if (!this.selectedWorker) {
        throw new Error("No hay trabajador seleccionado");
      }
      this.isSaving = true;
      this.error = null;
      try {
        const url = "/api/workers/" + this.selectedWorker.id + "/permissions";
        const response = await client.put(url, {
          actionIds: this.grantedActionIds.slice(),
        });
        return response.data;
      } catch (err) {
        const msg =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : err && err.message
            ? err.message
            : "No se pudieron guardar los permisos";
        this.error = msg;
        throw err;
      } finally {
        this.isSaving = false;
      }
    },

    async revokeAllPermissions() {
      if (!this.selectedWorker) return;
      this.isSaving = true;
      try {
        const url = "/api/workers/" + this.selectedWorker.id + "/permissions";
        const response = await client.delete(url);
        this.grantedActionIds = [];
        return response.data;
      } catch (err) {
        this.error =
          err && err.message
            ? err.message
            : "No se pudieron revocar los permisos";
        throw err;
      } finally {
        this.isSaving = false;
      }
    },

    async selectWorker(worker) {
      this.selectedWorker = worker;
      this.workers = [];
      this.grantedActionIds = [];
      if (worker && worker.id) {
        await this.fetchWorkerPermissions(worker.id);
      }
    },

    clearSelection() {
      this.selectedWorker = null;
      this.grantedActionIds = [];
      this.activeModuleId = this.modules.length > 0 ? this.modules[0].id : null;
    },

    setActiveModule(moduleId) {
      this.activeModuleId = moduleId;
    },

    toggleAction(actionId) {
      const idx = this.grantedActionIds.indexOf(actionId);
      if (idx === -1) {
        this.grantedActionIds.push(actionId);
      } else {
        this.grantedActionIds.splice(idx, 1);
      }
    },

    // Revoca todos los permisos del trabajador seleccionado (reset local)
    async revokeAllPermissions() {
      if (!this.selectedWorker) return;
      this.grantedActionIds = [];
    },

    // Marca/desmarca todas las acciones de un módulo de una sola vez.
    // checked=true → agrega todos los actionIds del módulo (sin duplicar).
    // checked=false → remueve todos los actionIds del módulo.
    toggleModule(moduleId, checked) {
      const mod = this.modules.find((m) => m.id === moduleId);
      if (!mod || !mod.actions) return;
      const actionIds = mod.actions.map((a) => a.id);

      if (checked) {
        const set = {};
        this.grantedActionIds.forEach((id) => {
          set[id] = true;
        });
        actionIds.forEach((id) => {
          set[id] = true;
        });
        this.grantedActionIds = Object.keys(set).map((k) => parseInt(k, 10));
      } else {
        this.grantedActionIds = this.grantedActionIds.filter(
          (id) => actionIds.indexOf(id) === -1
        );
      }
    },
  },
});
