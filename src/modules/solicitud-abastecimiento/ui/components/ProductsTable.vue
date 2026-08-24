<template>
  <div class="table-wrap">
    <!-- Header bar -->
    <div class="table-header">
      <div class="table-header__left">
        <svg class="table-header__icon" width="15" height="15" viewBox="0 0 24 24" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 7H4C3.44772 7 3 7.44772 3 8V19C3 19.5523 3.44772 20 4 20H20C20.5523 20 21 19.5523 21 19V8C21 7.44772 20.5523 7 20 7Z"
            stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M16 7V5C16 4.44772 15.5523 4 15 4H9C8.44772 4 8 4.44772 8 5V7" stroke="#6B7280" stroke-width="1.5"
            stroke-linecap="round" stroke-linejoin="round" />
          <path d="M12 11V16" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M9.5 13.5L12 11L14.5 13.5" stroke="#6B7280" stroke-width="1.5" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        <span class="table-header__title">{{ title }}</span>
        <span class="table-header__badge">{{ items.length }} items</span>
      </div>
      <div class="table-header__right">
        <span class="table-header__total-label">Total:</span>
        <span class="table-header__total-value">{{ currency }}{{ total.toLocaleString('es-CO') }}</span>
      </div>
    </div>

    <!-- Empty state -->
    <div v-if="items.length === 0" class="empty-state">
      Sin productos registrados
    </div>

    <!-- Table -->
    <table v-else class="products-table">
      <caption class="sr-only">{{ title }}</caption>
      <thead>
        <tr>
          <th scope="col" aria-label="Número de fila" class="col-index">#</th>
          <th scope="col" class="col-name">PRODUCTO / SERVICIO</th>
          <th scope="col" class="col-qty">CANT.</th>
          <th scope="col" class="col-unit">UNIDAD</th>
          <th scope="col" class="col-price">V. UNITARIO</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in items" :key="item.id || index">
          <td class="col-index">{{ String(index + 1).padStart(2, '0') }}</td>
          <td class="col-name" :title="item.name">{{ item.name }}</td>
          <td class="col-qty">{{ item.quantity }}</td>
          <td class="col-unit">
            <span class="unit-pill">{{ item.unit }}</span>
          </td>
          <td class="col-price">{{ currency }}{{ Number(item.unitPrice).toLocaleString('es-CO') }}</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colspan="4" class="footer-label">Total acumulado</td>
          <td class="footer-value">{{ currency }}{{ total.toLocaleString('es-CO') }}</td>
        </tr>
      </tfoot>
    </table>
  </div>
</template>

<script>
export default {
  name: 'ProductsTable',
  props: {
    items: {
      type: Array,
      required: true
    },
    title: {
      type: String,
      default: 'Productos / Servicios'
    },
    currency: {
      type: String,
      default: '$'
    }
  },
  computed: {
    total() {
      return this.items.reduce((sum, item) => {
        return sum + (item.quantity * item.unitPrice)
      }, 0)
    }
  }
}
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

.table-wrap {
  border-radius: 12px;
  border: 0.5px solid #E5E7EB;
  overflow: hidden;
}

/* Header bar */
.table-header {
  padding: 12px 16px;
  background: #F9FAFB;
  border-bottom: 0.5px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.table-header__left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.table-header__icon {
  flex-shrink: 0;
}

.table-header__title {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.table-header__badge {
  background: #EFF6FF;
  color: #1D4ED8;
  border-radius: 20px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 600;
}

.table-header__right {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 6px;
  white-space: nowrap;
}

.table-header__total-label {
  font-size: 12px;
  color: #6B7280;
}

.table-header__total-value {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  font-variant-numeric: tabular-nums;
}

/* Table */
.products-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.products-table th,
.products-table td {
  padding: 11px 16px;
}

.products-table thead tr {
  background: #F9FAFB;
  border-bottom: 0.5px solid #E5E7EB;
}

.products-table thead th {
  font-size: 11px;
  font-weight: 500;
  color: #9CA3AF;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  text-align: left;
}

.products-table tbody tr {
  border-bottom: 0.5px solid #F3F4F6;
  transition: background-color 0.15s ease;
}

.products-table tbody tr:last-child {
  border-bottom: none;
}

@media (hover: hover) {
  .products-table tbody tr:hover {
    background-color: #F9FAFB;
  }
}

/* Column styles */
.col-index {
  width: 32px;
  text-align: right;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
  font-size: 11px;
  color: #9CA3AF;
}

.col-name {
  text-align: left;
  font-size: 13px;
  color: #111827;
  max-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.col-qty {
  width: 60px;
  text-align: center;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
  font-size: 13px;
  color: #6B7280;
}

.col-unit {
  width: 80px;
  text-align: center;
}

.col-price {
  width: 120px;
  text-align: right;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  font-variant-numeric: tabular-nums;
}

.unit-pill {
  display: inline-block;
  font-size: 11px;
  font-weight: 500;
  background: #F3F4F6;
  border: 0.5px solid #E5E7EB;
  border-radius: 4px;
  padding: 1px 7px;
  color: #6B7280;
}

/* Footer */
.products-table tfoot tr {
  background: #F9FAFB;
  border-top: 0.5px solid #E5E7EB;
}

.products-table tfoot td {
  padding: 10px 16px;
}

.footer-label {
  text-align: right;
  font-size: 12px;
  color: #6B7280;
  padding-right: 12px;
}

.footer-value {
  text-align: right;
  font-family: 'SF Mono', 'Fira Code', 'Fira Mono', 'Roboto Mono', monospace;
  font-size: 15px;
  font-weight: 500;
  color: #374151;
  font-variant-numeric: tabular-nums;
}

/* Empty state */
.empty-state {
  padding: 2rem;
  text-align: center;
  font-size: 13px;
  color: #9CA3AF;
}
</style>
