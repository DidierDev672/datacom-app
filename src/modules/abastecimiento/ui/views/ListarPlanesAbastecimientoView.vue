<template>
  <div class="q-pa-xl page-container">
    <div v-if="isLoadingLocal" class="page-loading-overlay">
      <div class="loading-card">
        <svg class="orbit-gradient" viewBox="0 0 50 50" width="48" height="48">
          <defs>
            <linearGradient id="orbitStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#84B24D" />
              <stop offset="50%" stop-color="#6AA84F" />
              <stop offset="100%" stop-color="#3D8B40" />
            </linearGradient>
            <radialGradient id="orbitFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#A8D08D" />
              <stop offset="100%" stop-color="#4E9C4C" />
            </radialGradient>
          </defs>
          <ellipse class="orbit-ring" cx="25" cy="25" rx="20" ry="10" fill="none" stroke="url(#orbitStroke)" stroke-width="3" stroke-linecap="round" />
          <ellipse class="orbit-dot" cx="25" cy="12" rx="4.5" ry="4.5" fill="url(#orbitFill)" />
        </svg>
        <div class="loading-text">Estamos preparando y organizando los planes de abastecimiento para que puedas revisarlos de forma rápida y eficaz</div>
      </div>
    </div>
    <div v-if="store.isDeleting" class="page-loading-overlay">
      <div class="loading-card">
        <q-spinner-dots size="48px" color="primary" />
        <div class="loading-text">Eliminando plan de abastecimiento...</div>
      </div>
    </div>
    <q-card class="table-card shadow-lg rounded-lg">
      <!-- Cabecera con Gradiente Institucional -->
      <q-card-section class="header-gradient text-white q-pa-xl">
        <div class="row justify-between items-center no-wrap">
          <div>
            <div class="text-h3 text-weight-bold text-white">Planes de abastecimiento</div>
            <div class="text-subtitle2 text-white opacity-60 q-mt-xs">Gestión estratégica y seguimiento de planes de abastecimiento</div>
          </div>
          <div class="row items-center q-gutter-sm">
            <q-btn outline dense color="white" icon="refresh" size="md" round @click="refrescarPlanes">
              <q-tooltip>Refrescar lista</q-tooltip>
            </q-btn>
            <q-btn outline color="white" label="Crear Nuevo Plan" icon="add" padding="10px 20px"
              class="rounded-lg font-bold" @click="irACrearPlan" no-caps />
          </div>
        </div>
      </q-card-section>

      <!-- Filtros de Búsqueda -->
      <q-card-section class="q-px-lg q-pt-lg">
        <div class="row q-col-gutter-md items-end">
          <div class="col-12 col-md-3">
            <label class="filter-label">Fecha de Inicio</label>
            <q-input v-model="filters.startDate" outlined dense bg-color="white" mask="date" placeholder="AAAA/MM/DD">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="filters.startDate" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <label class="filter-label">Fecha Final</label>
            <q-input v-model="filters.endDate" outlined dense bg-color="white" mask="date" placeholder="AAAA/MM/DD">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="filters.endDate" mask="YYYY-MM-DD" />
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <label class="filter-label">Buscar por nombre</label>
            <q-input v-model="filters.search" outlined dense bg-color="white" placeholder="Ej: Plan Anual..."
              @input="filtrarPlanes">
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-2">
            <q-btn flat color="grey-7" icon="restart_alt" label="Limpiar" class="full-width" no-caps
              @click="resetFilters" />
          </div>
        </div>
      </q-card-section>

      <supply-plans-table :plans="filteredPlans" :columns="columns" :pagination="pagination" :loading="store.isLoading"
        @view="verPlan" @edit="editarPlan" @delete="eliminarPlan" />

      <empty-state v-if="!store.isLoading && filteredPlans.length === 0" title="No hay planes de abastecimiento"
        description="Crea tu primer plan para comenzar a gestionar el abastecimiento." icon="inventory_2">
        <template #action>
          <q-btn unelevated color="primary" label="Crear Plan" icon="add" @click="irACrearPlan" no-caps />
        </template>
      </empty-state>
    </q-card>

    <q-dialog v-model="detailsDialog" persistent>
      <q-card class="pd-modal">
        <!-- Backdrop overlay oscuro para aislar del fondo verde de la tabla -->
        <div class="pd-modal-overlay" />

        <!-- HEADER: nombre + año + estado en una sola línea compacta -->
        <q-card-section class="pd-header">
          <div class="pd-header-left">
            <div class="pd-header-title">{{ (selectedPlan && selectedPlan.name) || '-' }}</div>
            <div class="pd-header-meta">
              <span class="pd-meta-item">
                <q-icon name="event" size="14px" class="pd-meta-icon" />
                {{ (selectedPlan && selectedPlan.year) || '-' }}
              </span>
              <span v-if="selectedPlan && selectedPlan.status"
                :class="['pd-badge', getBadgeClass(selectedPlan.status)]">
                {{ statusLabel(selectedPlan.status) }}
              </span>
            </div>
          </div>
          <q-btn dense flat round icon="close" size="sm" @click="detailsDialog = false" aria-label="Cerrar"
            class="pd-close-btn" />
        </q-card-section>

        <q-separator class="pd-separator" />

        <!-- SECCIÓN FINANCIERA: presupuesto con barra de proporción -->
        <q-card-section class="pd-finance">
          <div class="pd-section-label">Información financiera</div>
          <div class="pd-finance-grid">
            <div class="pd-finance-item">
              <div class="pd-field-label">Presupuesto total</div>
              <div class="pd-field-value pd-field-value--accent">
                {{ selectedPlan ? formatCurrency(selectedPlan.totalBudget) : '-' }}
              </div>
            </div>
            <div class="pd-finance-item">
              <div class="pd-field-label">Disponible</div>
              <div class="pd-field-value">
                {{ selectedPlan ? formatCurrency(selectedPlan.availableBudget) : '-' }}
              </div>
            </div>
          </div>
          <!-- Barra de proporción: total vs disponible -->
          <div v-if="selectedPlan && selectedPlan.totalBudget" class="pd-progress-section">
            <div class="pd-progress-header">
              <span class="pd-progress-label">Uso del presupuesto</span>
              <span class="pd-progress-pct">{{ budgetUsedPercent }}%</span>
            </div>
            <div class="pd-progress-track">
              <div class="pd-progress-fill" :style="{ width: budgetUsedPercent + '%' }" />
            </div>
            <div class="pd-progress-caption">
              Consumido: {{ selectedPlan ? formatCurrency(budgetUsed) : '-' }}
            </div>
          </div>
        </q-card-section>

        <q-separator class="pd-separator" />
        <!-- ACCIÓN: cambiar estado con fondo diferenciado -->
        <q-card-section class="pd-action-zone">
          <div class="pd-action-row">
            <div class="pd-action-text">
              <div class="pd-action-title">Cambiar estado</div>
              <div class="pd-action-hint">Selecciona el siguiente estado para este plan</div>
            </div>
            <div class="pd-action-controls">
              <q-select v-model="detailsStatusSelection" :options="statusTransitionOptions" option-value="value"
                option-label="label" outlined dense label="Nuevo estado" class="pd-status-select"
                :disable="!statusTransitionOptions.length" clearable emit-value map-options />
              <q-btn unelevated color="primary" label="Cambiar" class="pd-btn-change"
                @click="changeStatus(detailsStatusSelection)" :disable="!detailsStatusSelection" no-caps />
            </div>
          </div>
          <div v-if="!statusTransitionOptions.length" class="pd-no-transitions">
            No hay transiciones de estado disponibles para este plan.
          </div>
        </q-card-section>

        <!-- Footer compacto -->
        <q-card-actions align="right" class="pd-footer">
          <q-btn flat label="Cerrar" color="grey-7" @click="detailsDialog = false" no-caps class="pd-btn-close" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <delete-restriction-modal v-model="showRestrictionModal" :plan="restrictionPlan" :error="restrictionError"
      @cancel="handleCancelFromModal" @deactivate="handleDeactivateFromModal" @view="handleViewFromModal" />

    <q-dialog v-model="editDialog" persistent>
      <q-card class="edit-dialog-card">
        <q-card-section class="row items-center justify-between">
          <div>
            <div class="text-h6">Editar Plan de Abastecimiento</div>
            <div class="text-subtitle2 text-grey">Modifica los datos del plan</div>
          </div>
          <q-btn dense flat round icon="close" @click="editDialog = false" aria-label="Cerrar" />
        </q-card-section>

        <q-separator />

        <q-card-section class="edit-form">
          <div class="q-mb-md">
            <AppInput v-model="editForm.name" label="Nombre del Plan" placeholder="Ej: Plan Anual 2024" />
          </div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <AppInput v-model="editForm.startDate" label="Fecha de Inicio" type="date" placeholder="YYYY-MM-DD" />
            </div>
            <div class="col-12 col-md-6">
              <AppInput v-model="editForm.endDate" label="Fecha de Fin" type="date" placeholder="YYYY-MM-DD" />
            </div>
          </div>

          <div class="q-mb-md">
            <label class="form-label">Estado</label>
            <q-select v-model="editForm.status" :options="statusDropdownOptions" option-value="value"
              option-label="label" emit-value map-options outlined dense label="Selecciona un estado"
              :disable="statusDropdownOptions.length <= 1" />
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" @click="editDialog = false" />
          <q-btn unelevated label="Guardar Cambios" color="primary" @click="guardarEdicion" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import EmptyState from 'src/components/EmptyState.vue';
