<template>
  <div class="registered-purchases-page">
    <!-- Header de la página -->
    <PageHeaderCard title="Compras registradas">
      Aquí encuentras todas tus compras organizadas en un solo lugar.
      Consulta con total confianza: tu información está clara, ordenada y
      siempre disponible cuando la necesites.
      <template #actions>
        <q-btn
          outline
          color="white"
          text-color="white"
          no-caps
          icon="refresh"
          label="Actualizar"
          :loading="store.isLoading"
          @click="reloadPurchases"
        />
      </template>
    </PageHeaderCard>

    <!-- Aviso de error (status 400 u otro problema) -->
    <q-banner v-if="store.error" rounded class="bg-red-1 text-red-9 q-mt-md">
      <template #avatar>
        <q-icon name="report_problem" color="red-8" />
      </template>
      {{ store.error }}
      <template #action>
        <q-btn
          flat
          dense
          no-caps
          color="red-8"
          icon="refresh"
          label="Reintentar"
          @click="reloadPurchases"
        />
      </template>
    </q-banner>

    <!-- Listado -->
    <q-card flat bordered class="purchases-card q-mt-md">
      <q-card-section class="q-pa-lg">
        <div class="row items-center q-mb-md q-col-gutter-sm fade-in-soft">
          <div class="col">
            <span class="purchases-card__summary">
              {{ tableItems.length }}
              {{ tableItems.length === 1 ? "compra registrada" : "compras registradas" }}
            </span>
          </div>
        </div>

        <div class="fade-in-soft fade-in-soft--delayed">
          <PurchasesTable
            :headers="tableHeaders"
            :items="tableItems"
            @view="onViewPurchase"
            @remove="onRemovePurchase"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- Detalle del registro de compra -->
    <q-dialog v-model="showDetailDialog" transition-show="scale" transition-hide="scale">
      <q-card class="purchase-detail-dialog">
        <q-card-section class="row items-center q-pb-none">
          <q-avatar icon="receipt_long" color="primary" text-color="white" size="40px" />
          <div class="q-ml-md col">
            <div class="text-h6 text-weight-bold">Detalle de la compra</div>
            <div class="text-caption text-grey-6">
              Comparación: {{ selectedComparisonTitle || "—" }}
            </div>
          </div>
          <q-btn v-close-popup flat round dense icon="close" aria-label="Cerrar" />
        </q-card-section>

        <q-card-section v-if="selectedPurchase">
          <div class="purchase-detail__grid">
            <div class="purchase-detail__item">
              <span class="purchase-detail__label">Comparación</span>
              <span class="purchase-detail__value">{{ selectedIdQuote || "—" }}</span>
            </div>
            <div class="purchase-detail__item">
              <span class="purchase-detail__label">Compradores</span>
              <span class="purchase-detail__value">{{ selectedPurchasers || "—" }}</span>
            </div>
            <div class="purchase-detail__item">
              <span class="purchase-detail__label">Proveedores</span>
              <span class="purchase-detail__value">{{ selectedSuppliers || "—" }}</span>
            </div>
            <div class="purchase-detail__item">
              <span class="purchase-detail__label">Creada</span>
              <span class="purchase-detail__value">{{ selectedCreatedAt }}</span>
            </div>
          </div>

          <q-markup-table flat bordered dense class="q-mt-md">
            <thead>
              <tr>
                <th class="text-left">Producto</th>
                <th class="text-right">Cantidad</th>
                <th class="text-right">Precio unitario</th>
                <th class="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in selectedProducts" :key="product.id">
                <td>{{ product.productName || "—" }}</td>
                <td class="text-right">{{ product.quantity }}</td>
                <td class="text-right">{{ formatCurrency(product.unitPrice) }}</td>
                <td class="text-right">{{ formatCurrency(product.total) }}</td>
              </tr>
              <tr v-if="!selectedProducts.length">
                <td colspan="4" class="text-center text-grey-6">
                  Sin productos asociados a este registro.
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="text-right text-weight-bold">Total compra</td>
                <td class="text-right text-weight-bold">
                  {{ formatCurrency(selectedTotal) }}
                </td>
              </tr>
            </tfoot>
          </q-markup-table>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn v-close-popup unelevated no-caps color="primary" label="Cerrar" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Overlay de carga mientras se consumen los endpoints -->
    <LoadingSpinnerOverlay
      v-model="pageLoading"
      label="Cargando compras registradas…"
    />
  </div>
