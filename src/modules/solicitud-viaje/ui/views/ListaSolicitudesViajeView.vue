<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col">
        <h1 class="text-h5 text-weight-bold color-primary q-my-none">
          Solicitudes de Viaje
        </h1>
        <p class="text-subtitle2 text-grey-7 q-my-none">
          Listado de todas las solicitudes de transporte y alojamiento registradas.
        </p>
      </div>
      <div class="col-auto">
        <q-btn
          unelevated
          class="btn-create"
          label="Nueva Solicitud"
          icon="add"
          :to="{ name: 'crear-solicitud-viaje' }"
        />
      </div>
    </div>

    <q-card flat bordered class="table-card">
      <q-table
        :data="store.solicitudes"
        :columns="columns"
        row-key="id"
        flat
        :loading="store.loading"
        class="premium-table"
        no-data-label="No se encontraron solicitudes"
      >
        <!-- Custom Header -->
        <template v-slot:header="props">
          <q-tr :props="props" class="table-header">
            <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="header-cell"
            >
              {{ col.label }}
            </q-th>
          </q-tr>
        </template>

        <!-- Custom Body Cells -->
        <template v-slot:body="props">
          <q-tr :props="props" class="table-row">
            <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="content-cell"
            >
              <!-- Acciones -->
              <div v-if="col.name === 'acciones'" class="row no-wrap items-center action-gap">
                <div class="action-btn" @click="verDetalle(props.row)">
                  <q-icon name="visibility" size="18px" />
                  <q-tooltip>Ver detalle</q-tooltip>
                </div>
                <div class="action-btn" @click="editar(props.row)">
                  <q-icon name="edit" size="18px" />
                  <q-tooltip>Editar solicitud</q-tooltip>
                </div>
                <div class="action-btn critical" @click="eliminar(props.row)">
                  <q-icon name="delete" size="18px" />
                  <q-tooltip>Eliminar solicitud</q-tooltip>
                </div>
              </div>

              <!-- Estado -->
              <q-chip
                v-else-if="col.name === 'estado'"
                :color="getEstadoColor(props.row.estado)"
                text-color="white"
                dense
                class="text-weight-bold"
              >
                {{ props.row.estado || 'REGISTRADA' }}
              </q-chip>

              <!-- Default -->
              <span v-else :class="{ 'text-weight-medium': col.name === 'codigo' }">
                {{ col.value }}
              </span>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </q-card>

    <SolicitudViajeDetalleModal
      v-model="showDetailModal"
      :solicitud="selectedSolicitud"
      @approve="handleApprove"
    />

    <SolicitudViajeEditModal
      v-model="showEditModal"
      :solicitud="selectedSolicitud"
      :loading="store.loading"
      @save="handleUpdate"
    />
  </div>
</template>

<script>
import { useSolicitudViajeStore } from '../../store/solicitudViaje.store';
import SolicitudViajeDetalleModal from '../components/SolicitudViajeDetalleModal.vue';
import SolicitudViajeEditModal from '../components/SolicitudViajeEditModal.vue';

export default {
  name: 'ListaSolicitudesViajeView',
  components: {
    SolicitudViajeDetalleModal,
    SolicitudViajeEditModal
  },
  setup() {
    const store = useSolicitudViajeStore();
    return { store };
  },
  data() {
    return {
      showDetailModal: false,
      showEditModal: false,
      selectedSolicitud: {
        transporte: {},
        hospedaje: {},
        personas: []
      },
      columns: [
        { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
        { name: 'fechaSolicitud', label: 'Fecha', field: 'fechaSolicitud', align: 'left', sortable: true },
        { name: 'solicitanteNombre', label: 'Solicitante', field: 'solicitanteNombre', align: 'left', sortable: true },
        { name: 'proyecto', label: 'Proyecto', field: 'proyecto', align: 'left', sortable: true },
        { name: 'tipoSolicitud', label: 'Tipo', field: 'tipoSolicitud', align: 'center' },
        { name: 'estado', label: 'Estado', field: 'estado', align: 'center' },
        { name: 'acciones', label: 'Acciones', field: 'id', align: 'center' }
      ]
    };
  },
  async mounted() {
    await this.store.fetchSolicitudes();
  },
  methods: {
    getEstadoColor(estado) {
      const colors = {
        'REGISTRADA': 'blue-6',
        'BORRADOR': 'grey-7',
        'APROBADA': 'positive',
        'PENDIENTE': 'orange-7',
        'RECHAZADA': 'negative'
      };
      return colors[estado] || 'grey-7';
    },
    verDetalle(row) {
      this.selectedSolicitud = JSON.parse(JSON.stringify(row));
      this.showDetailModal = true;
    },
    handleApprove(solicitud) {
      console.log('Aprobando solicitud...', solicitud.id);
      this.$q.notify({ message: `Solicitud ${solicitud.codigo} aprobada exitosamente`, color: 'positive' });
      this.showDetailModal = false;
    },
    editar(row) {
      this.selectedSolicitud = JSON.parse(JSON.stringify(row));
      this.showEditModal = true;
    },
    async handleUpdate(updatedData) {
      try {
        await this.store.updateSolicitud(updatedData.id, updatedData);
        this.$q.notify({
          message: 'Solicitud actualizada correctamente',
          color: 'positive',
          icon: 'check_circle'
        });
        this.showEditModal = false;
      } catch (error) {
        this.$q.notify({
          message: error.message || 'Error al actualizar la solicitud',
          color: 'negative',
          icon: 'error'
        });
      }
    },
    eliminar(row) {
      this.$q.dialog({
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de eliminar la solicitud ${row.codigo}?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        console.log('Eliminando...', row.id);
        this.$q.notify({ message: 'Solicitud eliminada (Simulación)', color: 'positive' });
      });
    }
  }
}
</script>

<style scoped>
.color-primary {
  color: #111827;
}

.table-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.btn-create {
  background: #2563EB !important;
  color: white !important;
  height: 44px;
  border-radius: 8px;
  font-weight: 600;
  text-transform: none;
}

/* --- ESTILOS UX/UI PREMIUM SOLICITADOS --- */

/* Tipografía y Celdas */
.header-cell {
  font-size: 14px !important; /* 2. Encabezado */
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  color: #6B7280 !important;
  padding: 12px !important; /* 3. Filas */
}

.content-cell {
  font-size: 14px !important; /* 1. Contenido base */
  font-weight: 400 !important;
  color: #111827 !important;
  height: 48px !important; /* 3. Altura de fila */
  padding: 0 12px !important;
}

.text-weight-medium {
  font-weight: 500 !important; /* Destacado */
}

.table-row {
  height: 48px !important;
}

.table-row:hover {
  background-color: #F9FAFB !important;
}

/* Botones de acción */
.action-gap {
  gap: 8px; /* 10. Espaciado */
}

.action-btn {
  width: 36px !important; /* 7. Estilo botón */
  height: 36px !important;
  border-radius: 6px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  cursor: pointer !important;
  color: #374151 !important; /* 9. Estado normal */
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #F3F4F6 !important; /* 7. Hover */
}

.action-btn.critical {
  color: #DC2626 !important; /* 9. Acción crítica */
}

.action-btn.critical:hover {
  background: #FEE2E2 !important;
}

/* Tooltips se manejan con q-tooltip automáticamente */
</style>
