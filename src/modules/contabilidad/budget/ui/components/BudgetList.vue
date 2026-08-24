<template>
  <q-page class="q-pa-md">
    <q-card flat bordered class="budget-list-card">
      <q-card-section class="q-pb-sm row items-center justify-between">
        <div>
          <div class="text-h6 text-weight-bold text-dark">Lista de Presupuestos</div>
          <p class="text-body2 text-grey-8 q-mb-none">Gestiona los presupuestos registrados en el sistema.</p>
        </div>
        <q-btn color="primary" icon="add" label="Nuevo Presupuesto" unelevated no-caps @click="$router.push('/contabilidad/presupuesto')" />
      </q-card-section>

      <q-separator />

      <!-- Filtros -->
      <q-card-section class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-4">
          <q-input
            v-model="filters.name"
            outlined
            dense
            placeholder="Buscar por nombre"
            clearable
            @input="filterData"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-sm-6 col-md-4">
          <q-select
            v-model="filters.fiscalYear"
            outlined
            dense
            :options="fiscalYearOptions"
            label="Año fiscal"
            clearable
            emit-value
            map-options
            @input="filterData"
          >
            <template v-slot:prepend>
              <q-icon name="calendar_today" />
            </template>
          </q-select>
        </div>
      </q-card-section>

      <!-- Tabla -->
      <q-table
        :data="filteredBudgets"
        :columns="columns"
        row-key="id"
        flat
        bordered
        :loading="loading"
        no-data-label="No hay presupuestos registrados"
        class="budget-table"
      >
        <template v-slot:body-cell-costCenter="props">
          <q-td :props="props">
            {{ getCostCenterName(props.row.cost_center_id) }}
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge :color="getStatusColor(props.row.status)" :label="props.row.status" />
          </q-td>
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-sm">
            <q-btn flat round dense color="primary" icon="electrical_services" @click="openBudgetDetails(props.row)">
              <q-tooltip>Agregar / gestionar detalles</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="info" icon="visibility" @click="viewBudget(props.row)">
              <q-tooltip>Ver presupuesto</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="warning" icon="edit" @click="editBudget(props.row)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="negative" icon="delete" @click="confirmDelete(props.row)">
              <q-tooltip>Eliminar</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>

      <!-- Total -->
      <q-card-section class="row justify-end q-mt-md">
        <q-badge color="primary" class="text-subtitle1 q-pa-sm" style="border-radius: 8px;">
          Total Presupuestado: {{ formatCurrency(totalBudget) }}
        </q-badge>
      </q-card-section>
    </q-card>

    <!-- Modal de Detalle de Presupuesto -->
    <q-dialog v-model="isViewModalOpen" persistent>
      <q-card class="ux-modal-card">
        <!-- Header -->
        <q-card-section class="ux-modal-header row items-center justify-between">
          <div class="row items-center q-gutter-sm">
            <div class="ux-modal-title">Detalle del Presupuesto</div>
            <div v-if="selectedBudget" class="ux-badge" :class="getBadgeClass(selectedBudget.status)">
              {{ selectedBudget.status }}
            </div>
          </div>
          <q-btn icon="close" flat round dense color="grey-7" @click="cerrarViewModal" />
        </q-card-section>

        <!-- Body -->
        <q-card-section class="ux-modal-body" v-if="selectedBudget">
          
          <!-- Información Principal -->
          <div class="ux-visual-card q-mb-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-12">
                <div class="ux-label">Presupuesto</div>
                <div class="ux-value">{{ selectedBudget.name }}</div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="ux-label">Año fiscal</div>
                <div class="ux-value">{{ selectedBudget.fiscal_year }}</div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="ux-label">Responsable</div>
                <div class="ux-value">{{ selectedBudget.responsible_area }}</div>
              </div>
            </div>
          </div>

          <!-- Información Financiera -->
          <div class="ux-visual-card q-mb-md">
            <div class="row q-col-gutter-md">
              <div class="col-12 col-sm-6">
                <div class="ux-label">Centro de Costo</div>
                <div class="ux-value">
                  {{ getCostCenterDetail(selectedBudget.cost_center_id).name }} 
                  <span class="text-grey-6">({{ getCostCenterDetail(selectedBudget.cost_center_id).code }})</span>
                </div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="ux-label">Presupuesto Asignado</div>
                <div class="ux-financial-value">
                  {{ formatCurrency(getCostCenterDetail(selectedBudget.cost_center_id).budget) }}
                </div>
              </div>
            </div>
          </div>

          <!-- Líneas de detalle del presupuesto -->
          <div class="row items-center justify-between q-mb-sm">
            <div class="text-subtitle2 text-weight-medium">Líneas de detalle</div>
            <q-badge
              v-if="detalleRegistrado"
              color="positive"
              outline
              :label="`${detallesPresupuesto.length} registro(s)`"
            />
          </div>

          <div v-if="cargandoDetalles" class="text-center q-py-lg">
            <q-spinner-dots color="primary" size="32px" />
            <p class="text-caption text-grey-7 q-mt-sm">Validando detalle del presupuesto…</p>
          </div>

          <div
            v-else-if="errorCargaDetalles"
            class="ux-sin-detalles ux-sin-detalles--error q-pa-lg text-center"
          >
            <q-icon name="error_outline" size="48px" color="negative" class="q-mb-md" />
            <p class="text-body1 text-grey-8 q-mb-xs">No se pudo verificar el detalle del presupuesto.</p>
            <p class="text-body2 text-grey-6 q-mb-md">{{ errorCargaDetalles }}</p>
            <q-btn
              flat
              no-caps
              color="primary"
              icon="refresh"
              label="Reintentar"
              @click="cargarDetallesPresupuesto"
            />
          </div>

          <template v-else-if="detalleRegistrado">
            <q-table
              :data="detallesPresupuesto"
              :columns="columnasDetalles"
              row-key="id"
              flat
              bordered
              dense
              hide-bottom
              :pagination="{ rowsPerPage: 0 }"
              class="q-mb-md"
            >
              <template v-slot:body-cell-spent_amount="props">
                <q-td :props="props">{{ formatCurrency(props.row.spent_amount) }}</q-td>
              </template>
              <template v-slot:body-cell-order_total="props">
                <q-td :props="props">{{ formatCurrency(props.row.order_total) }}</q-td>
              </template>
            </q-table>
            <div class="row justify-end q-mb-md">
              <q-badge color="primary" class="text-subtitle2 q-px-md q-py-sm" style="border-radius: 8px;">
                Total del pedido: {{ formatCurrency(totalDetallePresupuesto) }}
              </q-badge>
            </div>
          </template>

          <div v-else-if="sinDetalleRegistrado" class="ux-sin-detalles q-pa-lg text-center">
            <q-icon name="inventory_2" size="48px" color="grey-5" class="q-mb-md" />
            <p class="text-body1 text-grey-8 q-mb-xs">
              Debes agregar el detalle del presupuesto para registrar áreas, cantidades y montos.
            </p>
            <p class="text-body2 text-grey-6 q-mb-md">
              Este presupuesto aún no tiene detalle registrado. Puedes crearlo ahora si lo necesitas.
            </p>
            <q-btn
              unelevated
              no-caps
              color="primary"
              icon="add"
              label="Agregar detalle del presupuesto"
              @click="abrirCreacionDetalle"
            />
          </div>

        </q-card-section>

        <!-- Footer -->
        <q-card-actions align="right" class="ux-modal-footer">
          <q-btn
            v-if="detalleRegistrado"
            flat
            no-caps
            color="primary"
            icon="electrical_services"
            label="Gestionar detalles"
            @click="abrirCreacionDetalle"
          />
          <q-btn
            unelevated
            label="Cerrar"
            color="grey-3"
            text-color="grey-9"
            no-caps
            class="q-px-md"
            @click="cerrarViewModal"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <budget-detail-dialog
      v-model="isDetailDialogOpen"
      :budget="budgetForDetails"
      @saved="onDetallesGuardados"
    />

  </q-page>
