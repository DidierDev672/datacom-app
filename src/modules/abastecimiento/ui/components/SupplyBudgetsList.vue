<template>
  <div class="supply-budgets-list">
    <div class="toolbar">
      <input
        v-model="query"
        class="search-input"
        placeholder="Buscar presupuestos..."
        aria-label="Buscar presupuestos"
      />
    </div>

    <table class="budgets-table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Líder del plan</th>
          <th>Fecha inicio</th>
          <th>Fecha fin</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <transition-group name="fade" tag="tbody">
        <tr v-for="budget in filteredBudgets" :key="budget.id">
          <td>{{ budget.name }}</td>
          <td>{{ budget.leader }}</td>
          <td>{{ formatDate(budget.startDate) }}</td>
          <td>{{ formatDate(budget.endDate) }}</td>
          <td>{{ budget.status }}</td>
          <td class="actions">
            <button class="icon-btn" @click="$emit('view', budget)" title="Ver">
              <!-- eye icon -->
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5C7 5 2.73 8.11 1 12c1.73 3.89 6 7 11 7s9.27-3.11 11-7c-1.73-3.89-6-7-11-7z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <button class="icon-btn" @click="$emit('edit', budget)" title="Editar">
              <!-- pencil icon -->
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21v-3.75L14.81 5.44a2 2 0 0 1 2.83 0l1.92 1.92a2 2 0 0 1 0 2.83L7.75 21H3z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 6l4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <button class="icon-btn danger" @click="$emit('delete', budget)" title="Eliminar">
              <!-- trash icon -->
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <polyline points="3 6 5 6 21 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M10 11v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M14 11v6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </td>
        </tr>
      </transition-group>
    </table>

    <div v-if="filteredBudgets.length === 0" class="empty">No se encontraron presupuestos.</div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  budgets: { type: Array, default: () => [] }
})

const emit = defineEmits(['view', 'edit', 'delete'])

const query = ref('')

const filteredBudgets = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.budgets
  return props.budgets.filter(b => {
    const name = (b.name || '').toString().toLowerCase()
    const leader = (b.leader || '').toString().toLowerCase()
    const status = (b.status || '').toString().toLowerCase()
    return name.includes(q) || leader.includes(q) || status.includes(q)
  })
})

function formatDate(value) {
  if (!value) return ''
  const d = new Date(value)
  if (isNaN(d.getTime())) return value
  return d.toLocaleDateString()
}
</script>

<style scoped>
.supply-budgets-list {
  width: 100%;
}
.toolbar {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 12px;
}
.search-input {
  padding: 8px 10px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  width: 320px;
}
.budgets-table {
  width: 100%;
  border-collapse: collapse;
}
.budgets-table th,
.budgets-table td {
  text-align: left;
  padding: 10px 8px;
  border-bottom: 1px solid #eef0f2;
}
.budgets-table thead th {
  background: #fafafa;
  font-weight: 600;
}
.actions {
  display: flex;
  gap: 6px;
}
.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #333;
}
.icon-btn:hover { background: rgba(0,0,0,0.03); border-radius:4px }
.icon-btn.danger { color: #c0392b }

.empty {
  margin-top: 12px;
  color: #666;
}

/* Fade-in transition for rows */
.fade-enter-from {
  opacity: 0;
  transform: translateY(6px);
}
.fade-enter-active {
  transition: all 220ms cubic-bezier(.2,.8,.2,1);
}
.fade-enter-to { opacity: 1; transform: none }
</style>