import { useSupplyPlansStore } from 'src/piña/supplyPlans';
import AppInput from 'src/utils/components/AppInput.vue';
import DeleteRestrictionModal from '../components/DeleteRestrictionModal.vue';
import SupplyPlansTable from '../components/SupplyPlansTable.vue';

export default {
  name: 'ListarPlanesAbastecimientoView',
  components: { SupplyPlansTable, DeleteRestrictionModal, EmptyState, AppInput },
  data() {
    return {
      store: useSupplyPlansStore(),
      filters: {
        startDate: '',
        endDate: '',
        search: ''
      },
      pagination: { rowsPerPage: 15 },
      selectedPlan: null,
      detailsDialog: false,
      editDialog: false,
      detailsStatusSelection: '',
      editForm: {
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        status: ''
      },
      showRestrictionModal: false,
      restrictionPlan: null,
      restrictionError: null,
      isLoadingLocal: false,
      columns: [
        { name: 'name', label: 'Nombre del Plan', field: 'name', align: 'left', sortable: true },
        { name: 'year', label: 'Año', field: 'year', align: 'center', sortable: true },
        { name: 'totalBudget', label: 'Presupuesto Total', field: 'totalBudget', align: 'right', sortable: true },
        { name: 'availableBudget', label: 'Disponible', field: 'availableBudget', align: 'right', sortable: true },
        { name: 'status', label: 'Estado', field: 'status', align: 'center', sortable: true },
        { name: 'actions', label: '', align: 'center' }
      ]
    };
  },
  computed: {
    filteredPlans() {
      let plans = this.store.plans || [];
      if (this.filters.search) {
        const needle = this.filters.search.toLowerCase();
        plans = plans.filter(p => p.name.toLowerCase().includes(needle));
      }
      // Filtros de fecha (Lógica simplificada para demostración)
      if (this.filters.startDate) {
        plans = plans.filter(p => p.startDate >= this.filters.startDate);
      }
      if (this.filters.endDate) {
        plans = plans.filter(p => p.endDate <= this.filters.endDate);
      }
      return plans.sort(function (a, b) {
        var dateA = a.startDate || "";
        var dateB = b.startDate || "";
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return dateB.localeCompare(dateA);
      });
    },
    statusTransitions() {
      if (!this.selectedPlan || !this.selectedPlan.status) {
        return [];
      }
      const currentStatus = String(this.selectedPlan.status).toUpperCase();
      if (currentStatus === 'DRAFT') {
        return ['ACTIVE', 'CANCELLED'];
      }
      if (currentStatus === 'ACTIVE') {
        return ['INACTIVE', 'COMPLETED'];
      }
      return [];
    },
    statusTransitionOptions() {
      return this.statusTransitions.map(status => ({
        label: this.statusLabel(status),
        value: status
      }));
    },
    statusDropdownOptions() {
      const statuses = ['DRAFT', 'ACTIVE', 'PENDING', 'INACTIVE', 'COMPLETED', 'CANCELLED'];
      return statuses.map(status => ({
        label: this.statusLabel(status),
        value: status
      }));
    },
    budgetUsed() {
      if (!this.selectedPlan) return 0;
      const total = Number(this.selectedPlan.totalBudget) || 0;
      const available = Number(this.selectedPlan.availableBudget) || 0;
      return Math.max(0, total - available);
    },
    budgetUsedPercent() {
      if (!this.selectedPlan) return 0;
      const total = Number(this.selectedPlan.totalBudget) || 0;
      if (total === 0) return 0;
      const used = this.budgetUsed;
      return Math.min(100, Math.round((used / total) * 100));
    }
  },
  async mounted() {
    await this.cargarPlanes();
  },
  methods: {
    formatCurrency(val) {
      if (!val || Number(val) === 0) return '-';
      return `$${Number(val).toLocaleString()}`;
    },
    getBadgeClass(status) {
      const s = String(status).toUpperCase();
      switch (s) {
        case 'PENDING':
        case 'PENDING_SUPPLY':
        case 'PENDING_AUTHORIZATION':
          return 'badge--pending';
        case 'DRAFT':
          return 'badge--draft';
        case 'ACTIVE':
          return 'badge--active';
        case 'INACTIVE':
          return 'badge--inactive';
        case 'COMPLETED':
          return 'badge--completed';
        case 'CANCELLED':
        case 'CANCELED':
          return 'badge--cancelled';
        default:
          return 'badge--default';
      }
    },
    resetFilters() {
      this.filters = { startDate: '', endDate: '', search: '' };
    },
    filtrarPlanes() {
      // El filtrado se realiza por el computed `filteredPlans`.
      // Mantener este método para evitar el warning cuando el input emite @input.
      // También normalizamos el término de búsqueda.
      if (this.filters && this.filters.search && typeof this.filters.search === 'string') {
        this.filters.search = this.filters.search.trim();
      }
    },
    async cargarPlanes() {
      this.isLoadingLocal = true;
      const inicio = Date.now();
      try {
        await this.store.fetchAllPlans();
      } finally {
        const transcurrido = Date.now() - inicio;
        const restante = Math.max(0, 5000 - transcurrido);
        await new Promise(r => setTimeout(r, restante));
        this.isLoadingLocal = false;
      }
    },
    async refrescarPlanes() {
      await this.cargarPlanes();
      this.$q.notify({ color: 'positive', message: 'Lista actualizada' });
    },
    irACrearPlan() {
      this.$router.push({ name: 'Crear-plan-abastecimiento' });
    },
    editarPlan(plan) {
      this.selectedPlan = plan;
      this.editForm = {
        name: plan.name || '',
        description: plan.description || '',
        startDate: plan.startDate || '',
        endDate: plan.endDate || '',
        status: plan.status || ''
      };
      this.editDialog = true;
    },
    eliminarPlan(plan) {
      this.$q.dialog({
        title: 'Confirmación',
        message: `¿Eliminar plan ${plan.name}?`,
        ok: { color: 'negative', unelevated: true },
        cancel: true
      }).onOk(async () => {
        try {
          await this.store.deletePlan(plan.id);
          this.$q.notify({ color: 'positive', message: 'Plan eliminado exitosamente' });
        } catch (error) {
          var rawCode = (error && error.code) || '';
          var rawMessage = (error && error.message) || '';
          if (rawCode === 'STATUS_TRANSITION_INVALID' || rawCode === 'PLAN-002') {
            this.restrictionPlan = plan;
            this.restrictionError = { code: rawCode, message: rawMessage };
            this.showRestrictionModal = true;
          } else {
            var msg = rawMessage
              || (this.store.deleteStatus && this.store.deleteStatus.message)
              || 'No se pudo eliminar el plan';
            this.$q.notify({ color: 'negative', message: msg });
          }
        }
      });
    },
    verPlan(plan) {
      this.selectedPlan = plan;
      this.detailsStatusSelection = '';
      this.detailsDialog = true;
    },
    statusLabel(status) {
      const labels = {
        DRAFT: 'Borrador',
        ACTIVE: 'Activo',
        PENDING: 'Pendiente',
        INACTIVE: 'Inactivo',
        COMPLETED: 'Completado',
        CANCELLED: 'Cancelado',
        PENDING_SUPPLY: 'Suministro Pendiente',
        PENDING_AUTHORIZATION: 'Pendiente de Autorización',
        REJECTED: 'Rechazado'
      };
      return labels[status] || status;
    },
    async changeStatus(status) {
      if (!this.selectedPlan || !status) return;
      try {
        const updatedPlan = await this.store.updatePlanStatus(this.selectedPlan.id, status);
        this.selectedPlan = updatedPlan;
        this.detailsStatusSelection = '';
        this.$q.notify({ color: 'positive', message: `Estado cambiado a ${this.statusLabel(status)}` });
      } catch (error) {
        console.error('Error al cambiar estado:', error);
        this.$q.notify({ color: 'negative', message: 'No se pudo cambiar el estado del plan' });
      }
    },
    handleCancelFromModal(plan) {
      this.showRestrictionModal = false;
      this.changeStatus('CANCELLED');
      this.selectedPlan = plan;
      this.detailsStatusSelection = 'CANCELLED';
      this.detailsDialog = true;
    },
    handleDeactivateFromModal(plan) {
      this.showRestrictionModal = false;
      this.selectedPlan = plan;
      this.detailsStatusSelection = 'INACTIVE';
      this.detailsDialog = true;
    },
    handleViewFromModal(plan) {
      this.showRestrictionModal = false;
      this.verPlan(plan);
    },
    async guardarEdicion() {
      if (!this.editForm.name.trim()) {
        this.$q.notify({ color: 'warning', message: 'El nombre del plan es obligatorio' });
        return;
      }
      try {
        const updateData = {
          name: this.editForm.name,
          description: this.editForm.description,
          startDate: this.editForm.startDate,
          endDate: this.editForm.endDate
        };
        const updatedPlan = await this.store.updateProjectById(this.selectedPlan.id, updateData);
        this.selectedPlan = updatedPlan;
        this.editDialog = false;
        this.$q.notify({ color: 'positive', message: 'Plan actualizado correctamente' });
      } catch (error) {
        console.error('Error al actualizar plan:', error);
        const serverMsg = error && error.response && (error.response.data && (error.response.data.message || error.response.data.error))
          ? (error.response.data.message || error.response.data.error)
          : null;
        this.$q.notify({ color: 'negative', message: serverMsg || 'No se pudo actualizar el plan' });
      }
    },
    // rowClass handled in SupplyPlansTable component
  }
};
</script>

