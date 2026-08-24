<template>
  <q-dialog
    :value="value"
    transition-show="scale"
    transition-hide="scale"
    @input="$emit('input', $event)"
  >
    <q-card class="bcd-modal">
      <!-- HEADER: icono semántico + nombre + estado -->
      <q-card-section class="bcd-header">
        <div class="bcd-header-left">
          <div class="bcd-header-icon">
            <q-icon name="savings" size="22px" />
          </div>
          <div>
            <div class="bcd-header-title">{{ category ? category.name : '—' }}</div>
            <div class="bcd-header-meta">
              <span class="bcd-meta-text">{{ category ? category.planName : '—' }}</span>
              <span v-if="category" class="bcd-dot" />
              <span v-if="category" :class="['bcd-badge', category.active ? 'bcd-badge--active' : 'bcd-badge--inactive']">
                {{ category.active ? 'Activo' : 'Inactivo' }}
              </span>
            </div>
          </div>
        </div>
        <q-btn v-close-popup flat round dense icon="close" size="sm" class="bcd-close-x" aria-label="Cerrar" />
      </q-card-section>

      <q-separator class="bcd-separator" />

      <!-- SECCIÓN PRESUPUESTO: valor + utilizado + barra de progreso -->
      <q-card-section v-if="category" class="bcd-finance">
        <div class="bcd-section-label">Ejecución presupuestal</div>
        <div class="bcd-finance-grid">
          <div class="bcd-finance-item">
            <div class="bcd-field-label">Valor del presupuesto</div>
            <div class="bcd-field-value bcd-field-value--green">{{ formatCurrency(category.totalBudget) }}</div>
          </div>
          <div class="bcd-finance-item">
            <div class="bcd-field-label">Presupuesto utilizado</div>
            <div class="bcd-field-value">{{ formatCurrency(category.usedBudget) }}</div>
          </div>
        </div>
        <!-- Barra de ejecución -->
        <div class="bcd-progress-section">
          <div class="bcd-progress-header">
            <span class="bcd-progress-label">Ejecución</span>
            <span :class="['bcd-progress-pct', executionColorClass]">{{ executionPercent }}%</span>
          </div>
          <div class="bcd-progress-track">
            <div
              :class="['bcd-progress-fill', executionColorClass]"
              :style="{ width: executionPercent + '%' }"
            />
          </div>
          <div class="bcd-progress-caption">
            Restante: {{ formatCurrency(category.totalBudget - category.usedBudget) }}
          </div>
        </div>
      </q-card-section>

      <q-separator class="bcd-separator" />

      <!-- PERÍODO: fechas + duración + estado temporal -->
      <q-card-section v-if="category" class="bcd-period">
        <div class="bcd-section-label">Período de ejecución</div>
        <div class="bcd-period-row">
          <span class="bcd-period-date">{{ formatDate(category.startDate) }}</span>
          <q-icon name="arrow_forward" size="16px" class="bcd-period-arrow" />
          <span class="bcd-period-date">{{ formatDate(category.endDate) }}</span>
          <span class="bcd-period-sep">·</span>
          <span class="bcd-period-duration">{{ periodDuration }}</span>
        </div>
        <div v-if="temporalStatus" :class="['bcd-temporal-tag', temporalStatus.class]">
          <q-icon :name="temporalStatus.icon" size="14px" />
          {{ temporalStatus.label }}
        </div>
      </q-card-section>

      <q-separator class="bcd-separator" />

      <!-- DESCRIPCIÓN: jerarquía elevada -->
      <q-card-section v-if="category" class="bcd-desc-section">
        <div class="bcd-section-label">Descripción</div>
        <div class="bcd-desc-box">
          {{ category.description || 'Sin descripción disponible para esta categoría.' }}
        </div>
      </q-card-section>

      <!-- FOOTER: botón cerrar con peso visual -->
      <q-card-actions align="right" class="bcd-footer">
        <q-btn v-close-popup label="Cerrar" color="grey-3" text-color="grey-8" unelevated no-caps class="bcd-btn-close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: "BudgetCategoryDetailDialog",

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Object,
      default: null,
    },
  },

  computed: {
    executionPercent() {
      if (!this.category) return 0;
      const total = Number(this.category.totalBudget) || 0;
      const used = Number(this.category.usedBudget) || 0;
      if (total === 0) return 0;
      return Math.min(100, Math.round((used / total) * 100));
    },
    executionColorClass() {
      const pct = this.executionPercent;
      if (pct >= 85) return 'bcd-exec--red';
      if (pct >= 50) return 'bcd-exec--yellow';
      return 'bcd-exec--green';
    },
    periodDuration() {
      if (!this.category) return '';
      const start = this._parseDate(this.category.startDate);
      const end = this._parseDate(this.category.endDate);
      if (!start || !end) return '';
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      if (months <= 0) return 'Menos de 1 mes';
      return months === 1 ? '1 mes' : `${months} meses`;
    },
    temporalStatus() {
      if (!this.category) return null;
      const now = new Date();
      const start = this._parseDate(this.category.startDate);
      const end = this._parseDate(this.category.endDate);
      if (!start || !end) return null;

      if (now < start) {
        const days = Math.ceil((start - now) / (1000 * 60 * 60 * 24));
        return { label: `Inicia en ${days} día${days !== 1 ? 's' : ''}`, icon: 'schedule', class: 'bcd-temporal--upcoming' };
      }
      if (now > end) {
        return { label: 'Período vencido', icon: 'event_busy', class: 'bcd-temporal--expired' };
      }
      const daysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
      if (daysLeft <= 30) {
        return { label: `Vence en ${daysLeft} día${daysLeft !== 1 ? 's' : ''}`, icon: 'warning', class: 'bcd-temporal--soon' };
      }
      return { label: 'Vigente', icon: 'check_circle', class: 'bcd-temporal--active' };
    },
  },

  methods: {
    formatCurrency(value) {
      if (value === null || value === undefined || value === '') return '—';
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
      }).format(Number(value));
    },
    formatDate(value) {
      const d = this._parseDate(value);
      if (!d) return value || '—';
      return d.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
    },
    _parseDate(value) {
      if (!value) return null;
      const normalized = String(value).replace(/\//g, '-');
      const date = new Date(normalized);
      return Number.isNaN(date.getTime()) ? null : date;
    },
  },
};
</script>

