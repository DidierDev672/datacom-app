<template>
  <q-dialog
    :value="value"
    transition-show="scale"
    transition-hide="scale"
    @input="$emit('input', $event)"
  >
    <q-card class="detail-dialog">
      <q-card-section class="row items-center q-pb-sm">
        <q-avatar icon="visibility" color="primary" text-color="white" />
        <div class="q-ml-md">
          <div class="text-h6">Detalle de gestión de compra</div>
          <div v-if="transactionCode" class="text-caption text-grey-7">
            {{ transactionCode }}
          </div>
        </div>
        <q-space />
        <q-btn v-close-popup flat round dense icon="close" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-inner-loading :showing="loading">
          <q-spinner-dots size="32px" color="primary" />
        </q-inner-loading>

        <q-banner
          v-if="error"
          dense
          rounded
          class="bg-red-1 text-red-9 q-mb-md"
        >
          {{ error }}
        </q-banner>

        <div v-if="detail && !loading" class="detail-content">
          <div class="detail-grid">
            <div class="detail-field">
              <span class="detail-field__label">Código</span>
              <span class="detail-field__value">{{ po.code || "—" }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">Estado</span>
              <q-badge
                :color="statusColor(po.status)"
                text-color="white"
                :label="statusLabel(po.status)"
              />
            </div>
            <div class="detail-field">
              <span class="detail-field__label">Fecha registro</span>
              <span class="detail-field__value">{{ formatDate(po.createdAt) }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">Gerente de compras</span>
              <span class="detail-field__value">{{ po.assignedToUserId || "—" }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">Orden de suministro</span>
              <span class="detail-field__value">
                {{ supplyOrderLabel }}
              </span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">Proveedor</span>
              <span class="detail-field__value">{{ supplierName }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">NIT proveedor</span>
              <span class="detail-field__value">{{ supplierNit }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">N° cotización</span>
              <span class="detail-field__value">{{ po.quotationNumber || "—" }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">Términos de pago</span>
              <span class="detail-field__value">{{ po.paymentTerms || "—" }}</span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">Fecha entrega acordada</span>
              <span class="detail-field__value">
                {{ formatDate(po.agreedDeliveryDate) }}
              </span>
            </div>
            <div class="detail-field">
              <span class="detail-field__label">Total</span>
              <span class="detail-field__value detail-field__value--total">
                {{ formatCurrency(transactionTotal) }}
              </span>
            </div>
          </div>

          <div class="q-mt-md">
            <div class="detail-section-title">Productos</div>
            <q-markup-table
              v-if="items.length"
              flat
              bordered
              dense
              class="items-table"
            >
              <thead>
                <tr>
                  <th class="text-left">Producto</th>
                  <th class="text-right">Cantidad</th>
                  <th class="text-left">Unidad</th>
                  <th class="text-right">Precio unit.</th>
                  <th class="text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in items" :key="item.id || item.productName">
                  <td>{{ item.productName || "—" }}</td>
                  <td class="text-right">{{ item.quantity || 0 }}</td>
                  <td>{{ item.unit || "UND" }}</td>
                  <td class="text-right">{{ formatCurrency(item.unitPrice) }}</td>
                  <td class="text-right">
                    {{
                      formatCurrency(
                        (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)
                      )
                    }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
            <div v-else class="text-grey-6 text-caption">
              No hay productos asociados a esta transacción.
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat no-caps label="Cerrar" color="grey-7" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { purchaseTransactionApi } from "../../infrastructure/PurchaseTransactionApi";
import { formatCurrency } from "../utils/purchaseOrderFinance";
import {
  calculateTransactionTotal,
  formatTransactionDate,
  transactionStatusColor,
  transactionStatusLabel,
} from "../utils/purchaseTransactionList";

export default {
  name: "PurchaseTransactionDetailDialog",

  props: {
    value: {
      type: Boolean,
      default: false,
    },
    transaction: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      loading: false,
      error: null,
      detail: null,
    };
  },

  computed: {
    po() {
      if (this.detail && this.detail.purchaseOrder) {
        return this.detail.purchaseOrder;
      }
      return this.transaction || {};
    },
    items() {
      return Array.isArray(this.po.items) ? this.po.items : [];
    },
    transactionCode() {
      return this.po.code || this.po.id || "";
    },
    transactionTotal() {
      return calculateTransactionTotal(this.po);
    },
    supplierName() {
      const supplier = (this.detail && this.detail.supplier) || this.po.supplier || {};
      return supplier.name || supplier.contactName || "—";
    },
    supplierNit() {
      const supplier = (this.detail && this.detail.supplier) || this.po.supplier || {};
      return supplier.nit || this.po.supplierId || "—";
    },
    supplyOrderLabel() {
      const so = this.detail && this.detail.supplyOrder;
      if (so && (so.code || so.id)) {
        return so.code || so.id;
      }
      return this.po.supplyOrderId || "—";
    },
  },

  watch: {
    value(isOpen) {
      if (isOpen) {
        this.loadDetail();
      } else {
        this.detail = null;
        this.error = null;
      }
    },
  },

  methods: {
    formatCurrency,
    formatDate: formatTransactionDate,
    statusLabel: transactionStatusLabel,
    statusColor: transactionStatusColor,
    async loadDetail() {
      if (!this.transaction || !this.transaction.id) {
        this.detail = null;
        this.error = "No se encontró la transacción seleccionada.";
        return;
      }

      this.loading = true;
      this.error = null;

      try {
        this.detail = await purchaseTransactionApi.getTransactionDetail(
          this.transaction.id
        );
      } catch (error) {
        this.detail = { purchaseOrder: this.transaction };
        this.error =
          (error && error.message) ||
          "No fue posible cargar el detalle completo. Se muestran datos básicos.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.detail-dialog {
  width: min(900px, 95vw);
  max-width: 95vw;
  border-radius: 12px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.detail-field {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.detail-field__label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 4px;
}

.detail-field__value {
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #0f172a;
  word-break: break-word;
}

.detail-field__value--total {
  color: #c2410c;
}

.detail-section-title {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #475569;
  margin-bottom: 8px;
}

.items-table {
  background: #fff;
}
</style>
