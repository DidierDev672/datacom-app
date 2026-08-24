<template>
  <div class="supplier-comparisons-list">
    <q-card class="comparisons-card shadow-lg">
      <q-card-section class="header-gradient text-white q-pa-lg">
        <div class="row items-center">
          <div>
            <div class="text-h5 text-weight-bold text-white">
              Comparaciones de proveedores
            </div>
            <div class="text-caption opacity-80 q-mt-xs">
              Historial de comparaciones registradas y sus proveedores ganadores.
            </div>
          </div>
          <q-space />
          <q-btn outline color="white" text-color="white" no-caps icon="refresh" label="Actualizar" class="btn-refresh"
            :loading="loading" @click="loadComparisons" />
        </div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <div class="summary-grid q-mb-md">
          <div class="summary-item">
            <span class="summary-item__label">Total comparaciones</span>
            <span class="summary-item__value">{{ filteredRows.length }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-item__label">Proveedores en última</span>
            <span class="summary-item__value">
              {{ latestSuppliersCount }}
            </span>
          </div>
        </div>

        <q-input v-model="searchQuery" outlined dense clearable debounce="250" bg-color="white"
          placeholder="Buscar por código, solicitud, orden o proveedor ganador..." class="q-mb-md">
          <template v-slot:prepend>
            <q-icon name="search" color="grey-6" />
          </template>
        </q-input>

        <q-banner v-if="error" class="bg-red-1 text-red-9 q-mb-md" rounded dense>
          {{ error }}
        </q-banner>

        <q-table flat bordered :data="filteredRows" :columns="columns" row-key="id" :loading="loading"
          :row-class="rowClass" no-data-label="No hay comparaciones registradas."
          :pagination="{ rowsPerPage: 10 }" class="comparisons-table">
          <template v-slot:body="props">
            <q-tr :props="props" :class="rowClass(props.row, props.rowIndex)">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <template v-if="col.name === 'code'">
                  <div class="text-weight-medium">
                    {{ props.row.code || shortId(props.row.id) }}
                  </div>
                  <div class="text-caption text-grey-6">
                    ID: {{ shortId(props.row.id) }}
                  </div>
                </template>
                <template v-else-if="col.name === 'requestLabel'">
                  <div>{{ props.row.requestLabel || "—" }}</div>
                  <div v-if="props.row.requestId" class="text-caption text-grey-6">
                    Solicitud: {{ shortId(props.row.requestId) }}
                  </div>
                </template>
                <template v-else-if="col.name === 'supplyOrderId'">
                  {{ shortId(props.row.supplyOrderId) }}
                </template>
                <template v-else-if="col.name === 'winner'">
                  <div>{{ props.row.winnerName || "—" }}</div>
                  <div v-if="props.row.winnerNit" class="text-caption text-grey-6">
                    NIT: {{ props.row.winnerNit }}
                  </div>
                </template>
                <template v-else-if="col.name === 'winnerTotal'">
                  <div class="text-right text-weight-medium">
                    {{ formatCurrency(props.row.winnerTotal) }}
                  </div>
                </template>
                <template v-else-if="col.name === 'suppliersCount'">
                  <div class="text-center">
                    <q-badge color="grey-3" text-color="grey-9">
                      {{ props.row.suppliersCount || 0 }}
                    </q-badge>
                  </div>
                </template>
                <template v-else-if="col.name === 'productsCount'">
                  <div class="text-center">
                    <q-badge color="grey-3" text-color="grey-9">
                      {{ props.row.productsCount || 0 }}
                    </q-badge>
                  </div>
                </template>
                <template v-else-if="col.name === 'createdAt'">
                  {{ formatComparisonDate(props.row.createdAt) }}
                </template>
                <template v-else-if="col.name === 'actions'">
                  <div class="row no-wrap items-center justify-center q-gutter-xs">
                    <q-btn flat dense round color="primary" icon="visibility" @click="openDetail(props.row)">
                      <q-tooltip>Ver detalle</q-tooltip>
                    </q-btn>
                    <q-btn flat dense round color="secondary" icon="edit" @click="openEdit(props.row)">
                      <q-tooltip>Editar</q-tooltip>
                    </q-btn>
                    <q-btn flat dense round color="negative" icon="delete" @click="confirmDelete(props.row)">
                      <q-tooltip>Eliminar</q-tooltip>
                    </q-btn>
                  </div>
                </template>
                <template v-else>
                  {{ col.value }}
                </template>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <SupplierComparisonDetailDialog v-model="showDetailDialog" :comparison="selectedComparison" />

    <SupplierComparisonEditDialog v-model="showEditDialog" :comparison="selectedComparison"
      @saved="onComparisonUpdated" />
  </div>
</template>

<script>
import { supplierComparisonStorageApi } from "../../infrastructure/SupplierComparisonStorageApi";
import { formatCurrency, shortId } from "../utils/purchaseOrderFinance";
import {
  formatComparisonDate,
  matchesComparisonSearch,
} from "../utils/supplierComparisonList";
import SupplierComparisonDetailDialog from "./SupplierComparisonDetailDialog.vue";
import SupplierComparisonEditDialog from "./SupplierComparisonEditDialog.vue";

export default {
  name: "SupplierComparisonsList",

  components: {
    SupplierComparisonDetailDialog,
    SupplierComparisonEditDialog,
  },

  props: {
    autoLoad: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      loading: false,
      deleting: false,
      error: null,
      rows: [],
      searchQuery: "",
      showDetailDialog: false,
      showEditDialog: false,
      selectedComparison: null,
      columns: [
        {
          name: "code",
          label: "Código",
          field: "code",
          align: "left",
          sortable: true,
        },
        {
          name: "requestLabel",
          label: "Solicitud / plan",
          field: "requestLabel",
          align: "left",
        },
        {
          name: "supplyOrderId",
          label: "Orden suministro",
          field: "supplyOrderId",
          align: "left",
        },
        {
          name: "winner",
          label: "Proveedor ganador",
          field: "winnerName",
          align: "left",
        },
        {
          name: "winnerTotal",
          label: "Total ganador",
          field: "winnerTotal",
          align: "right",
          sortable: true,
        },
        {
          name: "suppliersCount",
          label: "Proveedores",
          field: "suppliersCount",
          align: "center",
        },
        {
          name: "productsCount",
          label: "Productos",
          field: "productsCount",
          align: "center",
        },
        {
          name: "createdAt",
          label: "Fecha",
          field: "createdAt",
          align: "left",
          sortable: true,
        },
        {
          name: "actions",
          label: "Acciones",
          field: "actions",
          align: "center",
        },
      ],
    };
  },

  computed: {
    filteredRows() {
      return this.rows.filter((row) =>
        matchesComparisonSearch(row, this.searchQuery)
      );
    },
    latestSuppliersCount() {
      if (!this.rows.length) {
        return 0;
      }
      return this.rows[0].suppliersCount || 0;
    },
  },

  mounted() {
    if (this.autoLoad) {
      this.loadComparisons();
    }
  },

  methods: {
    formatCurrency,
    shortId,
    formatComparisonDate,
    rowClass(row, rowIndex) {
      const delayIndex = Math.min((rowIndex || 0) + 1, 15);
      return `fade-in-row delay-${delayIndex}`;
    },
    async loadComparisons() {
      this.loading = true;
      this.error = null;
      try {
        this.rows = await supplierComparisonStorageApi.listComparisons();
      } catch (error) {
        this.error =
          (error && error.message) ||
          "No fue posible cargar las comparaciones.";
      } finally {
        this.loading = false;
      }
    },
    openDetail(row) {
      this.selectedComparison = row;
      this.showDetailDialog = true;
    },
    openEdit(row) {
      this.selectedComparison = row;
      this.showEditDialog = true;
    },
    onComparisonUpdated(updated) {
      const index = this.rows.findIndex((item) => item.id === updated.id);
      if (index >= 0) {
        this.$set(this.rows, index, updated);
      } else {
        this.loadComparisons();
      }
    },
    confirmDelete(row) {
      const comparisonId =
        row && row.id != null ? String(row.id).trim() : "";
      if (!comparisonId) {
        this.$q.notify({
          type: "warning",
          message: "No se pudo identificar la comparación a eliminar.",
        });
        return;
      }

      const label = row.code || this.shortId(row.id);
      this.$q
        .dialog({
          title: "Confirmar eliminación",
          message: `Esta acción eliminará la comparación "${label}". ¿Deseas continuar?`,
          cancel: { label: "Cancelar", flat: true, color: "grey-7" },
          ok: { label: "Eliminar", color: "negative", unelevated: true },
          persistent: true,
        })
        .onOk(() => this.deleteComparison(row, comparisonId));
    },
    async deleteComparison(row, comparisonId) {
      this.deleting = true;
      try {
        await supplierComparisonStorageApi.deleteComparison(comparisonId);

        if (
          this.selectedComparison &&
          String(this.selectedComparison.id).trim() === comparisonId
        ) {
          this.showDetailDialog = false;
          this.showEditDialog = false;
          this.selectedComparison = null;
        }

        this.rows = this.rows.filter(
          (item) => String(item.id).trim() !== comparisonId
        );
        this.$q.notify({
          type: "positive",
          message: "Comparación eliminada correctamente.",
          icon: "delete",
        });
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message:
            (error && error.message) ||
            "No fue posible eliminar la comparación.",
        });
      } finally {
        this.deleting = false;
      }
    },
  },
};
</script>

<style scoped>
.supplier-comparisons-list {
  width: 100%;
}

.comparisons-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.header-gradient {
  background: linear-gradient(135deg, #84b24d 0%, #75af7e 50%, #4e9c4c 100%);
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.summary-item__label {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.summary-item__value {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
}

.comparisons-table ::v-deep th {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
}

.fade-in-row {
  opacity: 0;
  transform: translateY(8px);
  animation: fadeInItem 260ms ease-out forwards;
}

.delay-1 { animation-delay: 0ms; }
.delay-2 { animation-delay: 60ms; }
.delay-3 { animation-delay: 120ms; }
.delay-4 { animation-delay: 180ms; }
.delay-5 { animation-delay: 240ms; }
.delay-6 { animation-delay: 300ms; }
.delay-7 { animation-delay: 360ms; }
.delay-8 { animation-delay: 420ms; }
.delay-9 { animation-delay: 480ms; }
.delay-10 { animation-delay: 540ms; }
.delay-11 { animation-delay: 600ms; }
.delay-12 { animation-delay: 660ms; }
.delay-13 { animation-delay: 720ms; }
.delay-14 { animation-delay: 780ms; }
.delay-15 { animation-delay: 840ms; }

@keyframes fadeInItem {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