</template>

<script>
import { budgetApi } from 'src/api/budget.api';
import { costCenterApi } from 'src/api/costCenter.api';
import { GetBudgetDetails } from '../../application/GetBudgetDetails';
import BudgetDetailDialog from './BudgetDetailDialog.vue';

function valorDefinido (valor, defecto) {
  return valor !== null && valor !== undefined ? valor : defecto;
}

export default {
  name: 'BudgetList',
  components: { BudgetDetailDialog },
  data() {
    return {
      isViewModalOpen: false,
      isDetailDialogOpen: false,
      selectedBudget: null,
      budgetForDetails: null,
      detallesPresupuesto: [],
      cargandoDetalles: false,
      errorCargaDetalles: '',
      columnasDetalles: [
        { name: 'detail_date', label: 'Fecha', field: 'detail_date', align: 'left' },
        { name: 'area_name', label: 'Área', field: 'area_name', align: 'left' },
        { name: 'description', label: 'Descripción', field: 'description', align: 'left' },
        { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'center' },
        { name: 'spent_amount', label: 'Precio unitario', field: 'spent_amount', align: 'right' },
        { name: 'order_total', label: 'Total pedido', field: 'order_total', align: 'right' }
      ],
      loading: false,
      budgets: [],
      filteredBudgets: [],
      costCenters: [],
      filters: {
        name: '',
        fiscalYear: null
      },
      columns: [
        { name: 'name', align: 'left', label: 'Nombre del presupuesto', field: 'name', sortable: true },
        { name: 'fiscalYear', align: 'center', label: 'Año fiscal', field: 'fiscal_year', sortable: true },
        { name: 'costCenter', align: 'left', label: 'Centro de costo', field: 'costCenter', sortable: true },
        { name: 'status', align: 'center', label: 'Estado', field: 'status', sortable: true },
        { name: 'actions', align: 'center', label: 'Acciones', field: 'actions', sortable: false }
      ]
    };
  },
  computed: {
    fiscalYearOptions() {
      const currentYear = new Date().getFullYear();
      const options = [];
      for (let i = currentYear - 2; i <= currentYear + 5; i++) {
        options.push({ label: i.toString(), value: i });
      }
      return options;
    },
    totalBudget() {
      let total = 0;
      for (const budget of this.filteredBudgets) {
        const cc = this.costCenters.find(c => c.id === budget.cost_center_id);
        if (cc && cc.budget) {
          total += Number(cc.budget);
        }
      }
      return total;
    },
    detalleRegistrado () {
      return !this.cargandoDetalles
        && !this.errorCargaDetalles
        && this.detallesPresupuesto.length > 0;
    },
    sinDetalleRegistrado () {
      return !this.cargandoDetalles
        && !this.errorCargaDetalles
        && this.detallesPresupuesto.length === 0;
    },
    totalDetallePresupuesto () {
      return this.detallesPresupuesto.reduce(
        (sum, row) => sum + (Number(row.order_total) || 0),
        0
      );
    }
  },
  watch: {
    isDetailDialogOpen (abierto) {
      if (!abierto && this.selectedBudget) {
        this.isViewModalOpen = true;
        this.cargarDetallesPresupuesto();
      }
    }
  },
  async created() {
    await this.fetchData();
  },
  methods: {
    async fetchData() {
      this.loading = true;
      try {
        const [budgetsRes, costCentersRes] = await Promise.all([
          budgetApi.getAll(),
          costCenterApi.getAll()
        ]);
        this.budgets = Array.isArray(budgetsRes) ? budgetsRes : [];
        this.costCenters = Array.isArray(costCentersRes) ? costCentersRes : [];
        this.filterData();
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Error al cargar los datos',
          position: 'top-right'
        });
      } finally {
        this.loading = false;
      }
    },
    filterData() {
      this.filteredBudgets = this.budgets.filter(b => {
        const matchName = !this.filters.name || b.name.toLowerCase().includes(this.filters.name.toLowerCase());
        const matchYear = !this.filters.fiscalYear || b.fiscal_year === this.filters.fiscalYear;
        return matchName && matchYear;
      });
    },
    getCostCenterName(id) {
      const cc = this.getCostCenterDetail(id);
      return cc ? cc.name : 'Desconocido';
    },
    getCostCenterDetail(id) {
      return this.costCenters.find(c => c.id === id) || {};
    },
    getBadgeClass(status) {
      const map = {
        'Vigente': 'ux-badge-positive',
        'En ejecución': 'ux-badge-info',
        'En evaluación': 'ux-badge-warning',
        'Pendiente': 'ux-badge-grey'
      };
      return map[status] || 'ux-badge-grey';
    },
    getStatusColor(status) {
      const map = {
        'Vigente': 'positive',
        'En ejecución': 'info',
        'En evaluación': 'warning',
        'Pendiente': 'grey'
      };
      return map[status] || 'grey';
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value || 0);
    },
    openBudgetDetails(row) {
      this.budgetForDetails = row;
      this.isDetailDialogOpen = true;
    },
    viewBudget(row) {
      this.selectedBudget = row;
      this.isViewModalOpen = true;
      this.cargarDetallesPresupuesto();
    },
    _normalizarDetalle (row) {
      if (!row) return row;
      return {
        id: row.id,
        area_name: valorDefinido(row.area_name, valorDefinido(row.areaName, '')),
        description: valorDefinido(row.description, ''),
        quantity: valorDefinido(row.quantity, 1),
        spent_amount: valorDefinido(row.spent_amount, valorDefinido(row.spentAmount, 0)),
        order_total: valorDefinido(row.order_total, valorDefinido(row.orderTotal, 0)),
        detail_date: valorDefinido(row.detail_date, valorDefinido(row.detailDate, ''))
      };
    },
    async cargarDetallesPresupuesto () {
      if (!this.selectedBudget || !this.selectedBudget.id) return;
      this.cargandoDetalles = true;
      this.errorCargaDetalles = '';
      try {
        const getDetails = new GetBudgetDetails();
        const lista = await getDetails.execute(this.selectedBudget.id);
        this.detallesPresupuesto = (Array.isArray(lista) ? lista : []).map(this._normalizarDetalle);
      } catch (e) {
        this.detallesPresupuesto = [];
        this.errorCargaDetalles = (e && e.message)
          ? e.message
          : 'Error al consultar el detalle. Verifica tu conexión e intenta de nuevo.';
      } finally {
        this.cargandoDetalles = false;
      }
    },
    abrirCreacionDetalle () {
      const presupuesto = this.selectedBudget;
      if (!presupuesto || !presupuesto.id) {
        this.$q.notify({
          type: 'warning',
          icon: 'warning',
          message: 'No se puede abrir el detalle: el presupuesto no tiene identificador.',
          position: 'top-right',
          timeout: 4000
        });
        return;
      }
      this.budgetForDetails = presupuesto;
      this.isViewModalOpen = false;
      this.$nextTick(() => {
        this.isDetailDialogOpen = true;
      });
    },
    async onDetallesGuardados () {
      if (this.selectedBudget && this.selectedBudget.id) {
        await this.cargarDetallesPresupuesto();
      }
      await this.fetchData();
    },
    cerrarViewModal () {
      this.isViewModalOpen = false;
      this.selectedBudget = null;
      this.detallesPresupuesto = [];
      this.errorCargaDetalles = '';
    },
    editBudget(row) {
      // Logic to edit budget
      this.$q.notify({ message: `Editando ${row.name}`, color: 'warning' });
    },
    confirmDelete(row) {
      this.$q.dialog({
        title: 'Confirmar eliminación',
        message: `¿Estás seguro de eliminar el presupuesto "${row.name}"?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await budgetApi.remove(row.id);
          this.$q.notify({ type: 'positive', message: 'Presupuesto eliminado' });
          this.fetchData();
        } catch (e) {
          this.$q.notify({ type: 'negative', message: 'Error al eliminar' });
        }
      });
    }
  }
};
</script>

<style scoped>
.budget-list-card {
  border-radius: 12px;
}
.budget-table {
  border-radius: 8px;
}

/* 
 * Optimizaciones UX para el modal
 */
.ux-modal-card {
  min-width: 640px;
  max-width: 92vw;
  border-radius: 12px;
  background: #ffffff;
}
.ux-sin-detalles {
  background: #fff;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
}
.ux-sin-detalles--error {
  border-color: #fecaca;
  background: #fef2f2;
}
.ux-modal-header {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 24px;
}
.ux-modal-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
}
.ux-modal-body {
  padding: 24px;
  background: #f8fafc;
  max-height: 65vh;
  overflow-y: auto;
}
.ux-visual-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 20px;
}
.ux-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: #94a3b8;
  margin-bottom: 4px;
}
.ux-value {
  font-size: 16px;
  font-weight: 500;
  color: #0f172a;
}
.ux-financial-value {
  font-size: 22px;
  font-weight: 700;
  color: #16a34a;
}
.ux-modal-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  background: #ffffff;
}

/* Badges Personalizados */
.ux-badge {
  padding: 4px 12px;
  border-radius: 9999px;
  font-size: 13px;
  font-weight: 600;
  display: inline-block;
}
.ux-badge-warning {
  background: #fff7ed;
  color: #ea580c;
  border: 1px solid #fdba74;
}
.ux-badge-positive {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #86efac;
}
.ux-badge-info {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #93c5fd;
}
.ux-badge-grey {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #cbd5e1;
}
</style>
