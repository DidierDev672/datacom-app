<template>
  <div class="purchase-transactions-list">
    <q-card class="transactions-card shadow-lg">
      <q-card-section class="header-gradient text-white q-pa-lg">
        <div class="row items-center">
          <div>
            <div class="text-h5 text-weight-bold text-white">
              Transacciones de compra
            </div>
            <div class="text-caption opacity-80 q-mt-xs">
              Historial de todas las transacciones registradas en el sistema.
            </div>
          </div>
          <q-space />
          <q-btn
            outline
            color="white"
            text-color="white"
            no-caps
            icon="refresh"
            label="Actualizar"
            class="btn-refresh"
            :loading="loading"
            @click="loadTransactions"
          />
        </div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <div class="summary-grid q-mb-md">
          <div class="summary-item">
            <span class="summary-item__label">Total transacciones</span>
            <span class="summary-item__value">{{ filteredRows.length }}</span>
          </div>
          <div class="summary-item">
            <span class="summary-item__label">Monto acumulado</span>
            <span class="summary-item__value">
              {{ formatCurrency(totalFilteredAmount) }}
            </span>
          </div>
        </div>

        <div class="row q-col-gutter-sm q-mb-md">
          <div class="col-12 col-md-8">
            <q-input
              v-model="searchQuery"
              outlined
              dense
              clearable
              debounce="250"
              bg-color="white"
              placeholder="Buscar por código, orden, gerente o proveedor..."
            >
              <template v-slot:prepend>
                <q-icon name="search" color="grey-6" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="statusFilter"
              :options="statusFilterOptions"
              option-value="value"
              option-label="label"
              emit-value
              map-options
              outlined
              dense
              clearable
              bg-color="white"
              placeholder="Filtrar por estado"
            >
              <template v-slot:prepend>
                <q-icon name="filter_alt" color="grey-6" />
              </template>
            </q-select>
          </div>
        </div>

        <q-banner
          v-if="error"
          class="bg-red-1 text-red-9 q-mb-md"
          rounded
          dense
        >
          {{ error }}
        </q-banner>

        <q-table
          flat
          bordered
          :data="filteredRows"
          :columns="columns"
          row-key="id"
          :loading="loading"
          no-data-label="No hay transacciones registradas."
          :pagination="{ rowsPerPage: 10 }"
          class="transactions-table"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td v-for="col in props.cols" :key="col.name" :props="props">
                <template v-if="col.name === 'code'">
                  <div class="text-weight-medium">
                    {{ props.row.code || shortId(props.row.id) }}
                  </div>
                  <div class="text-caption text-grey-6">
                    ID: {{ shortId(props.row.id) }}
                  </div>
                </template>
                <template v-else-if="col.name === 'supplyOrderId'">
                  {{ shortId(props.row.supplyOrderId) }}
                </template>
                <template v-else-if="col.name === 'supplier'">
                  <div>{{ supplierLabel(props.row) }}</div>
                  <div
                    v-if="props.row.supplierId"
                    class="text-caption text-grey-6"
                  >
                    NIT: {{ props.row.supplierId }}
                  </div>
                </template>
                <template v-else-if="col.name === 'status'">
                  <div class="text-center">
                    <q-badge
                      :color="statusColor(props.row.status)"
                      text-color="white"
                      :label="statusLabel(props.row.status)"
                    />
                  </div>
                </template>
                <template v-else-if="col.name === 'createdAt'">
                  {{ formatDate(props.row.createdAt) }}
                </template>
                <template v-else-if="col.name === 'totalAmount'">
                  <div class="text-right text-weight-medium">
                    {{ formatCurrency(transactionTotal(props.row)) }}
                  </div>
                </template>
                <template v-else-if="col.name === 'itemsCount'">
                  <div class="text-center">
                    <q-badge color="grey-3" text-color="grey-9">
                      {{ itemsCount(props.row) }}
                    </q-badge>
                  </div>
                </template>
                <template v-else-if="col.name === 'actions'">
                  <div class="row no-wrap items-center justify-center q-gutter-xs">
                    <q-btn
                      flat
                      dense
                      round
                      color="primary"
                      icon="visibility"
                      @click="openDetail(props.row)"
                    >
                      <q-tooltip>Ver detalle</q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      dense
                      round
                      color="secondary"
                      icon="edit"
                      :disable="isClosed(props.row)"
                      @click="openEdit(props.row)"
                    >
                      <q-tooltip>
                        {{
                          isClosed(props.row)
                            ? "No editable (cerrada)"
                            : "Editar"
                        }}
                      </q-tooltip>
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

    <PurchaseTransactionDetailDialog
      v-model="showDetailDialog"
      :transaction="selectedTransaction"
    />

    <PurchaseTransactionEditDialog
      v-model="showEditDialog"
      :transaction="selectedTransaction"
      @saved="onTransactionUpdated"
    />
  </div>
