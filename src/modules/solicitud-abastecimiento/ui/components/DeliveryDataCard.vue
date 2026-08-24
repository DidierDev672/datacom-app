<template>
  <div class="delivery-card" role="region" aria-label="Datos de la entrega">
    <!-- Header -->
    <div class="delivery-card__header">
      <svg class="delivery-card__icon" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 3H1V16H16V3Z" stroke="#6366F1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 8H20L23 11V16H16V8Z" stroke="#6366F1" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="5.5" cy="18.5" r="2.5" stroke="#6366F1" stroke-width="1.5"/>
        <circle cx="18.5" cy="18.5" r="2.5" stroke="#6366F1" stroke-width="1.5"/>
      </svg>
      <span class="delivery-card__title">Datos de la entrega</span>
    </div>

    <!-- Body -->
    <div class="delivery-card__body">
      <!-- Group 1: Location -->
      <div class="field-grid">
        <div class="field-group">
          <dt class="field-label">Departamento</dt>
          <dd class="field-value">{{ delivery.department || '—' }}</dd>
        </div>
        <div class="field-group">
          <dt class="field-label">Municipio</dt>
          <dd class="field-value">{{ delivery.municipality || '—' }}</dd>
        </div>
      </div>

      <div class="field-divider"></div>

      <!-- Group 2: Address -->
      <div class="field-grid">
        <div class="field-group field-full">
          <dt class="field-label">Dirección</dt>
          <dd class="field-value">{{ delivery.address || '—' }}</dd>
        </div>
      </div>

      <div class="field-divider"></div>

      <!-- Group 3: Contact & logistics -->
      <div class="field-grid">
        <div class="field-group">
          <dt class="field-label">Contacto</dt>
          <dd class="field-value">{{ delivery.contact || '—' }}</dd>
        </div>
        <div class="field-group">
          <dt class="field-label">Teléfono</dt>
          <dd class="field-value field-value--mono" :aria-label="`Teléfono: ${delivery.phone | formatPhone}`">
            {{ delivery.phone | formatPhone }}
          </dd>
        </div>
      </div>

      <div class="field-grid q-mt-sm">
        <div class="field-group">
          <dt class="field-label">Fecha de entrega</dt>
          <dd>
            <div class="date-chip" :aria-label="`Fecha de entrega: ${delivery.deliveryDate | formatDate}`">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="1.5"/>
                <path d="M16 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M8 2V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                <path d="M3 10H21" stroke="currentColor" stroke-width="1.5"/>
              </svg>
              <span>{{ delivery.deliveryDate | formatDate }}</span>
            </div>
          </dd>
        </div>
        <div class="field-group">
          <dt class="field-label">Requiere flete</dt>
          <dd>
            <span v-if="delivery.requiresFreight" class="freight-badge freight-badge--yes">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              Requiere flete
            </span>
            <span v-else class="freight-badge freight-badge--no">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              No requiere flete
            </span>
          </dd>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DeliveryDataCard',
  props: {
    delivery: {
      type: Object,
      required: true
    }
  },
  filters: {
    formatDate(value) {
      if (!value) return '—'
      const date = new Date(value)
      return date.toLocaleDateString('es-CO', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    },
    formatPhone(value) {
      if (!value) return '—'
      const digits = value.replace(/\D/g, '')
      if (digits.length === 10) {
        return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
      }
      return value
    }
  }
}
</script>

<style scoped>
.delivery-card {
  border: 0.5px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
  background: #FFFFFF;
}

.delivery-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: #F9FAFB;
  border-bottom: 0.5px solid #E5E7EB;
}

.delivery-card__icon {
  flex-shrink: 0;
}

.delivery-card__title {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.delivery-card__body {
  padding: 16px;
}

.field-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
  margin-bottom: 0;
}

.field-full {
  grid-column: 1 / -1;
}

.field-group {
  display: flex;
  flex-direction: column;
}

.field-divider {
  height: 0.5px;
  background-color: #E5E7EB;
  margin: 12px 0;
}

.field-label {
  font-size: 11px;
  font-weight: 400;
  color: #9CA3AF;
  text-transform: none;
  margin-bottom: 3px;
  line-height: 1.4;
}

.field-value {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
  line-height: 1.4;
  margin: 0;
}

.field-value--mono {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  letter-spacing: 0.02em;
}

.date-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #EFF6FF;
  border: 0.5px solid #BFDBFE;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 13px;
  font-weight: 500;
  color: #1D4ED8;
  margin-top: 4px;
}

.freight-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 500;
  border-radius: 20px;
  padding: 3px 10px;
  margin-top: 4px;
}

.freight-badge--no {
  background: #F3F4F6;
  border: 0.5px solid #E5E7EB;
  color: #6B7280;
}

.freight-badge--yes {
  background: #DCFCE7;
  border: 0.5px solid #86EFAC;
  color: #15803D;
}
</style>