<style scoped>
.page-container {
  background: #F8FAFC;
  min-height: 100vh;
}

.header-gradient {
  background: linear-gradient(135deg, #84B24D 0%, #75AF7E 50%, #4E9C4C 100%);
}

.filter-label {
  display: block;
  font-size: 12px;
  font-weight: 700;
  color: #64748B;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

/* Typography */
.text-gray-900 {
  color: #111827;
}

.text-gray-500 {
  color: #6B7280;
}

.text-xs {
  font-size: 0.75rem;
}

.font-mono {
  font-family: 'Roboto Mono', monospace;
}

.tabular-nums {
  font-variant-numeric: tabular-nums;
  letter-spacing: -0.01em;
}

/* Table Style */
.modern-table ::v-deep .q-tr {
  transition: background-color 0.2s ease;
}

.modern-table ::v-deep .q-tr:hover {
  background-color: #F9FAFB !important;
}

.table-header-row {
  border-bottom: 2px solid #E2E8F0 !important;
}

.header-th {
  font-weight: 800 !important;
  color: #475569 !important;
  text-transform: uppercase;
  font-size: 11px !important;
  padding: 16px !important;
}

/* Badges */
.badge-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.badge--pending {
  background-color: #FFF3CD;
  color: #856404;
}

.badge--draft {
  background-color: #E2E3E5;
  color: #383D41;
}

.badge--active {
  background-color: #D4EDDA;
  color: #155724;
}

.badge--inactive {
  background-color: #E8F4F8;
  color: #1D4ED8;
}

.badge--completed {
  background-color: #CCE5FF;
  color: #004085;
}

.badge--cancelled {
  background-color: #F8D7DA;
  color: #721C24;
}

.badge--default {
  background-color: #F3F4F6;
  color: #374151;
}

/* Acciones */
.action-group {
  opacity: 0;
}

::v-deep .q-tr:hover .action-group {
  opacity: 1;
}

.fade-in-row {
  opacity: 0;
  transform: translateY(8px);
  animation: fadeInItem 260ms ease-out forwards;
  animation-delay: var(--delay, 0ms);
}

@keyframes fadeInItem {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hover-red:hover {
  background: #FEF2F2 !important;
  color: #B91C1C !important;
}

/* Layout */
.no-horizontal-scroll {
  overflow-x: hidden !important;
}

.modern-table ::v-deep th,
.modern-table ::v-deep td {
  min-width: fit-content;
}

/* ═══════════════════════════════════════════════════════
   MODAL DE DETALLE — pd-* (Plan Detail)
   Jerarquía: 3 niveles tipográficos, contraste AA 4.5:1
   ═══════════════════════════════════════════════════════ */

/* Backdrop oscuro del dialog para aislar del fondo verde */
::v-deep .q-dialog__inner>.q-card.pd-modal {
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.3);
}

.pd-modal {
  max-width: 560px;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background: #FFFFFF;
}

/* Overlay sutil para aislar del fondo verde de la tabla */
.pd-modal-overlay {
  display: none;
}

/* ── HEADER: nombre + año + estado ── */
.pd-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px 12px;
}

.pd-header-left {
  flex: 1;
  min-width: 0;
  padding-right: 12px;
}

.pd-header-title {
  font-size: 18px;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
  margin-bottom: 6px;
}

.pd-header-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.pd-meta-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #6B7280;
}

