<template>
  <q-page class="q-pa-xl air-travel-page">
    <!-- Header Section with Animation -->
    <div class="header-container q-mb-xl reveal-animation">
      <div class="row items-center justify-between">
        <div class="col-12 col-md-7">
          <div class="row items-center q-gutter-x-sm q-mb-xs">
            <q-icon name="flight_takeoff" size="32px" class="text-primary-gradient" />
            <h1 class="page-title q-my-none">Lista de solicitudes de viaje aereo</h1>
          </div>
          <p class="page-subtitle text-grey-7">
            Control y seguimiento centralizado de tiquetes aéreos corporativos
          </p>
        </div>
        <div class="col-12 col-md-auto text-right">
          <q-btn
            unelevated
            label="Nueva Solicitud"
            icon="add"
            :to="{ name: 'crear-solicitud-transporte' }"
            class="premium-btn shadow-vibrant"
          />
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <q-card flat bordered class="filter-card q-mb-lg reveal-animation" style="animation-delay: 0.2s">
      <q-card-section class="row q-col-gutter-lg items-end">
        <div class="col-12 col-sm-4">
          <div class="text-caption q-mb-xs text-weight-medium text-grey-7">ESTADO DE SOLICITUD</div>
          <q-select
            v-model="filters.status"
            placeholder="Seleccionar estado..."
            outlined
            dense
            :options="statusOptions"
            emit-value
            map-options
            clearable
            @input="onFilter"
            class="premium-input"
          />
        </div>
        <div class="col-12 col-sm-4">
          <div class="text-caption q-mb-xs text-weight-medium text-grey-7">FILTRO POR PROYECTO</div>
          <q-input
            v-model="filters.proyecto"
            placeholder="Nombre del proyecto..."
            outlined
            dense
            clearable
            @input="onFilter"
            class="premium-input"
          >
            <template v-slot:prepend>
              <q-icon name="apartment" size="20px" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-auto q-ml-auto">
          <q-btn flat round color="grey-7" icon="refresh" @click="onFilter" class="hover-rotate">
            <q-tooltip>Actualizar lista</q-tooltip>
          </q-btn>
        </div>
      </q-card-section>
    </q-card>

    <!-- Main Table Section -->
    <q-card flat bordered class="table-container reveal-animation" style="animation-delay: 0.3s">
      <q-table
        :data="store.solicitudes"
        :columns="columns"
        row-key="idSolicitud"
        flat
        :loading="store.isLoading"
        class="premium-table"
        :pagination="{ rowsPerPage: 10 }"
      >
        <!-- Custom Loading -->
        <template v-slot:loading>
          <q-inner-loading showing color="primary">
            <q-spinner-tail color="primary" size="40px" />
          </q-inner-loading>
        </template>

        <!-- Custom Row Design -->
        <template v-slot:body-cell-codigo="props">
          <q-td :props="props">
            <div class="text-weight-bold text-primary">{{ props.value }}</div>
            <div class="text-caption text-grey-6">{{ props.row.fecha }}</div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :style="{ backgroundColor: getStatusColor(props.value) + '20', color: getStatusColor(props.value) }"
              class="status-chip text-weight-bold"
              dense
            >
              <q-badge rounded :style="{ backgroundColor: getStatusColor(props.value) }" class="q-mr-xs" />
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-acciones="props">
          <q-td :props="props" class="text-center">
            <q-btn 
              flat round dense 
              color="secondary" 
              icon="visibility" 
              class="action-btn"
              @click="verDetalle(props.row)"
            >
              <q-tooltip>Ver detalle completo</q-tooltip>
            </q-btn>
            <q-btn 
              flat round dense 
              color="primary" 
              icon="edit" 
              class="action-btn q-ml-sm"
              @click="editar(props.row)"
            >
              <q-tooltip>Editar solicitud</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-card>

    <!-- Modal Components Intergration -->
    <SolicitudTransporteDetalleModal 
      v-model="showDetailModal"
      :solicitud="selectedSolicitud"
    />

    <SolicitudTransporteEditModal 
      v-model="showEditModal"
      @saved="onFilter"
    />

  </q-page>
</template>

<script>
import { reactive, onMounted, computed, ref } from '@vue/composition-api';
import { useSolicitudTransporteStore } from '../../store/solicitudTransporte.store';
import SolicitudTransporteDetalleModal from '../components/SolicitudTransporteDetalleModal.vue';
import SolicitudTransporteEditModal from '../components/SolicitudTransporteEditModal.vue';