</template>

<script>
import PageHeaderCard from "../components/PageHeaderCard.vue";
import PurchasesTable from "../components/PurchasesTable.vue";
import LoadingSpinnerOverlay from "../components/LoadingSpinnerOverlay.vue";
import { usePurchaseServiceListStore } from "../store/purchaseServiceList.store";
import { formatCurrency } from "../utils/purchaseOrderFinance";
import {
  fetchComparisonLabel,
  fetchPurchaserName,
  fetchSupplierName,
} from "../../infrastructure/purchaseDisplayApi";

export default {
  name: "RegisteredPurchasesListView",

  components: {
    PageHeaderCard,
    PurchasesTable,
    LoadingSpinnerOverlay,
  },

  setup() {
    const store = usePurchaseServiceListStore();
    return { store };
  },

  data() {
    return {
      pageLoading: false,
      showDetailDialog: false,
      selectedPurchase: null,
      // Etiquetas resueltas contra los endpoints de nombre
      // (idQuote -> requestLabel, id -> comprador, id -> nombreRazonSocial)
      comparisonLabels: {},
      purchaserLabels: {},
      supplierLabels: {},
      // Ids cuya información no pudo obtenerse (no-200 / sin nombre)
      purchaserIssues: {},
      supplierIssues: {},
      tableHeaders: [
        {
          key: "comparisonLabel",
          label: "Comparación",
          strong: true,
        },
        {
          key: "purchaserLabel",
          label: "Comprador",
          hint: "purchaserCount",
        },
        {
          key: "supplierLabel",
          label: "Proveedor",
          hint: "supplierCount",
        },
        {
          key: "acciones",
          label: "Acciones",
          align: "center",
        },
      ],
    };
  },

  computed: {
    tableItems() {
      const self = this;
      const purchases = this.store.purchases || [];
      return purchases.map((order) => {
        const purchaserIds =
          order && Array.isArray(order.purchaserIds) ? order.purchaserIds : [];
        const supplierIds =
          order && Array.isArray(order.supplierIds) ? order.supplierIds : [];
        const idQuote = order ? order.idQuote || "" : "";
        const comparisonLabel =
          (idQuote && self.comparisonLabels[idQuote]) || idQuote;

        return {
          id: order && order.id != null ? String(order.id) : "",
          idQuote: idQuote,
          // Columna "Comparación": requestLabel resuelto, fallback al id
          comparisonLabel: comparisonLabel,
          purchaserLabel: self.idsCell(
            purchaserIds,
            self.purchaserLabels,
            self.purchaserIssues,
            { one: "comprador", many: "compradores" }
          ),
          purchaserCount:
            purchaserIds.length === 1
              ? "1 comprador asignado"
              : purchaserIds.length + " compradores asignados",
          supplierLabel: self.idsCell(
            supplierIds,
            self.supplierLabels,
            self.supplierIssues,
            { one: "proveedor", many: "proveedores" }
          ),
          supplierCount:
            supplierIds.length === 1
              ? "1 proveedor"
              : supplierIds.length + " proveedores",
          raw: order || null,
        };
      });
    },

    selectedIdQuote() {
      return this.selectedPurchase ? this.selectedPurchase.idQuote || "" : "";
    },
    selectedComparisonTitle() {
      const idQuote = this.selectedIdQuote;
      if (!idQuote) {
        return "";
      }
      return this.comparisonLabels[idQuote] || idQuote;
    },
    selectedPurchasers() {
      if (
        !this.selectedPurchase ||
        !Array.isArray(this.selectedPurchase.purchaserIds)
      ) {
        return "";
      }
      const cell = this.idsCell(
        this.selectedPurchase.purchaserIds,
        this.purchaserLabels,
        this.purchaserIssues,
        { one: "comprador", many: "compradores" }
      );
      return typeof cell === "string" ? cell : cell.title;
    },
    selectedSuppliers() {
      if (
        !this.selectedPurchase ||
        !Array.isArray(this.selectedPurchase.supplierIds)
      ) {
        return "";
      }
      const cell = this.idsCell(
        this.selectedPurchase.supplierIds,
        this.supplierLabels,
        this.supplierIssues,
        { one: "proveedor", many: "proveedores" }
      );
      return typeof cell === "string" ? cell : cell.title;
    },
    selectedCreatedAt() {
      if (!this.selectedPurchase || !this.selectedPurchase.createdAt) {
        return "—";
      }
      return this.formatEpoch(this.selectedPurchase.createdAt);
    },
    selectedProducts() {
      return this.selectedPurchase && Array.isArray(this.selectedPurchase.products)
        ? this.selectedPurchase.products
        : [];
    },
    selectedTotal() {
      return this.selectedPurchase ? Number(this.selectedPurchase.total) || 0 : 0;
    },
  },

  mounted() {
    this.reloadPurchases();
  },

  methods: {
    formatCurrency,
    async reloadPurchases() {
      this.pageLoading = true;
      try {
        const purchases = await this.store.fetchPurchases();
        if (purchases && purchases.length) {
          await this.resolveDisplayNames(purchases);
        }
      } finally {
        this.pageLoading = false;
      }
    },
    /**
     * Resuelve los nombres legibles de la tabla contra los endpoints:
     * - Comparación: GET /api/supplier-comparisons/{idQuote} -> requestLabel
     * - Comprador:   GET /api/purchasers/{id}               -> comprador
     * - Proveedor:   GET /api/v1/proveedores/{id}           -> nombreRazonSocial
     * Si algún endpoint no responde 200, la celda conserva el id original.
     */
    async resolveDisplayNames(purchases) {
      const comparisonIds = [];
      const purchaserIds = [];
      const supplierIds = [];

      function pushUnique(list, value) {
        if (value == null) return;
        const clean = String(value).trim();
        if (clean && list.indexOf(clean) === -1) {
          list.push(clean);
        }
      }

      purchases.forEach((order) => {
        if (!order) return;
        pushUnique(comparisonIds, order.idQuote);
        (order.purchaserIds || []).forEach(function (id) {
          pushUnique(purchaserIds, id);
        });
        (order.supplierIds || []).forEach(function (id) {
          pushUnique(supplierIds, id);
        });
      });

      const self = this;
      await Promise.all([
        Promise.all(
          comparisonIds.map(async function (id) {
            const label = await fetchComparisonLabel(id);
            if (label) {
              self.$set(self.comparisonLabels, id, label);
            }
          })
        ),
        Promise.all(
          purchaserIds.map(async function (id) {
            const name = await fetchPurchaserName(id);
            if (name) {
              self.$set(self.purchaserLabels, id, name);
            }
          })
        ),
        Promise.all(
          supplierIds.map(async function (id) {
            const name = await fetchSupplierName(id);
            if (name) {
              self.$set(self.supplierLabels, id, name);
            }
          })
        ),
      ]);

      // Marca los ids cuya información sigue sin resolver para mostrar
      // en la celda el mensaje de "elimina y vuelve a registrar".
      this.syncIssues(this.purchaserIssues, this.purchaserLabels, purchaserIds);
      this.syncIssues(this.supplierIssues, this.supplierLabels, supplierIds);
    },
    /** Sincroniza el mapa de problemas con los nombres resueltos. */
    syncIssues(issuesMap, labelsMap, ids) {
      const self = this;
      ids.forEach(function (id) {
        if (labelsMap[id]) {
          // Resuelto en un reintento: retirar la marca de problema
          self.$delete(issuesMap, id);
        } else {
          self.$set(issuesMap, id, true);
        }
      });
    },
    /**
     * Contenido de la celda para una lista de ids:
     * - "" si no hay ids;
     * - string con nombres unidos si todo se resolvió;
     * - nota amigable { tone, title, detail } si algún id falló,
     *   indicando eliminar el registro y volver a realizarlo.
     */
    idsCell(ids, labelsMap, issuesMap, nouns) {
      if (!Array.isArray(ids) || !ids.length) {
        return "";
      }
      const cleanIds = [];
      let hasIssue = false;
      ids.forEach((id) => {
        const clean = id != null ? String(id).trim() : "";
        if (!clean) {
          return;
        }
        cleanIds.push(clean);
        if (issuesMap && issuesMap[clean] && !labelsMap[clean]) {
          hasIssue = true;
        }
      });
      if (!cleanIds.length) {
        return "";
      }
      if (!hasIssue) {
        return this.labelsForIds(cleanIds, labelsMap);
      }
      const singular = cleanIds.length === 1;
      return {
        tone: "warning",
        icon: "error_outline",
        title:
          "Problema al obtener " +
          (singular ? "el " + nouns.one : "los " + nouns.many) +
          ".",
        detail:
          "Elimina este registro y vuelve a realizar el registro de la compra para corregirlo.",
      };
    },
    /** Une los nombres resueltos; si no hay nombre aún, muestra el id. */
    labelsForIds(ids, labelsMap) {
      if (!Array.isArray(ids)) {
        return "";
      }
      return ids
        .map(function (id) {
          const clean = id != null ? String(id).trim() : "";
          if (!clean) return "";
          return (labelsMap && labelsMap[clean]) || clean;
        })
        .filter(Boolean)
        .join(", ");
    },
    onViewPurchase(item) {
      this.selectedPurchase = item && item.raw ? item.raw : null;
      this.showDetailDialog = true;
    },
    onRemovePurchase(item) {
      if (!item || !item.id) {
        return;
      }

      const label = item.idQuote || item.id;
      this.$q
        .dialog({
          title: "Eliminar registro de compra",
          message:
            'Esta acción eliminará el registro de la compra "' +
            label +
            '". ¿Deseas continuar?',
          cancel: { label: "Cancelar", flat: true, color: "grey-7" },
          ok: { label: "Eliminar", color: "negative", unelevated: true },
          persistent: true,
        })
        .onOk(async () => {
          const removed = await this.store.removePurchase(item.id);
          this.$q.notify({
            type: removed ? "positive" : "negative",
            message: removed
              ? "Registro de compra eliminado correctamente."
              : this.store.error ||
                "No fue posible eliminar el registro de la compra.",
            icon: removed ? "delete" : "error_outline",
          });
        });
    },
    formatEpoch(value) {
      const date = new Date(Number(value));
      if (Number.isNaN(date.getTime())) {
        return "—";
      }
      return date.toLocaleString("es-CO");
    },
  },
};
</script>

<style scoped>
.registered-purchases-page {
  width: 100%;
}

/* Aparición gradual (fade-in): 1s, curva ease-in-out y estado final visible */
.fade-in-soft {
  opacity: 0;
  animation: fadeInSoft 1s ease-in-out forwards;
}

/* Variante con retraso de 0.5 segundos antes de iniciar */
.fade-in-soft--delayed {
  animation-delay: 0.5s;
}

@keyframes fadeInSoft {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.purchases-card {
  border-radius: 12px;
  overflow: hidden;
}

.purchases-card__summary {
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
}

.purchase-detail-dialog {
  width: 92vw;
  max-width: 720px;
  border-radius: 12px;
}

.purchase-detail__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 10px;
}

.purchase-detail__item {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.purchase-detail__label {
  font-size: 0.64rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #94a3b8;
}

.purchase-detail__value {
  font-size: 0.86rem;
  font-weight: 600;
  color: #0f172a;
  word-break: break-word;
}
</style>
