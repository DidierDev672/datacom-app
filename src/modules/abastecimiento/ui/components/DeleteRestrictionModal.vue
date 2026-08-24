<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" persistent>
    <q-card class="restriction-modal">
      <!-- Header con icono de shield -->
      <q-card-section class="restriction-header">
        <div class="restriction-icon-wrapper">
          <q-icon name="shield" size="32px" color="white" />
        </div>
        <div class="restriction-header-text">
          <div class="restriction-title">Este plan está protegido</div>
          <div class="restriction-subtitle">No podemos eliminarlo en este momento</div>
        </div>
      </q-card-section>

      <!-- Explicación empática -->
      <q-card-section class="restriction-body">
        <div class="empathy-block">
          <q-icon name="info_outline" size="18px" color="blue-7" class="empathy-icon" />
          <p class="empathy-text">
            Entendemos que quieres limpiar tu lista de planes. Sin embargo, el plan
            <strong>"{{ planName }}"</strong> está en estado
            <span :class="['status-chip', statusChipClass]">{{ statusLabel }}</span>
            y tiene recursos activos que debemos preservar.
          </p>
        </div>

        <!-- Razones -->
        <div class="reasons-section">
          <div class="reasons-title">¿Por qué está protegido?</div>
          <div class="reason-list">
            <div v-if="hasLinkedOrders" class="reason-item reason-item--warning">
              <q-icon name="link" size="18px" />
              <div>
                <div class="reason-label">Órdenes de compra vinculadas</div>
                <div class="reason-detail">Existen órdenes activas que dependen de este plan</div>
              </div>
            </div>
            <div v-if="hasBudgetAllocation" class="reason-item reason-item--warning">
              <q-icon name="account_balance_wallet" size="18px" />
              <div>
                <div class="reason-label">Presupuesto asignado</div>
                <div class="reason-detail">Se han reservado fondos para los proyectos de este plan</div>
              </div>
            </div>
            <div v-if="isInActiveState" class="reason-item reason-item--info">
              <q-icon name="play_circle" size="18px" />
              <div>
                <div class="reason-label">Plan en ejecución</div>
                <div class="reason-detail">El plan está activo y siendo utilizado por el equipo</div>
              </div>
            </div>
            <div v-if="isInReviewState" class="reason-item reason-item--info">
              <q-icon name="pending" size="18px" />
              <div>
                <div class="reason-label">En proceso de revisión</div>
                <div class="reason-detail">El plan está pendiente de aprobación o autorización</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Alternativas -->
        <div class="alternatives-section">
          <div class="alternatives-title">¿Qué puedes hacer?</div>
          <div class="alternative-list">
            <div v-if="canCancel" class="alternative-item" @click="$emit('cancel', plan)">
              <q-icon name="cancel" size="20px" color="negative" />
              <div>
                <div class="alt-label">Cancelar el plan</div>
                <div class="alt-desc">Lo marcará como cancelado y podrás eliminarlo después</div>
              </div>
              <q-icon name="chevron_right" size="18px" color="grey-5" />
            </div>
            <div v-if="canDeactivate" class="alternative-item" @click="$emit('deactivate', plan)">
              <q-icon name="pause_circle" size="20px" color="warning" />
              <div>
                <div class="alt-label">Desactivar temporalmente</div>
                <div class="alt-desc">Pausa el plan sin eliminarlo, conservando toda la información</div>
              </div>
              <q-icon name="chevron_right" size="18px" color="grey-5" />
            </div>
            <div class="alternative-item" @click="$emit('view', plan)">
              <q-icon name="visibility" size="20px" color="primary" />
              <div>
                <div class="alt-label">Revisar detalles</div>
                <div class="alt-desc">Ver qué elementos tiene vinculados antes de decidir</div>
              </div>
              <q-icon name="chevron_right" size="18px" color="grey-5" />
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- Footer -->
      <q-card-actions align="right" class="restriction-footer">
        <q-btn flat label="Entendido" color="grey-7" @click="$emit('update:modelValue', false)" no-caps class="btn-understand" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
