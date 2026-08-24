<template>
  <div class="comprador-list-container">
    <!-- Buscador -->
    <div class="search-wrapper">
      <q-input
        v-model="searchTerm"
        outlined
        dense
        placeholder="Buscar comprador"
        class="search-input"
        :disable="isLoading"
      >
        <template v-slot:prepend>
          <q-icon name="search" size="20px" color="grey-6" />
        </template>
        <template v-slot:append>
          <q-icon
            v-if="searchTerm"
            name="close"
            size="18px"
            color="grey-5"
            class="cursor-pointer"
            @click="searchTerm = ''"
          />
        </template>
      </q-input>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="loading-wrapper">
      <q-spinner-dots size="48px" color="primary" />
      <div class="text-body2 text-grey-6 q-mt-md">Cargando compradores...</div>
    </div>

    <!-- Tabla -->
    <div v-else-if="filteredCompradores.length > 0" class="table-wrapper">
      <q-table
        :data="filteredCompradores"
        :columns="columns"
        row-key="id"
        flat
        bordered
        :pagination.sync="pagination"
        hide-bottom
        class="comprador-table"
      >
        <!-- Slots personalizados para cada columna -->
        <template v-slot:body-cell-comprador="props">
          <q-td :props="props">
            <div class="cell-content">
              <q-icon name="business" size="16px" color="primary" class="q-mr-sm" />
              <span class="text-weight-medium">{{ props.row.comprador }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-nit="props">
          <q-td :props="props">
            <div class="cell-content">
              <q-icon name="badge" size="16px" color="grey-6" class="q-mr-sm" />
              <span>{{ props.row.nit }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-ciudad="props">
          <q-td :props="props">
            <div class="cell-content">
              <q-icon name="location_city" size="16px" color="grey-6" class="q-mr-sm" />
              <span>{{ props.row.ciudad }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-despacho="props">
          <q-td :props="props">
            <div class="cell-content">
              <q-icon name="local_shipping" size="16px" color="grey-6" class="q-mr-sm" />
              <span>{{ props.row.despacho }}</span>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-direccion="props">
          <q-td :props="props">
            <div class="cell-content">
              <q-icon name="map" size="16px" color="grey-6" class="q-mr-sm" />
              <span>{{ props.row.direccion }}</span>
            </div>
          </q-td>
        </template>
      </q-table>

      <!-- Contador de resultados -->
      <div class="results-counter">
        <span class="text-caption text-grey-5">
          Mostrando {{ filteredCompradores.length }} de {{ totalCompradores }} compradores
        </span>
      </div>
    </div>

    <!-- Sin resultados -->
    <div v-else class="empty-state">
      <q-icon name="search_off" size="64px" color="grey-4" />
      <div class="text-h6 text-grey-6 q-mt-md">No se encontraron compradores</div>
      <div class="text-body2 text-grey-5 q-mt-xs">
        Intenta con otro termino de busqueda
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from '@vue/composition-api';

export default {
  name: 'CompradorListTable',
  props: {
    compradores: {
      type: Array,
      default: function () { return []; }
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  setup: function (props) {
    var searchTerm = ref('');

    var columns = [
      { name: 'comprador', label: 'Comprador', field: 'comprador', align: 'left', sortable: true },
      { name: 'nit', label: 'NIT', field: 'nit', align: 'left', sortable: true },
      { name: 'ciudad', label: 'Ciudad', field: 'ciudad', align: 'left', sortable: true },
      { name: 'despacho', label: 'Despacho', field: 'despacho', align: 'left', sortable: true },
      { name: 'direccion', label: 'Direccion', field: 'direccion', align: 'left', sortable: true }
    ];

    var pagination = ref({
      page: 1,
      rowsPerPage: 10
    });

    var totalCompradores = computed(function () {
      return props.compradores.length;
    });

    var filteredCompradores = computed(function () {
      if (!searchTerm.value) {
        return props.compradores;
      }
      var term = searchTerm.value.toLowerCase().trim();
      return props.compradores.filter(function (item) {
        return (
          (item.comprador && item.comprador.toLowerCase().indexOf(term) !== -1) ||
          (item.nit && item.nit.toLowerCase().indexOf(term) !== -1) ||
          (item.ciudad && item.ciudad.toLowerCase().indexOf(term) !== -1) ||
          (item.despacho && item.despacho.toLowerCase().indexOf(term) !== -1) ||
          (item.direccion && item.direccion.toLowerCase().indexOf(term) !== -1)
        );
      });
    });

    return {
      searchTerm: searchTerm,
      columns: columns,
      pagination: pagination,
      totalCompradores: totalCompradores,
      filteredCompradores: filteredCompradores
    };
  }
};
</script>

<style scoped>
.comprador-list-container {
  width: 100%;
}

.search-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  max-width: 480px;
  border-radius: 12px;
}

.search-input :deep(.q-field__control) {
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease, transform 0.2s ease;
}

.search-input :deep(.q-field__control:hover) {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.search-input :deep(.q-field--focused .q-field__control) {
  box-shadow: 0 4px 16px rgba(175, 202, 11, 0.25);
  transform: translateY(-1px);
}

.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
}

.table-wrapper {
  animation: fadeIn 0.5s ease-out;
}

.comprador-table {
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.comprador-table :deep(.q-table__top) {
  padding: 0;
}

.comprador-table :deep(.q-table thead th) {
  background: #f8faf7;
  color: #475569;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #e2e8f0;
}

.comprador-table :deep(.q-table tbody td) {
  padding: 12px 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 14px;
  color: #334155;
}

.comprador-table :deep(.q-table tbody tr) {
  animation: fadeInRow 1s ease-out forwards;
  opacity: 0;
}

.comprador-table :deep(.q-table tbody tr:nth-child(1)) { animation-delay: 0s; }
.comprador-table :deep(.q-table tbody tr:nth-child(2)) { animation-delay: 0.08s; }
.comprador-table :deep(.q-table tbody tr:nth-child(3)) { animation-delay: 0.16s; }
.comprador-table :deep(.q-table tbody tr:nth-child(4)) { animation-delay: 0.24s; }
.comprador-table :deep(.q-table tbody tr:nth-child(5)) { animation-delay: 0.32s; }
.comprador-table :deep(.q-table tbody tr:nth-child(6)) { animation-delay: 0.40s; }
.comprador-table :deep(.q-table tbody tr:nth-child(7)) { animation-delay: 0.48s; }
.comprador-table :deep(.q-table tbody tr:nth-child(8)) { animation-delay: 0.56s; }
.comprador-table :deep(.q-table tbody tr:nth-child(9)) { animation-delay: 0.64s; }
.comprador-table :deep(.q-table tbody tr:nth-child(10)) { animation-delay: 0.72s; }

.comprador-table :deep(.q-table tbody tr:hover) {
  background: #f8faf7;
}

.cell-content {
  display: flex;
  align-items: center;
}

.results-counter {
  text-align: center;
  padding: 12px 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 0;
}

@keyframes fadeInRow {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .search-input {
    max-width: 100%;
  }

  .comprador-table :deep(.q-table) {
    display: block;
    overflow-x: auto;
  }

  .comprador-table :deep(.q-table thead th) {
    font-size: 11px;
    padding: 8px;
  }

  .comprador-table :deep(.q-table tbody td) {
    padding: 8px;
    font-size: 12px;
    white-space: nowrap;
  }
}
</style>
