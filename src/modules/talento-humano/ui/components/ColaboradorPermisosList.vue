<template>
  <q-card flat bordered class="permisos-list-card">
    <q-card-section class="q-pb-sm">
      <div class="row items-start items-md-center q-col-gutter-sm">
        <div class="col-12 col-md">
          <div class="text-h6 text-weight-bold text-dark">
            Permisos asignados
          </div>
          <p class="permisos-list-lead q-mb-none q-mt-xs text-body2 text-grey-8">
            Consulta los empleados con permisos operativos y administra sus asignaciones.
          </p>
        </div>
        <div class="col-12 col-md-auto">
          <q-btn
            flat
            no-caps
            color="primary"
            icon="refresh"
            label="Actualizar"
            :loading="cargando"
            @click="cargar"
          />
        </div>
      </div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-pb-none">
      <UsuarioSesionPermisosPanel @edit-sesion="$emit('edit-sesion')" />
    </q-card-section>

    <q-card-section class="q-pb-sm">
      <q-input
        v-model="filtro"
        dense
        outlined
        clearable
        debounce="300"
        placeholder="Buscar por empleado o departamento…"
        aria-label="Buscar permisos asignados"
        class="permisos-list-search"
      >
        <template v-slot:prepend>
          <q-icon name="search" class="text-grey-6" />
        </template>
      </q-input>
      <div
        v-if="filtro"
        class="permisos-list-hint q-mt-sm text-caption text-grey-7"
      >
        Mostrando <strong>{{ filasFiltradas.length }}</strong> de
        {{ registros.length }} asignaciones
      </div>
    </q-card-section>

    <div class="permisos-list-table-wrap">
      <q-table
        :data="filasFiltradas"
        :columns="columnas"
        row-key="id"
        :loading="cargando"
        binary-state-sort
        :pagination.sync="paginacion"
        :rows-per-page-options="opcionesFilasPorPagina"
        hide-bottom
        flat
        :dense="$q.screen.lt.md"
        class="permisos-list-table"
        separator="horizontal"
        wrap-cells
      >
        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey-7 q-pa-lg">
            <div class="column items-center q-gutter-sm">
              <q-icon name="admin_panel_settings" size="48px" />
              <span v-if="cargando">Cargando permisos…</span>
              <span v-else-if="registros.length === 0">
                No hay permisos asignados todavía.
              </span>
              <span v-else>
                Ningún resultado con la búsqueda actual.
              </span>
            </div>
          </div>
        </template>

        <template v-slot:body-cell-colaboradorNombre="props">
          <q-td :props="props">
            <div class="permisos-list-employee">
              <div class="permisos-list-employee__name">
                {{ props.row.colaboradorNombre || 'Sin nombre' }}
              </div>
              <div
                v-if="props.row.departamentoNombre"
                class="permisos-list-employee__dept text-caption text-grey-7"
              >
                {{ props.row.departamentoNombre }}
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-totalPermisos="props">
          <q-td :props="props" class="text-center">
            <q-chip
              dense
              outline
              :color="props.row.totalPermisos > 0 ? 'primary' : 'grey-6'"
              :text-color="props.row.totalPermisos > 0 ? 'primary' : 'grey-7'"
              class="permisos-list-count-chip"
            >
              {{ props.row.totalPermisos }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td :props="props">
            <div class="row no-wrap items-center justify-center permisos-list-actions">
              <q-btn
                flat
                round
                dense
                color="grey-8"
                icon="visibility"
                class="permisos-list-action-btn"
                @click="verDetalle(props.row)"
              >
                <q-tooltip>Ver detalle</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="grey-8"
                icon="edit"
                class="permisos-list-action-btn"
                @click="editar(props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                class="permisos-list-action-btn"
                :loading="eliminandoId === props.row.id"
                @click="confirmarEliminar(props.row)"
              >
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-separator />

    <q-card-section class="q-pt-md q-pb-sm">
      <div
        class="row items-center cursor-pointer"
        @click="visibilidadExpandida = !visibilidadExpandida"
      >
        <div class="text-h6 text-weight-bold text-dark">
          Permitir visibilidad a esta serie de componentes
        </div>
        <q-space />
        <q-icon
          :name="visibilidadExpandida ? 'expand_less' : 'expand_more'"
          color="grey-6"
          size="sm"
        />
      </div>
      <p class="text-body2 text-grey-8 q-mb-none q-mt-xs">
        Selecciona los componentes del módulo de abastecimiento a los que este colaborador tendrá visibilidad.
      </p>
    </q-card-section>

    <q-slide-transition>
      <div v-show="visibilidadExpandida">
        <q-card-section class="q-pt-none q-pb-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-4">
              <div class="visibilidad-grupo">
                <div class="visibilidad-grupo__header">
                  <q-icon name="assignment" size="sm" class="q-mr-xs" />
                  <span>Plan de abastecimiento</span>
                </div>
                <q-checkbox
                  v-model="visibilidad.visibilidadCrearPlanAbastecimiento"
                  label="Crear plan de abastecimiento"
                  dense
                  color="primary"
                  class="visibilidad-checkbox"
                >
                  <q-tooltip>Permite ver el componente CrearPlanAbastecimiento.vue</q-tooltip>
                </q-checkbox>
                <q-checkbox
                  v-model="visibilidad.visibilidadSupplyPlanTable"
                  label="Lista de planes de abastecimiento"
                  dense
                  color="primary"
                  class="visibilidad-checkbox"
                >
                  <q-tooltip>Permite ver el componente SupplyPlanTable.vue</q-tooltip>
                </q-checkbox>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-md-4">
              <div class="visibilidad-grupo">
                <div class="visibilidad-grupo__header">
                  <q-icon name="category" size="sm" class="q-mr-xs" />
                  <span>Rubros</span>
                </div>
                <q-checkbox
                  v-model="visibilidad.visibilidadCrearRubros"
                  label="CrearRubros.vue"
                  dense
                  color="primary"
                  class="visibilidad-checkbox"
                >
                  <q-tooltip>Permite ver el componente CrearRubros.vue</q-tooltip>
                </q-checkbox>
                <q-checkbox
                  v-model="visibilidad.visibilidadBudgetCategoriasList"
                  label="Lista de categorías de rubro"
                  dense
                  color="primary"
                  class="visibilidad-checkbox"
                >
                  <q-tooltip>Permite ver el componente BudgetCategoriasList.vue</q-tooltip>
                </q-checkbox>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-md-4">
              <div class="visibilidad-grupo">
                <div class="visibilidad-grupo__header">
                  <q-icon name="description" size="sm" class="q-mr-xs" />
                  <span>Requisiciones</span>
                </div>
                <q-checkbox
                  v-model="visibilidad.visibilidadCrearRequisicionFormView"
                  label="Crear solicitud de requisiciones"
                  dense
                  color="primary"
                  class="visibilidad-checkbox"
                >
                  <q-tooltip>Permite ver el componente CrearRequisicionFormView.vue</q-tooltip>
                </q-checkbox>
                <q-checkbox
                  v-model="visibilidad.visibilidadRequisicionesListView"
                  label="Lista de solicitudes"
                  dense
                  color="primary"
                  class="visibilidad-checkbox"
                >
                  <q-tooltip>Permite ver el componente RequisicionesListView.vue</q-tooltip>
                </q-checkbox>
              </div>
            </div>

            <div class="col-12 col-sm-6 col-md-4">
              <div class="visibilidad-grupo">
                <div class="visibilidad-grupo__header">
                  <q-icon name="shopping_cart" size="sm" class="q-mr-xs" />
                  <span>Compras</span>
                </div>
                <q-checkbox
                  v-model="visibilidad.visibilidadGestionOrdenCompra"
                  label="Gestión de órdenes de compra"
                  dense
                  color="primary"
                  class="visibilidad-checkbox"
                >
                  <q-tooltip>Permite ver el componente GestionOrdenCompraView.vue</q-tooltip>
                </q-checkbox>
                <q-checkbox
                  v-model="visibilidad.visibilidadTransaccionesCompra"
                  label="Lista de gestión de compras"
                  dense
                  color="primary"
                  class="visibilidad-checkbox"
                >
                  <q-tooltip>Permite ver el componente PurchaseTransactionsListView.vue</q-tooltip>
                </q-checkbox>
                <q-checkbox
                  v-model="visibilidad.visibilidadComparacionProveedores"
                  label="Comparación de proveedores"
                  dense
                  color="primary"
                  class="visibilidad-checkbox"
                >
                  <q-tooltip>Permite ver el componente SupplierComparisonView.vue</q-tooltip>
                </q-checkbox>
                <q-checkbox
                  v-model="visibilidad.visibilidadComparacionesProveedores"
                  label="Lista de comparaciones"
                  dense
                  color="primary"
                  class="visibilidad-checkbox"
                >
                  <q-tooltip>Permite ver el componente SupplierComparisonsList.vue</q-tooltip>
                </q-checkbox>
              </div>
            </div>
          </div>

          <div class="row q-mt-md">
            <q-btn
              unelevated
              no-caps
              color="primary"
              label="Guardar visibilidad"
              class="visibilidad-save-btn"
              :disable="!visibilidadModificado"
              @click="guardarVisibilidad"
            />
          </div>
        </q-card-section>

        <q-separator />
      </div>
    </q-slide-transition>

    <!-- Modal de éxito visibilidad -->
    <q-dialog v-model="mostrarVisibilidadExito" persistent transition-show="scale" transition-hide="scale">
      <q-card class="visibilidad-modal visibilidad-modal--exito">
        <q-card-section class="text-center q-pt-lg q-pb-sm">
          <q-icon name="check_circle" size="64px" color="positive" />
          <div class="text-h5 text-weight-bold q-mt-sm text-dark">Visibilidad guardada</div>
        </q-card-section>
        <q-card-section class="q-pt-sm text-center">
          <p class="text-body1 text-grey-8 q-mb-sm">
            Los componentes seleccionados ahora están disponibles para el colaborador.
          </p>
          <p class="text-body2 text-grey-7">
            Gracias a tu gestión, el equipo accederá exactamente a lo que necesita para trabajar.
          </p>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg q-pt-none">
          <q-btn unelevated no-caps color="positive" label="Entendido" class="visibilidad-modal-btn" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de error visibilidad -->
    <q-dialog v-model="mostrarVisibilidadError" persistent transition-show="scale" transition-hide="scale">
      <q-card class="visibilidad-modal visibilidad-modal--error">
        <q-card-section class="text-center q-pt-lg q-pb-sm">
          <q-icon name="warning" size="64px" color="warning" />
          <div class="text-h5 text-weight-bold q-mt-sm text-dark">No se pudo guardar la visibilidad</div>
        </q-card-section>
        <q-card-section class="q-pt-sm text-center">
          <p class="text-body1 text-grey-8 q-mb-sm">{{ errorVisibilidadMensaje }}</p>
          <p class="text-body2 text-grey-7 q-mb-none" v-if="errorVisibilidadDetalle">
            {{ errorVisibilidadDetalle }}
          </p>
        </q-card-section>
        <q-card-actions align="center" class="q-pb-lg q-pt-none">
          <q-btn flat no-caps color="grey-7" label="Cerrar" class="q-mr-sm" v-close-popup />
          <q-btn unelevated no-caps color="primary" label="Reintentar" class="visibilidad-modal-btn" @click="guardarVisibilidad" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <div class="row items-center justify-between q-pa-sm permisos-list-pagination">
      <div class="text-caption text-grey-7">
        {{ etiquetaPaginacion }}
      </div>
      <q-pagination
        v-model="paginacion.page"
        color="primary"
        :max="totalPaginas"
        :max-pages="7"
        direction-links
        boundary-links
        dense
      />
      <q-select
        v-model="paginacion.rowsPerPage"
        :options="opcionesSelectFilas"
        dense
        outlined
        emit-value
        map-options
        options-dense
        class="permisos-list-rows-select"
        aria-label="Filas por página"
      />
    </div>

    <q-dialog
      v-model="mostrarDetalle"
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card v-if="registroSeleccionado" class="permisos-detail-modal">
        <q-card-section class="q-pb-sm">
          <div class="text-h6 text-weight-bold">
            Detalle de permisos
          </div>
          <p class="text-body2 text-grey-8 q-mb-none q-mt-xs">
            Permisos operativos asignados al empleado.
          </p>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <dl class="permisos-detail-list">
            <div class="permisos-detail-row">
              <dt class="permisos-detail-row__label">Empleado</dt>
              <dd class="permisos-detail-row__value">
                {{ registroSeleccionado.colaboradorNombre || '—' }}
              </dd>
            </div>
            <div class="permisos-detail-row">
              <dt class="permisos-detail-row__label">Departamento</dt>
              <dd class="permisos-detail-row__value">
                {{ registroSeleccionado.departamentoNombre || '—' }}
              </dd>
            </div>
            <div class="permisos-detail-row">
              <dt class="permisos-detail-row__label">Total de permisos</dt>
              <dd class="permisos-detail-row__value">
                {{ registroSeleccionado.totalPermisos }}
              </dd>
            </div>
          </dl>

          <div class="text-caption text-weight-medium text-grey-7 q-mt-lg q-mb-sm">
            Permisos activos
          </div>
          <div
            v-if="permisosDetalle.length"
            class="permisos-detail-tags"
          >
            <q-chip
              v-for="permiso in permisosDetalle"
              :key="permiso.key"
              dense
              outline
              color="primary"
              text-color="primary"
              :icon="permiso.icon"
              class="permisos-detail-tag"
            >
              {{ permiso.label }}
            </q-chip>
          </div>
          <p v-else class="text-caption text-grey-7 q-mb-none">
            No tiene permisos activos en esta asignación.
          </p>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn
            flat
            no-caps
            color="grey-8"
            label="Cerrar"
            v-close-popup
          />
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="edit"
            label="Editar"
            @click="editarDesdeDetalle"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script>
import { colaboradorPermisosApi } from 'src/api/colaboradorPermisos.api';
import { useOperativosPermisosStore } from 'src/stores/operativosPermisosStore';
import UsuarioSesionPermisosPanel from './UsuarioSesionPermisosPanel.vue';
import {
  PERMISOS_OPERATIVOS,
  PERMISOS_VISIBILIDAD,
  contarPermisosActivos
} from '../constants/permisosOperativos';

const FILAS_POR_PAGINA = [10, 25, 50];

function enriquecerRegistro (record) {
  return Object.assign({}, record, {
    totalPermisos: contarPermisosActivos(record)
  });
}

export default {
  name: 'ColaboradorPermisosList',

  components: {
    UsuarioSesionPermisosPanel
  },

  data () {
    return {
      registros: [],
      filtro: '',
      cargando: false,
      eliminandoId: null,
      mostrarDetalle: false,
      registroSeleccionado: null,
      paginacion: {
        sortBy: 'colaboradorNombre',
        descending: false,
        page: 1,
        rowsPerPage: 10
      },
      visibilidad: {},
      visibilidadOriginal: {},
      visibilidadExpandida: false,
      mostrarVisibilidadExito: false,
      mostrarVisibilidadError: false,
      errorVisibilidadMensaje: '',
      errorVisibilidadDetalle: '',
      opcionesFilasPorPagina: FILAS_POR_PAGINA,
      columnas: [
        {
          name: 'colaboradorNombre',
          align: 'left',
          label: 'Empleado',
          field: 'colaboradorNombre',
          sortable: true,
          style: 'max-width: 280px',
          classes: 'ellipsis'
        },
        {
          name: 'totalPermisos',
          align: 'center',
          label: 'Nº permisos',
          field: 'totalPermisos',
          sortable: true,
          style: 'width: 120px'
        },
        {
          name: 'acciones',
          align: 'center',
          label: 'Acciones',
          field: 'id',
          sortable: false,
          style: 'width: 156px'
        }
      ]
    };
  },

  computed: {
    filasFiltradas () {
      var lista = Array.isArray(this.registros) ? this.registros.slice() : [];
      var needle = (this.filtro || '').toLowerCase().trim();
      if (!needle) {
        return lista;
      }
      return lista.filter(function (row) {
        var nombre = (row.colaboradorNombre || '').toLowerCase();
        var dept = (row.departamentoNombre || '').toLowerCase();
        return nombre.indexOf(needle) >= 0 || dept.indexOf(needle) >= 0;
      });
    },
    totalPaginas () {
      var total = this.filasFiltradas.length;
      var per = this.paginacion.rowsPerPage || 10;
      var pages = Math.ceil(total / per);
      return pages > 0 ? pages : 1;
    },
    etiquetaPaginacion () {
      var total = this.filasFiltradas.length;
      if (total === 0) {
        return 'Sin registros';
      }
      var per = this.paginacion.rowsPerPage;
      var page = this.paginacion.page;
      var from = (page - 1) * per + 1;
      var to = Math.min(page * per, total);
      return from + '–' + to + ' de ' + total;
    },
    opcionesSelectFilas () {
      return FILAS_POR_PAGINA.map(function (v) {
        return { label: String(v), value: v };
      });
    },
    permisosDetalle () {
      if (!this.registroSeleccionado) {
        return [];
      }
      return PERMISOS_OPERATIVOS.filter(function (p) {
        return !!this.registroSeleccionado[p.key];
      }, this);
    },
    permisosVisibilidad () {
      return PERMISOS_VISIBILIDAD;
    },
    visibilidadModificado () {
      var keys = PERMISOS_VISIBILIDAD.map(function (p) { return p.key; });
      return keys.some(function (k) {
        return !!this.visibilidad[k] !== !!this.visibilidadOriginal[k];
      }, this);
    }
  },

  watch: {
    filtro () {
      this.paginacion.page = 1;
    },
    'paginacion.rowsPerPage' () {
      this.paginacion.page = 1;
    },
    totalPaginas (pages) {
      if (this.paginacion.page > pages) {
        this.paginacion.page = pages;
      }
    }
  },

  mounted () {
    this.cargar();
    this.inicializarVisibilidad();
  },

  methods: {
    async actualizarPermisosSesion () {
      var operativosStore = useOperativosPermisosStore(this.$pinia);
      if (operativosStore.username) {
        await operativosStore.refresh();
      }
    },

    async cargar () {
      this.cargando = true;
      try {
        var lista = await colaboradorPermisosApi.getAll();
        var arr = Array.isArray(lista) ? lista : [];
        this.registros = arr.map(enriquecerRegistro);
        await this.actualizarPermisosSesion();
      } catch (e) {
        this.registros = [];
        this.$q.notify({
          type: 'negative',
          message: (e && e.message) ? e.message : 'No se pudieron cargar los permisos',
          position: 'top-right'
        });
      } finally {
        this.cargando = false;
      }
    },

    verDetalle (row) {
      this.registroSeleccionado = row;
      this.mostrarDetalle = true;
    },

    editar (row) {
      this.$emit('edit', row);
    },

    editarDesdeDetalle () {
      if (!this.registroSeleccionado) {
        return;
      }
      this.mostrarDetalle = false;
      this.editar(this.registroSeleccionado);
    },

    confirmarEliminar (row) {
      var vm = this;
      var nombre = row.colaboradorNombre || 'este empleado';
      this.$q.dialog({
        title: 'Eliminar permisos',
        message: '¿Eliminar la asignación de permisos de ' + nombre + '?',
        cancel: {
          flat: true,
          noCaps: true,
          color: 'grey-8',
          label: 'Cancelar'
        },
        ok: {
          unelevated: true,
          noCaps: true,
          color: 'negative',
          label: 'Eliminar'
        },
        persistent: true
      }).onOk(function () {
        vm.eliminar(row);
      });
    },

    async eliminar (row) {
      if (!row || row.id == null) {
        return;
      }
      this.eliminandoId = row.id;
      try {
        await colaboradorPermisosApi.remove(row.id);
        this.$q.notify({
          type: 'positive',
          message: 'Permisos eliminados correctamente',
          position: 'top-right',
          timeout: 2500
        });
        this.$emit('deleted', row);
        await this.cargar();
      } catch (e) {
        this.$q.notify({
          type: 'negative',
          message: (e && e.message) ? e.message : 'No se pudieron eliminar los permisos',
          position: 'top-right',
          timeout: 4000
        });
      } finally {
        this.eliminandoId = null;
      }
    },

    inicializarVisibilidad () {
      var state = {};
      PERMISOS_VISIBILIDAD.forEach(function (p) {
        state[p.key] = false;
      });
      this.visibilidad = Object.assign({}, state);
      this.visibilidadOriginal = Object.assign({}, state);
    },

    async guardarVisibilidad () {
      try {
        var payload = { tipo: 'visibilidad' };
        PERMISOS_VISIBILIDAD.forEach(function (p) {
          payload[p.key] = !!this.visibilidad[p.key];
        }, this);
        await colaboradorPermisosApi.saveVisibilidad(payload);
        this.visibilidadOriginal = Object.assign({}, this.visibilidad);
        this.mostrarVisibilidadExito = true;
      } catch (e) {
        var msg = (e && e.message) ? e.message : '';
        var status = (e && e.response && e.response.status) ? e.response.status : 0;
        this.errorVisibilidadMensaje = this._obtenerMensajeError(msg, status);
        this.errorVisibilidadDetalle = this._obtenerDetalleError(msg, status);
        this.mostrarVisibilidadError = true;
      }
    },

    _obtenerMensajeError (msg, status) {
      if (!msg && status === 0) {
        return 'No pudimos conectar con el servidor. Revisa tu conexión a internet e inténtalo de nuevo.';
      }
      if (status >= 500) {
        return 'El servidor está experimentando dificultades temporales. El equipo de tecnología ya fue notificado y estamos trabajando en ello.';
      }
      if (status === 404) {
        return 'El servicio de visibilidad no está disponible en este momento.';
      }
      if (status === 401 || status === 403) {
        return 'Tu sesión pudo haber expirado. Cierra sesión y vuelve a ingresar para continuar.';
      }
      if (msg && (msg.toLowerCase().indexOf('timeout') >= 0 || msg.toLowerCase().indexOf('timed out') >= 0)) {
        return 'El servidor tardó más de lo esperado en responder. Esto puede ocurrir en horas de alta demanda.';
      }
      return 'No fue posible guardar los cambios de visibilidad. Verifica tu conexión a la red corporativa o a internet. Si el problema continúa, contacta al administrador del sistema.';
    },

    _obtenerDetalleError (msg, status) {
      if (status === 0) {
        return 'Verifica que estés conectado a la red corporativa o a internet.';
      }
      if (status >= 500) {
        return 'Los errores de servidor suelen resolverse en minutos. Si persiste, contacta al área de sistemas.';
      }
      if (status === 404) {
        return 'Es posible que esta funcionalidad esté en mantenimiento o no esté habilitada para tu perfil.';
      }
      if (status === 401 || status === 403) {
        return 'Por seguridad, las sesiones expiran después de un periodo de inactividad. Vuelve a iniciar sesión.';
      }
      if (msg) {
        if (msg.length > 120) {
          return msg;
        }
        return '';
      }
      return 'Si el problema continúa, intenta de nuevo más tarde o contacta a soporte técnico.';
    }
  }
};
</script>

<style scoped>
.permisos-list-card {
  border-radius: 16px;
}

.permisos-list-lead {
  line-height: 1.5;
  max-width: 42em;
}

.permisos-list-hint {
  line-height: 1.4;
}

.permisos-list-search >>> .q-field__control {
  border-radius: 12px;
}

.permisos-list-table-wrap {
  overflow-x: auto;
}

.permisos-list-table {
  min-width: 520px;
}

.permisos-list-employee__name {
  font-weight: 600;
  color: #1e293b;
  line-height: 1.35;
}

.permisos-list-employee__dept {
  margin-top: 2px;
  line-height: 1.3;
}

.permisos-list-count-chip {
  min-width: 36px;
  justify-content: center;
}

.permisos-list-actions {
  gap: 2px;
}

.permisos-list-action-btn {
  width: 36px;
  height: 36px;
}

.permisos-list-pagination {
  gap: 8px;
  flex-wrap: wrap;
}

.permisos-list-rows-select {
  min-width: 72px;
}

.permisos-detail-modal {
  width: min(520px, 92vw);
  border-radius: 16px;
}

.permisos-detail-list {
  margin: 0;
  padding: 0;
}

.permisos-detail-row {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 8px 16px;
  padding: 10px 0;
  border-bottom: 1px solid #f1f5f9;
}

.permisos-detail-row:last-child {
  border-bottom: none;
}

.permisos-detail-row__label {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

.permisos-detail-row__value {
  margin: 0;
  font-size: 14px;
  color: #1e293b;
  line-height: 1.4;
}

.permisos-detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.permisos-detail-tag {
  font-weight: 500;
}

.visibilidad-grupo {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  background: #fafbfc;
  height: 100%;
}

.visibilidad-grupo__header {
  display: flex;
  align-items: center;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding-bottom: 8px;
  margin-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.visibilidad-checkbox {
  font-size: 14px;
}

.visibilidad-checkbox >>> .q-checkbox__label {
  font-weight: 500;
  color: #1e293b;
}

.visibilidad-save-btn {
  border-radius: 8px;
}

.visibilidad-modal {
  width: min(420px, 90vw);
  border-radius: 20px;
}

.visibilidad-modal--exito {
  border-top: 4px solid var(--q-positive);
}

.visibilidad-modal--error {
  border-top: 4px solid var(--q-warning);
}

.visibilidad-modal-btn {
  border-radius: 10px;
  padding: 10px 32px;
}
</style>