const STATUS_LABELS = {
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

const DELETABLE_STATUSES = ['DRAFT', 'CANCELLED', 'PENDING'];

export default {
  name: 'DeleteRestrictionModal',
  props: {
    modelValue: { type: Boolean, default: false },
    plan: { type: Object, default: null },
    error: { type: Object, default: null }
  },
  emits: ['update:modelValue', 'cancel', 'deactivate', 'view'],
  computed: {
    planName() {
      return (this.plan && this.plan.name) || 'sin nombre';
    },
    currentStatus() {
      return String((this.plan && this.plan.status) || '').toUpperCase();
    },
    statusLabel() {
      return STATUS_LABELS[this.currentStatus] || this.currentStatus;
    },
    statusChipClass() {
      const map = {
        DRAFT: 'chip--draft',
        ACTIVE: 'chip--active',
        PENDING: 'chip--pending',
        PENDING_AUTHORIZATION: 'chip--pending',
        PENDING_SUPPLY: 'chip--pending',
        INACTIVE: 'chip--inactive',
        COMPLETED: 'chip--completed',
        CANCELLED: 'chip--cancelled',
        REJECTED: 'chip--rejected'
      };
      return map[this.currentStatus] || 'chip--default';
    },
    isInActiveState() {
      return this.currentStatus === 'ACTIVE';
    },
    isInReviewState() {
      return ['PENDING', 'PENDING_AUTHORIZATION', 'PENDING_SUPPLY'].includes(this.currentStatus);
    },
    hasLinkedOrders() {
      return this.currentStatus === 'ACTIVE' || this.currentStatus === 'PENDING_AUTHORIZATION';
    },
    hasBudgetAllocation() {
      const total = Number((this.plan && this.plan.totalBudget) || 0) ;
      const available = Number((this.plan && this.plan.availableBudget) || 0);
      return total > 0 && available < total;
    },
    canCancel() {
      return ['ACTIVE', 'PENDING', 'PENDING_AUTHORIZATION'].includes(this.currentStatus);
    },
    canDeactivate() {
      return this.currentStatus === 'ACTIVE';
    }
  }
};
</script>

<style scoped>
.restriction-modal {
  max-width: 520px;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  background: #FFFFFF;
}

/* Header */
.restriction-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 24px 16px;
  background: linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%);
}

.restriction-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #84B24D 0%, #4E9C4C 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.restriction-title {
  font-size: 17px;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
}

.restriction-subtitle {
  font-size: 13px;
  color: #6B7280;
  margin-top: 2px;
}

/* Body */
.restriction-body {
  padding: 16px 24px 20px;
}

/* Empatía */
.empathy-block {
  display: flex;
  gap: 10px;
  padding: 12px 14px;
  background: #EFF6FF;
  border-radius: 10px;
  margin-bottom: 20px;
}

.empathy-icon {
  margin-top: 2px;
  flex-shrink: 0;
}

.empathy-text {
  font-size: 13.5px;
  color: #374151;
  line-height: 1.55;
  margin: 0;
}

.empathy-text strong {
  color: #111827;
}

/* Status chip */
.status-chip {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
  vertical-align: middle;
}

.chip--draft { background: #E5E7EB; color: #374151; }
.chip--active { background: #D1FAE5; color: #065F46; }
.chip--pending { background: #FEF3C7; color: #92400E; }
.chip--inactive { background: #DBEAFE; color: #1E40AF; }
.chip--completed { background: #DBEAFE; color: #1E40AF; }
.chip--cancelled { background: #FEE2E2; color: #991B1B; }
.chip--rejected { background: #FEE2E2; color: #991B1B; }
.chip--default { background: #F3F4F6; color: #374151; }

/* Razones */
.reasons-section {
  margin-bottom: 20px;
}

.reasons-title,
.alternatives-title {
  font-size: 12px;
  font-weight: 700;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 10px;
}

.reason-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reason-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border-left: 3px solid transparent;
}

.reason-item--warning {
  background: #FFFBEB;
  border-left-color: #F59E0B;
  color: #92400E;
}

.reason-item--info {
  background: #EFF6FF;
  border-left-color: #3B82F6;
  color: #1E40AF;
}

.reason-label {
  font-size: 13px;
  font-weight: 600;
  line-height: 1.3;
}

.reason-detail {
  font-size: 12px;
  opacity: 0.8;
  margin-top: 1px;
}

/* Alternativas */
.alternative-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.alternative-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease;
  border: 1px solid #E5E7EB;
}

.alternative-item:hover {
  background: #F9FAFB;
  border-color: #D1D5DB;
}

.alt-label {
  font-size: 13px;
  font-weight: 600;
  color: #111827;
}

.alt-desc {
  font-size: 12px;
  color: #6B7280;
  margin-top: 1px;
}

/* Footer */
.restriction-footer {
  padding: 8px 16px;
  border-top: 1px solid #F3F4F6;
}

.btn-understand {
  font-weight: 600;
}
</style>
