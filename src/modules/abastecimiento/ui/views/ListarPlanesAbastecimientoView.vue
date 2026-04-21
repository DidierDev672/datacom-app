<template>
  <div class="q-pa-md">
    <q-card class="my-card">
      <q-card-section class="bg-primary text-white row justify-between items-center">
        <div>
          <div class="text-h5">Lista de Planes de Abastecimiento</div>
          <div class="text-subtitle2">Administre los planes creados en el sistema</div>
        </div>
        <q-btn 
          color="white" 
          text-color="primary" 
          label="Nuevo Plan" 
          icon="add" 
          @click="irACrearPlan" 
        />
      </q-card-section>

      <q-card-section>
        <q-table
          flat
          bordered
          :data="store.plans"
          :columns="columns"
          row-key="id"
          :loading="store.isLoading"
          no-data-label="No hay planes de abastecimiento registrados"
        >
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip 
                :color="getColorForStatus(props.row.status)" 
                text-color="white"
              >
                {{ props.row.statusDescription || props.row.status }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn 
                flat 
                round 
                color="primary" 
                icon="edit" 
                @click="editarPlan(props.row)" 
              >
                <q-tooltip>Editar plan</q-tooltip>
              </q-btn>
              <q-btn 
                flat 
                round 
                color="negative" 
                icon="delete" 
                @click="eliminarPlan(props.row)" 
              >
                <q-tooltip>Eliminar plan</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { useSupplyPlansStore } from 'src/piña/supplyPlans';

export default {
  name: 'ListarPlanesAbastecimientoView',
  data() {
    return {
      store: useSupplyPlansStore(),
      columns: [
        { name: 'name', label: 'Nombre del Plan', field: 'name', align: 'left', sortable: true },
        { name: 'year', label: 'Año', field: 'year', align: 'center', sortable: true },
        { 
          name: 'totalBudget', 
          label: 'Presupuesto Total', 
          field: 'totalBudget', 
          align: 'right', 
          format: val => val ? `$${Number(val).toLocaleString()}` : '$0',
          sortable: true 
        },
        { 
          name: 'availableBudget', 
          label: 'Disponible', 
          field: 'availableBudget', 
          align: 'right', 
          format: val => val ? `$${Number(val).toLocaleString()}` : '$0',
          sortable: true 
        },
        { name: 'status', label: 'Estado', field: 'status', align: 'center', sortable: true },
        { name: 'actions', label: 'Acciones', align: 'center' }
      ]
    };
  },
  async mounted() {
    try {
      await this.store.fetchAllPlans();
    } catch (error) {
      if (this.$q) {
        this.$q.notify({
          color: 'negative',
          message: 'Error al cargar la lista de planes.'
        });
      }
    }
  },
  methods: {
    irACrearPlan() {
      if (this.$router) {
         this.$router.push({ name: 'Crear-plan-abastecimiento' });
      }
    },
    editarPlan(plan) {
      if (this.$q) {
        this.$q.notify({
          message: `Editar plan: ${plan.name} (Funcionalidad pendiente)`,
          color: 'info'
        });
      }
    },
    eliminarPlan(plan) {
      if (!this.$q) return;

      this.$q.dialog({
        title: 'Confirmar Eliminación',
        message: `¿Está seguro que desea eliminar el plan "${plan.name}"?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await this.store.deletePlan(plan.id);
          this.$q.notify({
            color: 'positive',
            message: 'Plan eliminado exitosamente'
          });
        } catch (error) {
          this.$q.notify({
            color: 'negative',
            message: 'No se pudo eliminar el plan'
          });
        }
      });
    },
    getColorForStatus(status) {
      if (!status) return 'grey';
      const map = {
        'ACTIVO': 'positive',
        'activo': 'positive',
        'EN_PAUSA': 'warning',
        'en_pausa': 'warning',
        'COMPLETADO': 'info',
        'completado': 'info',
        'CANCELADO': 'negative',
        'cancelado': 'negative'
      };
      return map[status] || 'grey';
    }
  }
};
</script>
