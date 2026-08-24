<template>
  <div class="q-pa-xl page-container">
    <q-card class="shadow-lg rounded-lg w-full max-w-1100">
      <q-card-section class="row items-center q-pa-md">
        <div class="text-h6">Presupuestos de Abastecimiento</div>
        <q-space />
        <q-input
          dense
          outlined
          placeholder="Buscar por nombre, líder o estado..."
          v-model="search"
          clearable
          debounce="250"
          class="search-input"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
        <q-btn flat dense class="q-ml-sm" icon="refresh" @click="loadPlans" />
      </q-card-section>

      <q-separator />

      <q-card-section class="q-pa-md">
        <q-inner-loading :showing="isLoading">
          <q-spinner-dots size="40px" color="primary" />
        </q-inner-loading>

        <q-table
          :rows="filteredPlans"
          :columns="columns"
          row-key="id"
          dense
          flat
          hide-bottom
        >
          <template v-slot:body="props">
            <transition-group name="fade-list" tag="tbody">
              <tr v-for="row in props.rows" :key="row.id" class="q-table--row">
                <td class="text-left">{{ row.name }}</td>
                <td class="text-left">{{ row.ownerId || '—' }}</td>
                <td class="text-left">{{ formatDate(row.startDate) }}</td>
                <td class="text-left">{{ formatDate(row.endDate) }}</td>
                <td class="text-left">{{ humanStatus(row.status) }}</td>
                <td class="text-right actions-cell">
                  <q-btn dense round flat icon="remove_red_eye" color="primary" @click="viewDetails(row)" />
                  <q-btn dense round flat icon="edit" color="amber" class="q-ml-sm" @click="$emit('edit-plan', row.id)" />
                  <q-btn dense round flat icon="delete" color="negative" class="q-ml-sm" @click="confirmDelete(row)" />
                </td>
              </tr>
            </transition-group>
          </template>
        </q-table>

        <div v-if="!filteredPlans.length && !isLoading" class="text-center text-grey-6 q-pa-lg">
          No se encontraron presupuestos.
        </div>
      </q-card-section>

      <!-- Detalles -->
      <q-dialog v-model="showDetails">
        <q-card style="min-width: 420px; max-width: 720px;">
          <q-card-section>
            <div class="text-h6">Detalle del Presupuesto</div>
            <div class="text-subtitle2 text-grey-7">{{ detailItem.name }}</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <div><strong>Líder:</strong> {{ detailItem.ownerId || '—' }}</div>
            <div><strong>Fechas:</strong> {{ formatDate(detailItem.startDate) }} — {{ formatDate(detailItem.endDate) }}</div>
            <div><strong>Estado:</strong> {{ humanStatus(detailItem.status) }}</div>
            <div class="q-mt-sm"><strong>Descripción</strong></div>
            <div class="text-body2 q-mt-xs">{{ detailItem.description || 'Sin descripción' }}</div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Cerrar" v-close-popup />
            <q-btn unelevated color="primary" label="Editar" @click="gotoEditFromDetails" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </div>
</template>

<script>
import { ref, computed, onMounted } from '@vue/composition-api';
import { useSupplyPlansStore } from 'src/piña/supplyPlans';
import { Dialog } from 'quasar';

export default {
  name: 'ListaPresupuestosAbastecimiento',
  emits: ['edit-plan'],
  setup(_, { emit }) {
    const store = useSupplyPlansStore();
    const search = ref('');
    const showDetails = ref(false);
    const detailItem = ref({});

    const columns = [
      { name: 'name', label: 'Presupuesto', field: 'name' },
      { name: 'owner', label: 'Líder', field: 'ownerId' },
      { name: 'start', label: 'Inicio', field: 'startDate' },
      { name: 'end', label: 'Fin', field: 'endDate' },
      { name: 'status', label: 'Estado', field: 'status' },
      { name: 'actions', label: 'Acciones', field: 'actions', align: 'right' },
    ];

    const isLoading = computed(() => store.isLoading);

    const loadPlans = async function () {
      try {
        await store.fetchAllPlans();
      } catch (error) {
        // Silently handled; store.errors will contain message
      }
    };

    onMounted(() => {
      loadPlans();
    });

    const normalized = (text) => (text || '').toString().toLowerCase();

    const filteredPlans = computed(() => {
      const term = normalized(search.value);
      if (!term) return store.plans || [];
      return (store.plans || []).filter((p) => {
        return (
          normalized(p.name).includes(term) ||
          normalized(p.ownerId).includes(term) ||
          normalized(p.status).includes(term)
        );
      });
    });

    const formatDate = (d) => {
      if (!d) return '—';
      try {
        return new Date(d).toLocaleDateString('es-CO');
      } catch (e) {
        return d;
      }
    };

    const humanStatus = (st) => {
      const map = {
        en_planificacion: 'Planificación',
        activo: 'Activo',
        en_pausa: 'En pausa',
        completado: 'Completado',
      };
      return map[st] || st || '—';
    };

    const viewDetails = async (row) => {
      try {
        const data = await store.fetchPlanById(row.id);
        detailItem.value = data || row;
        showDetails.value = true;
      } catch (error) {
        Dialog.create({ title: 'Error', message: 'No se pudo cargar el detalle.' });
      }
    };

    const gotoEditFromDetails = () => {
      showDetails.value = false;
      emit('edit-plan', detailItem.value.id);
    };

    const confirmDelete = (row) => {
      Dialog.create({
        title: 'Confirmar eliminación',
        message: `¿Eliminar el presupuesto "${row.name}"? Esta acción no se puede deshacer.`,
        ok: { label: 'Eliminar', color: 'negative' },
        cancel: { label: 'Cancelar' },
      }).onOk(async () => {
        try {
          await store.deletePlan(row.id);
        } catch (error) {
          Dialog.create({ title: 'Error', message: 'No se pudo eliminar el plan.' });
        }
      });
    };

    return {
      search,
      columns,
      filteredPlans,
      isLoading,
      loadPlans,
      formatDate,
      humanStatus,
      viewDetails,
      showDetails,
      detailItem,
      confirmDelete,
      gotoEditFromDetails,
    };
  },
};
</script>

<style scoped>
.page-container {
  background: #f8fafc;
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.search-input {
  max-width: 420px;
}
.actions-cell {
  white-space: nowrap;
}

/* Fade-in list rows */
.fade-list-enter-active {
  transition: all 0.28s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-list-leave-active {
  transition: all 0.2s ease;
}
.fade-list-enter {
  opacity: 0;
  transform: translateY(6px);
}
.fade-list-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Minor table row styling */
.q-table--row td {
  padding: 12px 8px;
  vertical-align: middle;
}

</style>