</template>

<script>
import { purchaseTransactionApi } from "../../infrastructure/PurchaseTransactionApi";
import PurchaseTransactionDetailDialog from "./PurchaseTransactionDetailDialog.vue";
import PurchaseTransactionEditDialog from "./PurchaseTransactionEditDialog.vue";
import { formatCurrency, shortId } from "../utils/purchaseOrderFinance";
import {
  calculateTransactionTotal,
  formatTransactionDate,
  matchesTransactionSearch,
  transactionStatusColor,
  transactionStatusLabel,
  transactionSupplierLabel,
  TRANSACTION_STATUS_LABELS,
} from "../utils/purchaseTransactionList";

export default {
  name: "PurchaseTransactionsList",

  components: {
    PurchaseTransactionDetailDialog,
    PurchaseTransactionEditDialog,
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
      error: null,
      rows: [],
      searchQuery: "",
      statusFilter: null,
      showDetailDialog: false,
      showEditDialog: false,
      selectedTransaction: null,
      columns: [
        {
          name: "code",
          label: "Código",
          field: "code",
          align: "left",
          sortable: true,
        },
        {
          name: "supplyOrderId",
          label: "Orden suministro",
          field: "supplyOrderId",
          align: "left",
        },
        {
          name: "supplier",
          label: "Proveedor",
          field: "supplier",
          align: "left",
        },
        {
          name: "assignedToUserId",
          label: "Gerente compras",
          field: "assignedToUserId",
          align: "left",
        },
        {
          name: "status",
          label: "Estado",
          field: "status",
          align: "center",
          sortable: true,
        },
        {
          name: "createdAt",
          label: "Fecha",
          field: "createdAt",
          align: "left",
          sortable: true,
        },
        {
          name: "totalAmount",
          label: "Total",
          field: "totalAmount",
          align: "right",
          sortable: true,
        },
        {
          name: "itemsCount",
          label: "Ítems",
          field: "itemsCount",
          align: "center",
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
    statusFilterOptions() {
      return Object.entries(TRANSACTION_STATUS_LABELS).map(
        ([value, label]) => ({
          value,
          label,
        })
      );
    },
    filteredRows() {
      return this.rows.filter((row) => {
        const matchesSearch = matchesTransactionSearch(row, this.searchQuery);
        const matchesStatus =
          !this.statusFilter ||
          String(row.status || "").toUpperCase() ===
            String(this.statusFilter).toUpperCase();
        return matchesSearch && matchesStatus;
      });
    },
    totalFilteredAmount() {
      return this.filteredRows.reduce(
        (acc, row) => acc + calculateTransactionTotal(row),
        0
      );
    },
  },

  created() {
    if (this.autoLoad) {
      this.loadTransactions();
    }
  },

  methods: {
    formatCurrency,
    shortId,
    statusLabel: transactionStatusLabel,
    statusColor: transactionStatusColor,
    supplierLabel: transactionSupplierLabel,
    formatDate: formatTransactionDate,
    transactionTotal: calculateTransactionTotal,
    itemsCount(row) {
      return Array.isArray(row && row.items) ? row.items.length : 0;
    },
    isClosed(row) {
      return String(row && row.status).toUpperCase() === "CLOSED";
    },
    openDetail(row) {
      this.selectedTransaction = row;
      this.showDetailDialog = true;
    },
    openEdit(row) {
      this.selectedTransaction = row;
      this.showEditDialog = true;
    },
    onTransactionUpdated() {
      this.loadTransactions();
      this.$emit("updated");
    },
    async loadTransactions() {
      this.loading = true;
      this.error = null;

      try {
        const data = await purchaseTransactionApi.listTransactions();
        this.rows = Array.isArray(data) ? data : [];
        this.$emit("loaded", this.rows);
      } catch (error) {
        this.error =
          "No fue posible consultar las transacciones: " +
          (error && error.message ? error.message : "Error desconocido");
        this.$emit("error", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.purchase-transactions-list {
  width: 100%;
}

.transactions-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.header-gradient {
  background: linear-gradient(135deg, #84b24d 0%, #75af7e 50%, #4e9c4c 100%);
}

.btn-refresh {
  border-radius: 8px;
  font-weight: 600;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.summary-item {
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid rgba(78, 156, 76, 0.2);
  background: rgba(132, 178, 77, 0.08);
}

.summary-item__label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
}

.summary-item__value {
  display: block;
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}

.transactions-table ::v-deep th {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #64748b;
}

</style>
