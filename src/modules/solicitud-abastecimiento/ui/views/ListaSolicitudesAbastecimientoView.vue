<template>
  <div class="q-pa-md">
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white row justify-between items-center">
        <div>
          <div class="text-h5 text-white">Solicitudes del plan de abastecimiento</div>
          <div class="text-subtitle2">Información capturada desde el formulario de crear abastecimiento</div>
        </div>
        <q-btn 
          color="white" 
          text-color="primary" 
          label="Crear Abastecimiento" 
          icon="add" 
          :to="{ name: 'crear-solicitud-abastecimiento' }" 
        />
      </q-card-section>

      <q-card-section class="q-pb-none">
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-sm-auto">
            <div class="text-subtitle2 text-grey-7 q-mb-xs">Filtrar por rango de fecha:</div>
          </div>
          <div class="col-12 col-sm-3">
            <q-input 
              dense 
              filled 
              v-model="filtroFechaInicio" 
              label="Fecha Inicial" 
              mask="date"
              clearable
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy1" transition-show="scale" transition-hide="scale">
                    <q-date v-model="filtroFechaInicio">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-3">
            <q-input 
              dense 
              filled 
              v-model="filtroFechaFin" 
              label="Fecha Final" 
              mask="date"
              clearable
            >
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy ref="qDateProxy2" transition-show="scale" transition-hide="scale">
                    <q-date v-model="filtroFechaFin">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Cerrar" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-auto">
            <q-btn 
              flat 
              dense 
              color="primary" 
              label="Limpiar Filtros" 
              icon="filter_list_off"
              @click="limpiarFiltros"
              v-if="filtroFechaInicio || filtroFechaFin"
            />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-table
          flat
          bordered
          :data="solicitudesFiltradas"
          :columns="columns"
          row-key="id"
          :loading="store.loading"
          no-data-label="No hay solicitudes registradas"
        >
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-chip 
                :color="getColorForStatus(props.row.estado)" 
                text-color="white"
                dense
              >
                {{ props.row.estado ? props.row.estado : 'Registrada' }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
            <q-td :props="props">
              <q-btn 
                flat 
                round 
                color="primary" 
                icon="visibility" 
                size="sm"
                @click="verDetalle(props.row)"
              >
                <q-tooltip>Ver detalle</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal de Detalle -->
    <q-dialog v-model="modalDetalle" full-width>
      <q-card style="max-width: 900px; width: 100%;">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6 text-white">Detalle de Solicitud: {{ selectedSolicitud ? selectedSolicitud.id.split('-')[0] : '' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedSolicitud" class="q-pt-lg">
          <div class="row q-col-gutter-md">
            <!-- Información General -->
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 text-weight-bold color-primary">Información General</div>
              <q-separator class="q-mb-sm" />
              <div class="row">
                <div class="col-5 text-grey-7 text-weight-medium">Subdirección:</div>
                <div class="col-7">{{ selectedSolicitud.subdireccion }}</div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-5 text-grey-7 text-weight-medium">Necesidad:</div>
                <div class="col-7">{{ selectedSolicitud.descripcionNecesidad }}</div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-5 text-grey-7 text-weight-medium">Presupuesto Total:</div>
                <div class="col-7 text-weight-bold text-green">
                  {{ selectedSolicitud.presupuestoDisponible ? `$${Number(selectedSolicitud.presupuestoDisponible).toLocaleString()}` : '$0' }}
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-5 text-grey-7 text-weight-medium">V. Total Productos:</div>
                <div class="col-7 text-weight-bold text-blue-8">
                  ${{ calcularTotalProductos(selectedSolicitud).toLocaleString() }}
                </div>
              </div>
            </div>

            <!-- Datos de Entrega -->
            <div class="col-12 col-md-6">
              <div class="text-subtitle1 text-weight-bold color-primary">Datos de Entrega</div>
              <q-separator class="q-mb-sm" />
              <div class="row">
                <div class="col-5 text-grey-7 text-weight-medium">Contacto:</div>
                <div class="col-7 text-weight-medium">{{ selectedSolicitud.contacto || 'No especificado' }}</div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-5 text-grey-7 text-weight-medium">Teléfono:</div>
                <div class="col-7">{{ selectedSolicitud.telefono || 'No especificado' }}</div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-5 text-grey-7 text-weight-medium">Ubicación:</div>
                <div class="col-7">{{ selectedSolicitud.municipio }}, {{ selectedSolicitud.departamento }}</div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-5 text-grey-7 text-weight-medium">Dirección:</div>
                <div class="col-7">{{ selectedSolicitud.direccion }}</div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-5 text-grey-7 text-weight-medium">Fecha Entrega:</div>
                <div class="col-7">{{ selectedSolicitud.fechaEntrega }}</div>
              </div>
            </div>
          </div>

          <!-- Observaciones Generales -->
          <div v-if="selectedSolicitud.observacionesProductos" class="q-mt-lg">
            <div class="text-subtitle1 text-weight-bold color-primary">Observaciones Generales de Productos/Servicios</div>
            <q-separator class="q-mb-sm" />
            <div class="text-body2 text-grey-9 bg-grey-2 q-pa-md border-panel bg-light">
              {{ selectedSolicitud.observacionesProductos }}
            </div>
          </div>

          <!-- Desglose de Proyectos y Productos -->
          <div class="q-mt-xl">
            <div class="text-subtitle1 text-weight-bold color-primary q-mb-md">Desglose de Proyectos y Productos</div>
            <div v-for="(proy, idx) in selectedSolicitud.proyectos" :key="idx" class="q-mb-lg border-panel q-pa-md">
              <div class="row justify-between items-center q-mb-sm">
                <div class="text-weight-bold text-secondary text-uppercase">
                  {{ proy.planAbastecimiento }} - {{ proy.item }}
                </div>
                <q-chip dense color="blue-1" text-color="blue-9" label="Proyecto" icon="assignment" />
              </div>
              
              <q-table
                flat
                bordered
                dense
                :data="proy.productosServicios"
                :columns="[
                  { name: 'descripcion', label: 'Producto/Servicio', field: 'descripcion', align: 'left' },
                  { name: 'cantidad', label: 'Cant.', field: 'cantidad', align: 'center' },
                  { name: 'unidadMedida', label: 'Unidad', field: 'unidadMedida', align: 'center' },
                  { name: 'valorUnitario', label: 'V. Unitario', field: 'valorUnitario', align: 'right', format: val => `$${Number(val).toLocaleString()}` }
                ]"
                hide-bottom
                :pagination="{ rowsPerPage: 0 }"
                row-key="id"
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-grey-1 q-pa-md">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
          <q-btn 
            label="Aceptar aprobación" 
            color="positive" 
            @click="confirmarAprobacion(selectedSolicitud)" 
            v-if="selectedSolicitud && selectedSolicitud.estado !== 'ACEPTADO' && selectedSolicitud.estado !== 'APROBADO'"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de Selección de Aprobadores -->
    <approve-solicitud-modal 
      v-model="showApproveModal"
      @confirm="onApproveConfirm"
    />
  </div>
