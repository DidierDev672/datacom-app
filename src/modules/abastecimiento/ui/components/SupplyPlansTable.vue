<template>
  <q-card-section class="q-pa-none">
    <q-table flat :data="plans" :columns="columns" row-key="id" :row-class="rowClass" :loading="loading"
      class="modern-table sticky-header-table no-horizontal-scroll" :pagination="pagination">
      <template v-slot:header="props">
        <q-tr :props="props" class="table-header-row border-b-2">
          <q-th v-for="col in props.cols" :key="col.name" :props="props" class="header-th">
            {{ col.label }}
          </q-th>
        </q-tr>
      </template>

      <template v-slot:body-cell-name="props">
        <q-td :props="props">
          <div class="text-weight-bold text-gray-900">{{ props.row.name }}</div>
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props" class="text-center">
          <div :class="['badge-pill', getBadgeClass(props.row.status)]">
            {{ props.row.statusDescription || props.row.status }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-totalBudget="props">
        <q-td :props="props" class="text-right tabular-nums font-mono">
          {{ formatCurrency(props.row.totalBudget) }}
        </q-td>
      </template>

      <template v-slot:body-cell-availableBudget="props">
        <q-td :props="props" class="text-right tabular-nums font-mono font-bold">
          {{ formatCurrency(props.row.availableBudget) }}
        </q-td>
      </template>

      <template v-slot:body-cell-actions="props">
        <q-td :props="props" class="text-center action-cell">
          <div class="row items-center justify-center no-wrap q-gutter-x-sm action-group">
            <q-btn flat round dense color="primary" icon="visibility" title="Ver" @click="$emit('view', props.row)" />
            <q-btn flat round dense color="blue-7" icon="edit" title="Editar" @click="$emit('edit', props.row)" />
            <q-btn flat round dense color="red-7" icon="delete" class="hover-red" title="Eliminar"
              @click="$emit('delete', props.row)" />
          </div>
        </q-td>
      </template>
    </q-table>
  </q-card-section>
</template>

<script>
export default {
  name: 'SupplyPlansTable',
  props: {
    plans: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    pagination: { type: Object, default: () => ({ rowsPerPage: 15 }) },
    loading: { type: Boolean, default: false }
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
    rowClass(row, rowIndex) {
      return `fade-in-row delay-${rowIndex + 1}`;
    }
  }
};
</script>

<style scoped>
.fade-in-row {
  opacity: 0;
  transform: translateY(8px);
  animation: fadeInItem 260ms ease-out forwards;
}

.delay-1 {
  animation-delay: 0ms;
}

.delay-2 {
  animation-delay: 60ms;
}

.delay-3 {
  animation-delay: 120ms;
}

.delay-4 {
  animation-delay: 180ms;
}

.delay-5 {
  animation-delay: 240ms;
}

.delay-6 {
  animation-delay: 300ms;
}

.delay-7 {
  animation-delay: 360ms;
}

.delay-8 {
  animation-delay: 420ms;
}

.delay-9 {
  animation-delay: 480ms;
}

.delay-10 {
  animation-delay: 540ms;
}

.delay-11 {
  animation-delay: 600ms;
}

.delay-12 {
  animation-delay: 660ms;
}

.delay-13 {
  animation-delay: 720ms;
}

.delay-14 {
  animation-delay: 780ms;
}

.delay-15 {
  animation-delay: 840ms;
}

@keyframes fadeInItem {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ensure table rows fade in on initial render with a staggered delay */
.modern-table ::v-deep tbody tr {
  opacity: 0;
  transform: translateY(8px);
  animation: fadeInItem 260ms ease-out forwards;
}

.modern-table ::v-deep tbody tr:nth-child(1) {
  animation-delay: 0ms;
}

.modern-table ::v-deep tbody tr:nth-child(2) {
  animation-delay: 60ms;
}

.modern-table ::v-deep tbody tr:nth-child(3) {
  animation-delay: 120ms;
}

.modern-table ::v-deep tbody tr:nth-child(4) {
  animation-delay: 180ms;
}

.modern-table ::v-deep tbody tr:nth-child(5) {
  animation-delay: 240ms;
}

.modern-table ::v-deep tbody tr:nth-child(6) {
  animation-delay: 300ms;
}

.modern-table ::v-deep tbody tr:nth-child(7) {
  animation-delay: 360ms;
}

.modern-table ::v-deep tbody tr:nth-child(8) {
  animation-delay: 420ms;
}

.modern-table ::v-deep tbody tr:nth-child(9) {
  animation-delay: 480ms;
}

.modern-table ::v-deep tbody tr:nth-child(10) {
  animation-delay: 540ms;
}

.modern-table ::v-deep tbody tr:nth-child(11) {
  animation-delay: 600ms;
}

.modern-table ::v-deep tbody tr:nth-child(12) {
  animation-delay: 660ms;
}

.modern-table ::v-deep tbody tr:nth-child(13) {
  animation-delay: 720ms;
}

.modern-table ::v-deep tbody tr:nth-child(14) {
  animation-delay: 780ms;
}

.modern-table ::v-deep tbody tr:nth-child(15) {
  animation-delay: 840ms;
}

.modern-table ::v-deep tbody tr:nth-child(16) {
  animation-delay: 900ms;
}

.modern-table ::v-deep tbody tr:nth-child(17) {
  animation-delay: 960ms;
}

.modern-table ::v-deep tbody tr:nth-child(18) {
  animation-delay: 1020ms;
}

.modern-table ::v-deep tbody tr:nth-child(19) {
  animation-delay: 1080ms;
}

.modern-table ::v-deep tbody tr:nth-child(20) {
  animation-delay: 1140ms;
}

/* Status badge styles */
.badge-pill {
  display: inline-block;
  border-radius: 8px;
  padding: 4px 8px;
  font-weight: 600;
  font-size: 12px;
  line-height: 1;
}

.badge--pending {
  background: #FFF3CD;
  color: #856404;
}

.badge--draft {
  background: #E2E3E5;
  color: #383D41;
}

.badge--active {
  background: #D4EDDA;
  color: #155724;
}

.badge--inactive {
  background: #E8F4F8;
  color: #1D4ED8;
}

.badge--completed {
  background: #CCE5FF;
  color: #004085;
}

.badge--cancelled {
  background: #F8D7DA;
  color: #721C24;
}

.badge--default {
  background: #f1f3f5;
  color: #495057;
}
</style>