.pd-meta-icon {
  color: #9CA3AF;
}

.pd-close-btn {
  color: #6B7280;
  margin-top: -2px;
}

/* ── SEPARADORES ── */
.pd-separator {
  margin: 0;
}

/* ── SECCIÓN FINANCIERA ── */
.pd-finance {
  padding: 16px 24px;
}

.pd-section-label {
  font-size: 11px;
  font-weight: 700;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
}

.pd-finance-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.pd-finance-item {
  min-width: 0;
}

.pd-field-label {
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
}

.pd-field-value {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}

.pd-field-value--accent {
  color: #059669;
}

/* Barra de progreso */
.pd-progress-section {
  margin-top: 16px;
}

.pd-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.pd-progress-label {
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
}

.pd-progress-pct {
  font-size: 13px;
  font-weight: 700;
  color: #111827;
  font-variant-numeric: tabular-nums;
}

.pd-progress-track {
  width: 100%;
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
}

.pd-progress-fill {
  height: 100%;
  background: #059669;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.pd-progress-caption {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 4px;
}

/* ── DESCRIPCIÓN ── */
.pd-desc {
  padding: 16px 24px;
}

.pd-desc-text {
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 14px 16px;
  white-space: pre-wrap;
}

.pd-desc-empty {
  text-align: center;
  padding: 20px 16px;
  background: #F9FAFB;
  border: 1px dashed #D1D5DB;
  border-radius: 10px;
}