</template>

<script>
import { useSolicitudStore } from 'src/modules/solicitud-abastecimiento/ui/store/useSolicitudStore';
import ApproveSolicitudModal from '../components/ApproveSolicitudModal.vue';

export default {
  name: 'ListaSolicitudesAbastecimientoView',
  components: {
    ApproveSolicitudModal
  },
  data() {
    return {
      store: useSolicitudStore(),
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true, format: val => val ? val.split('-')[0] : '' },
        { name: 'subdireccion', label: 'Subdirección', field: 'subdireccion', align: 'left', sortable: true },
        { name: 'descripcionNecesidad', label: 'Descripción de Necesidad', field: 'descripcionNecesidad', align: 'left', sortable: true },
        { name: 'fechaEntrega', label: 'Fecha Entrega', field: 'fechaEntrega', align: 'left' },
        { 
          name: 'presupuestoDisponible', 
          label: 'P. Disponible', 
          field: 'presupuestoDisponible', 
          align: 'right', 
          format: val => val ? `$${Number(val).toLocaleString()}` : '$0'
        },
        { name: 'estado', label: 'Estado', field: 'estado', align: 'center', sortable: true },
        { name: 'acciones', label: 'Acciones', field: 'id', align: 'center' }
      ],
      selectedSolicitud: null,
      modalDetalle: false,
      showApproveModal: false,
      filtroFechaInicio: '',
      filtroFechaFin: ''
    };
  },
  computed: {
    solicitudesFiltradas() {
      if (!this.store.solicitudes) return [];
      
      return this.store.solicitudes.filter(sol => {
        if (!this.filtroFechaInicio && !this.filtroFechaFin) return true;
        
        // Asumiendo que sol.fechaEntrega o sol.createdAt es la fecha a filtrar.
        // Usaremos fechaEntrega por ahora ya que es la que se muestra.
        if (!sol.fechaEntrega) return false;
        
        const fechaSol = new Date(sol.fechaEntrega);
        let cumpleInicio = true;
        let cumpleFin = true;
        
        if (this.filtroFechaInicio) {
          const inicio = new Date(this.filtroFechaInicio);
          inicio.setHours(0, 0, 0, 0);
          cumpleInicio = fechaSol >= inicio;
        }
        
        if (this.filtroFechaFin) {
          const fin = new Date(this.filtroFechaFin);
          fin.setHours(23, 59, 59, 999);
          cumpleFin = fechaSol <= fin;
        }
        
        return cumpleInicio && cumpleFin;
      });
    }
  },
  async mounted() {
    try {
      await this.store.fetchSolicitudes();
    } catch (error) {
      if (this.$q) {
        this.$q.notify({
          color: 'negative',
          message: 'Error al cargar las solicitudes registradas.'
        });
      }
    }
  },
  methods: {
    getColorForStatus(status) {
      if (!status) return 'grey';
      const lowercaseStatus = status.toLowerCase();
      if (lowercaseStatus === 'completado') return 'positive';
      if (lowercaseStatus === 'pendiente') return 'warning';
      return 'grey';
    },
    verDetalle(solicitud) {
      this.selectedSolicitud = solicitud;
      this.modalDetalle = true;
    },
    confirmarAprobacion(solicitud) {
      this.selectedSolicitud = solicitud;
      this.showApproveModal = true;
    },
    async onApproveConfirm(aprobadores) {
      try {
        await this.store.approveSolicitud(this.selectedSolicitud.id, aprobadores);
        this.$q.notify({
          color: 'positive',
          icon: 'check',
          message: 'Solicitud aprobada y personal asignado correctamente.'
        });
        this.modalDetalle = false;
        await this.store.fetchSolicitudes();
      } catch (e) {
        this.$q.notify({
          color: 'negative',
          message: 'Error al procesar la aprobación.'
        });
      }
    },
    limpiarFiltros() {
      this.filtroFechaInicio = '';
      this.filtroFechaFin = '';
    },
    calcularTotalProductos(solicitud) {
      if (!solicitud || !solicitud.proyectos) return 0;
      let total = 0;
      solicitud.proyectos.forEach(proy => {
        if (proy.productosServicios) {
          proy.productosServicios.forEach(prod => {
            const cant = Number(prod.cantidad) || 0;
            const valor = Number(prod.valorUnitario) || 0;
            total += (cant * valor);
          });
        }
      });
      return total;
    }
  }
};
</script>

<style scoped>
.color-primary {
  color: var(--q-color-primary);
}
.border-panel {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
}
.bg-light {
  background: #f7f7f7;
  border-left: 4px solid var(--q-color-primary);
}
</style>
