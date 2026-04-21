<template>
  <div class="q-pa-lg q-mx-auto q-gutter-y-md animate-in" style="max-width: 1200px;">
    <!-- Header Section -->
    <div class="row items-center justify-between q-py-md">
      <div class="col-12 col-md-auto">
        <h1 class="text-h4 text-weight-bolder text-dark q-my-none" style="letter-spacing: -0.02em;">Transporte Terrestre</h1>
        <p class="text-grey-7 q-mt-xs text-weight-medium">Gestión administrativa de traslados operativos y logística.</p>
      </div>
      <div class="col-12 col-md-auto">
        <q-btn 
          color="blue-6" 
          unelevated
          class="primary-btn text-weight-bold shadow-2"
          @click="$router.push({ name: 'create-solicitud-terrestre' })"
          no-caps
        >
          <q-icon left name="add" size="20px" />
          Nueva Solicitud
          <q-badge color="white" text-color="blue-6" floating rounded transparent class="text-weight-bolder">
            {{ store.solicitudes.length }}
          </q-badge>
        </q-btn>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="bg-white q-pa-lg rounded-2xl shadow-1 border-grey-2">
      <div class="row q-col-gutter-md items-center">
        <div class="col-12 col-sm-3 col-md-2">
          <q-select 
            v-model="filters.status"
            :options="statusOptions"
            outlined
            dense
            emit-value
            map-options
            label="Estado"
            bg-color="white"
            class="rounded-lg"
          />
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <q-input 
            v-model="filters.proyecto"
            placeholder="Buscar por proyecto o código..."
            outlined
            dense
            bg-color="white"
            class="rounded-lg"
          >
            <template v-slot:prepend>
              <q-icon name="search" color="grey-5" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-3 col-md-auto">
          <q-btn 
            flat 
            round 
            color="grey-7" 
            class="bg-grey-1"
            @click="loadSolicitudes"
            :loading="store.isLoading"
          >
            <q-icon name="refresh" />
          </q-btn>
        </div>
      </div>

      <!-- Active Filters -->
      <div v-if="filters.status || filters.proyecto" class="row q-gutter-sm q-mt-md items-center">
        <span class="text-caption text-weight-bold text-grey-6 text-uppercase" style="letter-spacing: 0.05em;">Filtros activos:</span>
        <q-chip 
          v-if="filters.status" 
          removable 
          @remove="filters.status = ''"
          color="blue-1" 
          text-color="blue-7" 
          size="sm" 
          class="text-weight-bold"
        >
          Estado: {{ getStatusLabel(filters.status) }}
        </q-chip>
        <q-chip 
          v-if="filters.proyecto" 
          removable 
          @remove="filters.proyecto = ''"
          color="blue-1" 
          text-color="blue-7" 
          size="sm" 
          class="text-weight-bold"
        >
          Búsqueda: {{ filters.proyecto }}
        </q-chip>
      </div>
    </div>

    <!-- Table Section -->
    <div class="bg-white rounded-2xl shadow-1 border-grey-1 overflow-hidden">
      <div class="q-px-none overflow-x-auto">
        <table class="custom-table w-full text-left no-border" style="border-collapse: collapse; min-width: 900px;">
          <thead>
            <tr class="bg-grey-1">
              <th class="q-px-lg q-py-md text-caption text-weight-bold text-grey-7 text-uppercase" style="letter-spacing: 0.1em; width: 250px;">Solicitud</th>
              <th class="q-px-lg q-py-md text-caption text-weight-bold text-grey-7 text-uppercase" style="letter-spacing: 0.1em; width: 200px;">Proyecto y Usuario</th>
              <th class="q-px-lg q-py-md text-caption text-weight-bold text-grey-7 text-uppercase" style="letter-spacing: 0.1em; width: 250px;">Información de Ruta</th>
              <th class="q-px-lg q-py-md text-caption text-weight-bold text-grey-7 text-uppercase text-center" style="letter-spacing: 0.1em; width: 100px;">Pax</th>
              <th class="q-px-lg q-py-md text-caption text-weight-bold text-grey-7 text-uppercase" style="letter-spacing: 0.1em; width: 150px;">Estado</th>
              <th class="q-px-lg q-py-md text-caption text-weight-bold text-grey-7 text-uppercase text-right" style="letter-spacing: 0.1em; width: 150px;">Acciones</th>
            </tr>
          </thead>
          <tbody class="q-table-body">
            <tr v-if="store.isLoading && store.solicitudes.length === 0">
              <td colspan="6" class="q-pa-xl text-center">
                <q-spinner-oval color="blue-6" size="48px" />
                <p class="q-mt-md text-grey-7 text-weight-medium">Cargando base de datos...</p>
              </td>
            </tr>
            <tr v-else-if="store.solicitudes.length === 0">
              <td colspan="6" class="q-pa-xl text-center">
                <q-icon name="description" size="80px" color="grey-3" />
                <p class="text-h5 text-weight-bold text-grey-9 q-mt-md">No se encontraron solicitudes</p>
                <p class="text-grey-6 text-weight-medium">Comienza creando una nueva solicitud terrestre.</p>
              </td>
            </tr>
            <tr 
              v-for="item in store.solicitudes" 
              :key="item.idSolicitud"
              class="table-row border-b-grey-1 transition-all"
              @click="viewDetail(item)"
            >
              <td class="q-px-lg">
                <div class="text-weight-bolder text-dark" style="font-size: 14px;">{{ item.codigo }}</div>
                <div class="text-caption text-grey-5">{{ formatDate(item.createdAt) }}</div>
              </td>
              <td class="q-px-lg">
                <div class="text-weight-medium text-grey-9" style="font-size: 14px;">{{ item.proyecto }}</div>
                <div class="text-caption text-grey-6 row items-center q-gutter-x-xs">
                  <span>{{ item.solicitante }}</span>
                </div>
              </td>
              <td class="q-px-lg">
                <div class="row items-center q-gutter-x-sm telsxt-weight-bold text-grey-8" style="font-size: 13px;">
                  <span>{{ item.transporte.origen }}</span>
                  <q-icon name="arrow_forward" color="blue-5" size="14px" />
                  <span>{{ item.transporte.destino }}</span>
                </div>
                <div class="text-caption text-grey-5 q-mt-xs">{{ formatDateTime(item.transporte.fechaHoraSalida) }}</div>
              </td>
              <td class="q-px-lg text-center">
                <div class="text-weight-bold text-grey-8">PAX: {{ item.numeroDePPersonas || 0 }}</div>
              </td>
              <td class="q-px-lg">
                <q-badge 
                  rounded 
                  class="q-px-sm q-py-xs text-weight-bolder text-uppercase"
                  :style="statusStyle(item.status)"
                  :label="item.status"
                />
              </td>
              <td class="q-px-lg text-right" @click.stop>
                <div class="row justify-end q-gutter-x-sm no-wrap">
                  <q-btn flat class="action-btn" color="grey-6" @click="viewDetail(item)">
                    <q-icon name="visibility" size="20px" />
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Ver detalle</q-tooltip>
                  </q-btn>
                  <q-btn v-if="item.status === 'BORRADOR'" flat class="action-btn" color="blue-6" @click="editSolicitud(item)">
                    <q-icon name="edit" size="20px" />
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Editar</q-tooltip>
                  </q-btn>
                  <q-btn v-if="item.status === 'BORRADOR'" flat class="action-btn" color="red-5" @click="confirmDelete(item)">
                    <q-icon name="delete_outline" size="20px" />
                    <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">Eliminar</q-tooltip>
                  </q-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mobile View (Cards) -->
    <div class="lt-md q-gutter-y-md">
      <div v-if="store.solicitudes.length === 0 && !store.isLoading" class="bg-white q-pa-xl text-center rounded-2xl shadow-1">
        <q-icon name="description" size="64px" color="grey-3" />
        <p class="text-weight-bold text-grey-8 q-mt-md">No hay solicitudes</p>
      </div>
      
      <div 
        v-for="item in store.solicitudes" 
        :key="item.idSolicitud + '_mobile'"
        class="bg-white q-pa-md rounded-2xl shadow-1 border-grey-1"
        @click="viewDetail(item)"
      >
        <div class="row justify-between items-start q-mb-md">
          <div>
            <div class="text-weight-bolder text-dark">{{ item.codigo }}</div>
            <div class="text-caption text-weight-medium text-grey-8">{{ item.proyecto }}</div>
          </div>
          <q-badge 
            rounded 
            class="q-px-sm q-py-xs text-weight-bolder text-uppercase"
            :style="statusStyle(item.status)"
            :label="item.status"
          />
        </div>
        
        <div class="row items-center q-gutter-x-sm text-caption text-grey-7 q-mb-md">
          <span class="text-weight-bold">{{ item.transporte.origen }}</span>
          <q-icon name="arrow_forward" size="12px" />
          <span class="text-weight-bold">{{ item.transporte.destino }}</span>
        </div>

        <div class="row justify-between items-center">
          <div class="text-caption text-grey-5">{{ formatDate(item.createdAt) }}</div>
          <div class="row q-gutter-x-xs">
            <q-btn flat round dense icon="visibility" color="grey-6" size="sm" @click.stop="viewDetail(item)" />
            <q-btn v-if="item.status === 'BORRADOR'" flat round dense icon="edit" color="blue-6" size="sm" @click.stop="editSolicitud(item)" />
            <q-btn v-if="item.status === 'BORRADOR'" flat round dense icon="delete_outline" color="red-5" size="sm" @click.stop="confirmDelete(item)" />
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <SolicitudTerrestreEditModal 
      v-model="showEditModal" 
      @saved="loadSolicitudes"
    />

    <!-- Detail Modal -->
    <SolicitudTerrestreDetalleModal 
      v-model="showDetailModal" 
      :solicitud="selectedItem" 
      @edit="handleEditFromDetail"
    />
  </div>