.pd-desc-empty-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #FEF3C7;
  color: #D97706;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10px;
}

.pd-desc-empty-title {
  font-size: 14px;
  font-weight: 600;
  color: #92400E;
  margin-bottom: 6px;
}

.pd-desc-empty-hint {
  font-size: 13px;
  color: #9CA3AF;
  line-height: 1.5;
  max-width: 320px;
  margin: 0 auto;
}

.pd-desc-empty-hint strong {
  color: #6B7280;
  font-weight: 600;
}

/* ── SECCIÓN DE ACCIÓN: fondo diferenciado ── */
.pd-action-zone {
  padding: 16px 24px;
  background: #F9FAFB;
}

.pd-action-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.pd-action-text {
  flex: 1;
  min-width: 0;
}

.pd-action-title {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 2px;
}

.pd-action-hint {
  font-size: 12px;
  color: #6B7280;
}

.pd-action-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pd-status-select {
  min-width: 160px;
}

.pd-btn-change {
  min-width: 80px;
}

.pd-no-transitions {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 8px;
  font-style: italic;
}

/* ── FOOTER ── */
.pd-footer {
  padding: 8px 16px;
  border-top: 1px solid #E5E7EB;
}

.pd-btn-close {
  font-size: 13px;
}

/* ── BADGES SEMÁNTICOS (reutilizables) ── */
.pd-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1;
}