export default {
  name: 'SolicitudListView',
  components: {
    SolicitudTransporteDetalleModal,
    SolicitudTransporteEditModal
  },
  setup() {
    const store = useSolicitudTransporteStore();

    const showDetailModal = ref(false);
    const showEditModal = ref(false);
    const selectedSolicitud = ref({});

    const filters = reactive({
      status: null,
      proyecto: ''
    });

    const stats = computed(() => {
      const active = store.solicitudes.length;
      const approved = store.solicitudes.filter(s => s.status === 'APROBADA').length;
      const pending = store.solicitudes.filter(s => s.status === 'ENVIADA').length;
      
      return [
        { label: 'Total Solicitudes', value: active, icon: 'analytics', color: 'primary' },
        { label: 'En Proceso', value: pending, icon: 'watch_later', color: 'orange' },
        { label: 'Aprobadas', value: approved, icon: 'check_circle', color: 'positive' },
        { label: 'Rechazadas', value: active - approved - pending, icon: 'cancel', color: 'negative' }
      ];
    });

    const statusOptions = [
      { label: 'Borrador', value: 'BORRADOR' },
      { label: 'Enviada', value: 'ENVIADA' },
      { label: 'Aprobada', value: 'APROBADA' },
      { label: 'Rechazada', value: 'RECHAZADA' }
    ];

    const columns = [
      { name: 'codigo', label: 'Referencia / Fecha', align: 'left', field: 'codigo', sortable: true },
      { name: 'solicitante', label: 'Colaborador', align: 'left', field: 'solicitante' },
      { name: 'proyecto', label: 'Proyecto / Centro Costo', align: 'left', field: 'proyecto' },
      { name: 'status', label: 'Estado', align: 'center', field: 'status' },
      { name: 'acciones', label: 'Acciones', align: 'center' }
    ];

    const getStatusColor = (status) => {
      switch (status) {
        case 'BORRADOR': return '#64748b';
        case 'ENVIADA': return '#2563eb';
        case 'APROBADA': return '#10b981';
        case 'RECHAZADA': return '#ef4444';
        default: return '#94a3b8';
      }
    };

    const onFilter = () => {
      store.fetchAll(filters);
    };

    const verDetalle = (row) => {
      selectedSolicitud.value = { ...row };
      showDetailModal.value = true;
    };

    const editar = async (row) => {
      await store.fetchById(row.idSolicitud);
      showEditModal.value = true;
    };

    onMounted(() => {
      store.fetchAll();
    });

    return {
      store,
      filters,
      stats,
      statusOptions,
      columns,
      getStatusColor,
      onFilter,
      showDetailModal,
      showEditModal,
      selectedSolicitud,
      verDetalle,
      editar
    };
  }
}
</script>

<style scoped>
/* Tokens de Diseño Premium */
:root {
  --primary-gradient: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  --accent-gradient: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  --card-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.02);
}

.air-travel-page {
  background-color: #f8fafc;
}

.text-primary-gradient {
  background: linear-gradient(135deg, #2563eb, #7c3aed);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 1.1rem;
  max-width: 600px;
}

/* Botones Premium */
.premium-btn {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: white;
  padding: 12px 28px;
  border-radius: 14px;
  font-weight: 600;
  text-transform: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.premium-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 20px -8px rgba(37, 99, 235, 0.5);
}

.shadow-vibrant {
  box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
}

/* Cards de Estadísticas */
.stat-card {
  border-radius: 20px;
  background: white;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-5px);
  border-color: #3b82f6;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
}

.opacity-80 {
  opacity: 0.15;
}

.letter-spacing-1 {
  letter-spacing: 0.1em;
}

/* Filtros Glassmorphism */
.filter-card {
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: var(--card-shadow);
}

.premium-input :deep(.q-field__control) {
  border-radius: 12px;
  background: #fdfdfd;
}

/* Tabla de Datos Premium */
.table-container {
  border-radius: 24px;
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: var(--card-shadow);
  overflow: hidden;
}

.premium-table :deep(thead tr th) {
  font-weight: 700;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  color: #64748b;
  background-color: #f8fafc;
  padding: 20px;
  border-bottom: 2px solid #f1f5f9;
}

.premium-table :deep(tbody tr) {
  transition: all 0.2s ease;
}

.premium-table :deep(tbody tr:hover) {
  background-color: #f1f7fe !important;
}

.premium-table :deep(tbody td) {
  padding: 20px;
  border-bottom: 1px solid #f1f5f9;
}

.status-chip {
  height: 28px;
  padding: 0 12px;
  font-size: 0.75rem;
  border-radius: 8px;
}

.action-btn {
  background: rgba(241, 245, 249, 0.5);
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
}

/* Animaciones */
.reveal-animation {
  animation: reveal 0.8s cubic-bezier(0, 0, 0.2, 1) forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hover-rotate:hover {
  transform: rotate(180deg);
  background: #e2e8f0;
}
</style>