</template>

<script>
import { useSolicitudTerrestreStore } from '../../application/solicitudTerrestre.store.js';
import SolicitudTerrestreDetalleModal from '../components/SolicitudTerrestreDetalleModal.vue';
import SolicitudTerrestreEditModal from '../components/SolicitudTerrestreEditModal.vue';

export default {
  name: 'SolicitudTerrestreListView',
  components: {
    SolicitudTerrestreDetalleModal,
    SolicitudTerrestreEditModal
  },
  
  data() {
    const store = useSolicitudTerrestreStore();
    return {
      store,
      showDetailModal: false,
      showEditModal: false,
      selectedItem: {},
      filters: {
        status: '',
        proyecto: ''
      },
      statusOptions: [
        { label: 'Todos los estados', value: '' },
        { label: 'Borradores', value: 'BORRADOR' },
        { label: 'Enviadas', value: 'ENVIADA' },
        { label: 'Aprobadas', value: 'APROBADA' },
        { label: 'Rechazadas', value: 'RECHAZADA' }
      ]
    };
  },
  
  mounted() {
    this.loadSolicitudes();
    this.$watch('filters', () => {
      this.loadSolicitudes();
    }, { deep: true });
  },
  
  methods: {
    loadSolicitudes() {
      this.store.fetchAll(this.filters);
    },
    
    getStatusLabel(value) {
      const option = this.statusOptions.find(o => o.value === value);
      return option ? option.label : value;
    },

    viewDetail(item) {
      this.selectedItem = item;
      this.showDetailModal = true;
    },

    editSolicitud(item) {
      this.store.solicitudActual = { ...item };
      this.showEditModal = true;
    },

    handleEditFromDetail(item) {
      this.showDetailModal = false;
      this.editSolicitud(item);
    },

    confirmDelete(item) {
      this.$q.dialog({
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que deseas eliminar la solicitud ${item.codigo}? Esta acción no se puede deshacer.`,
        cancel: true,
        persistent: true,
        ok: {
          label: 'Eliminar',
          color: 'red-5',
          flat: true
        }
      }).onOk(async () => {
        try {
          await this.store.deleteSolicitud(item.idSolicitud);
          this.$q.notify({
            type: 'positive',
            message: 'Solicitud eliminada exitosamente',
            position: 'top-right'
          });
        } catch (err) {
          this.$q.notify({
            type: 'negative',
            message: 'Error al eliminar la solicitud',
            position: 'top-right'
          });
        }
      });
    },
    
    statusStyle(status) {
      switch (status) {
        case 'BORRADOR': return 'background: #f3f4f6; color: #4b5563; border: 1px solid #e5e7eb;';
        case 'ENVIADA': return 'background: #fef9c3; color: #854d0e; border: 1px solid #fef08a;';
        case 'APROBADA': return 'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;';
        case 'RECHAZADA': return 'background: #fee2e2; color: #991b1b; border: 1px solid #fecaca;';
        default: return 'background: #f3f4f6; color: #4b5563;';
      }
    },
    
    formatDate(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
    },
    
    formatDateTime(dateString) {
      if (!dateString) return '';
      return new Date(dateString).toLocaleTimeString('es-ES', { 
        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
      });
    }
  }
};
</script>

<style scoped>
.primary-btn {
  height: 44px;
  padding: 0 24px;
  font-size: 14px;
  font-weight: 600;
  border-radius: 12px;
}

.table-row {
  height: 64px;
  cursor: pointer;
  border-bottom: 1px solid #f3f4f6;
}

.table-row:hover {
  background: #f8fafc;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: #f3f4f6;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #e5e7eb;
  transform: translateY(-1px);
}

.custom-table th {
  font-size: 11px;
  color: #64748b;
  padding-top: 20px;
  padding-bottom: 20px;
}

@keyframes in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-in {
  animation: in 0.6s cubic-bezier(0, 0, 0.2, 1) forwards;
}
</style>