.page-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(15, 23, 42, 0.55);
  backdrop-filter: blur(4px);
}

.loading-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 28px 32px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 20px 45px rgba(15, 23, 42, 0.18);
}

.orbit-gradient {
  animation: orbit-rotate 1.8s linear infinite;
}

.orbit-gradient .orbit-ring {
  transform-origin: center;
}

.orbit-gradient .orbit-dot {
  animation: orbit-bounce 1.8s ease-in-out infinite;
  transform-origin: 25px 25px;
}

@keyframes orbit-rotate {
  to { transform: rotate(360deg); }
}

@keyframes orbit-bounce {
  0%, 100% { transform: rotate(0deg) translateY(0); }
  50% { transform: rotate(180deg) translateY(-2px); }
}

.loading-text {
  font-size: 1rem;
  font-weight: 600;
  color: #111827;
  text-align: center;
  max-width: 320px;
  line-height: 1.5;
}

.edit-dialog-card {
  min-width: 500px;
  max-width: 600px;
}

.edit-form {
  padding: 24px;
}

.form-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  color: #64748B;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Stagger delays for table rows (adjust count/increment as needed) */
.modern-table ::v-deep tbody tr:nth-child(1) {
  --delay: 0ms;
}

.modern-table ::v-deep tbody tr:nth-child(2) {
  --delay: 60ms;
}

.modern-table ::v-deep tbody tr:nth-child(3) {
  --delay: 120ms;
}

.modern-table ::v-deep tbody tr:nth-child(4) {
  --delay: 180ms;
}

.modern-table ::v-deep tbody tr:nth-child(5) {
  --delay: 240ms;
}

.modern-table ::v-deep tbody tr:nth-child(6) {
  --delay: 300ms;
}

.modern-table ::v-deep tbody tr:nth-child(7) {
  --delay: 360ms;
}

.modern-table ::v-deep tbody tr:nth-child(8) {
  --delay: 420ms;
}

.modern-table ::v-deep tbody tr:nth-child(9) {
  --delay: 480ms;
}

.modern-table ::v-deep tbody tr:nth-child(10) {
  --delay: 540ms;
}

.modern-table ::v-deep tbody tr:nth-child(11) {
  --delay: 600ms;
}

.modern-table ::v-deep tbody tr:nth-child(12) {
  --delay: 660ms;
}
</style>