<style scoped>
/* ═══════════════════════════════════════════════════════
   MODAL DE CATEGORÍA — bcd-* (Budget Category Detail)
   Jerarquía: 3 niveles tipográficos, contraste AA 4.5:1
   ═══════════════════════════════════════════════════════ */

.bcd-modal {
  max-width: 520px;
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
}

/* ── HEADER ── */
.bcd-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 20px 24px 12px;
}

.bcd-header-left {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
  min-width: 0;
  padding-right: 12px;
}

.bcd-header-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: #ECFDF5;
  color: #059669;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.bcd-header-title {
  font-size: 17px;
  font-weight: 700;
  color: #111827;
  line-height: 1.3;
  margin-bottom: 4px;
}

.bcd-header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.bcd-meta-text {
  font-size: 12px;
  color: #6B7280;
}

.bcd-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #D1D5DB;
}

.bcd-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: 5px;
  font-size: 11px;
  font-weight: 600;
}

.bcd-badge--active {
  background: #D1FAE5;
  color: #065F46;
}

.bcd-badge--inactive {
  background: #DBEAFE;
  color: #1E40AF;
}

.bcd-close-x {
  color: #6B7280;
  margin-top: 2px;
}

/* ── SEPARADORES ── */
.bcd-separator {
  margin: 0;
}

/* ── LABELS DE SECCIÓN ── */
.bcd-section-label {
  font-size: 11px;
  font-weight: 700;
  color: #6B7280;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 12px;
}

/* ── SECCIÓN FINANCIERA ── */
.bcd-finance {
  padding: 16px 24px;
}

.bcd-finance-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.bcd-finance-item {
  min-width: 0;
}

.bcd-field-label {
  font-size: 11px;
  font-weight: 600;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  margin-bottom: 2px;
}

.bcd-field-value {
  font-size: 16px;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
}

.bcd-field-value--green {
  color: #059669;
}

/* Barra de ejecución */
.bcd-progress-section {
  margin-top: 4px;
}

.bcd-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 6px;
}

.bcd-progress-label {
  font-size: 12px;
  font-weight: 600;
  color: #6B7280;
}

.bcd-progress-pct {
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}

.bcd-progress-track {
  width: 100%;
  height: 8px;
  background: #E5E7EB;
  border-radius: 4px;
  overflow: hidden;
}

.bcd-progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.bcd-progress-caption {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 4px;
}

/* Colores semánticos de ejecución */
.bcd-exec--green .bcd-progress-pct { color: #059669; }
.bcd-exec--green.bcd-progress-fill { background: #059669; }
.bcd-exec--green.bcd-temporal-tag { background: #D1FAE5; color: #065F46; }

.bcd-exec--yellow .bcd-progress-pct { color: #D97706; }
.bcd-exec--yellow.bcd-progress-fill { background: #F59E0B; }

.bcd-exec--red .bcd-progress-pct { color: #DC2626; }
.bcd-exec--red.bcd-progress-fill { background: #DC2626; }

/* ── SECCIÓN PERÍODO ── */
.bcd-period {
  padding: 16px 24px;
}

.bcd-period-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.bcd-period-date {
  font-size: 14px;
  font-weight: 600;
  color: #111827;
}

.bcd-period-arrow {
  color: #9CA3AF;
}

.bcd-period-sep {
  color: #D1D5DB;
  font-weight: 700;
}

.bcd-period-duration {
  font-size: 13px;
  font-weight: 600;
  color: #6B7280;
}

.bcd-temporal-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.bcd-temporal--active { background: #D1FAE5; color: #065F46; }
.bcd-temporal--upcoming { background: #DBEAFE; color: #1E40AF; }
.bcd-temporal--soon { background: #FEF3C7; color: #92400E; }
.bcd-temporal--expired { background: #FEE2E2; color: #991B1B; }

/* ── DESCRIPCIÓN ── */
.bcd-desc-section {
  padding: 16px 24px;
}

.bcd-desc-box {
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 14px 16px;
}

/* ── FOOTER ── */
.bcd-footer {
  padding: 8px 16px 16px;
}

.bcd-btn-close {
  min-width: 100px;
  border: 1px solid #E5E7EB;
}
</style>
