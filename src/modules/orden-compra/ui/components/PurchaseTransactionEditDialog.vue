<template>
  <q-dialog
    :value="value"
    persistent
    transition-show="scale"
    transition-hide="scale"
    @input="$emit('input', $event)"
  >
    <q-card class="edit-dialog">
      <q-card-section class="row items-center q-pb-sm">
        <q-avatar icon="edit" color="primary" text-color="white" />
        <div class="q-ml-md">
          <div class="text-h6">Editar gestión de compra</div>
          <div v-if="transactionCode" class="text-caption text-grey-7">
            {{ transactionCode }}
          </div>
        </div>
        <q-space />
        <q-btn v-close-popup flat round dense icon="close" :disable="saving" />
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-form @submit.prevent="saveChanges">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.assignedToUserId"
                outlined
                dense
                label="Gerente de compras *"
                :rules="[(val) => !!(val && val.trim()) || 'Campo requerido']"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.supplierId"
                outlined
                dense
                label="NIT proveedor"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-select
                v-model="form.status"
                :options="statusOptions"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                outlined
                dense
                label="Estado"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.quotationNumber"
                outlined
                dense
                label="N° cotización"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.paymentTerms"
                outlined
                dense
                label="Términos de pago"
              />
            </div>
            <div class="col-12 col-md-6">
              <q-input
                v-model="form.agreedDeliveryDate"
                outlined
                dense
                label="Fecha entrega acordada"
                mask="####-##-##"
                placeholder="yyyy-mm-dd"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy>
                      <q-date v-model="form.agreedDeliveryDate" mask="YYYY-MM-DD" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>

          <div class="q-mt-lg">
            <div class="edit-section-title row items-center q-mb-sm">
              <span>Productos</span>
              <q-space />
              <q-btn
                flat
                dense
                no-caps
                color="primary"
                icon="add"
                label="Agregar ítem"
                @click="addItem"
              />
            </div>

            <div
              v-for="(item, index) in form.items"
              :key="item._key"
              class="item-row q-mb-sm"
            >
              <div class="row q-col-gutter-sm items-start">
                <div class="col-12 col-md-4">
                  <q-input
                    v-model="item.productName"
                    outlined
                    dense
                    label="Producto"
                  />
                </div>
                <div class="col-6 col-md-2">
                  <q-input
                    v-model.number="item.quantity"
                    outlined
                    dense
                    type="number"
                    min="0"
                    label="Cantidad"
                  />
                </div>
                <div class="col-6 col-md-2">
                  <q-input
                    v-model="item.unit"
                    outlined
                    dense
                    label="Unidad"
                  />
                </div>
                <div class="col-6 col-md-3">
                  <q-input
                    v-model.number="item.unitPrice"
                    outlined
                    dense
                    type="number"
                    min="0"
                    label="Precio unit."
                  />
                </div>
                <div class="col-6 col-md-1 flex flex-center">
                  <q-btn
                    flat
                    round
                    dense
                    color="negative"
                    icon="delete"
                    @click="removeItem(index)"
                  />
                </div>
              </div>
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="right" class="q-pa-md">
        <q-btn flat no-caps label="Cancelar" color="grey-7" v-close-popup :disable="saving" />
        <q-btn
          unelevated
          no-caps
          color="primary"
          icon="save"
          label="Guardar cambios"
          :loading="saving"
          @click="saveChanges"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { purchaseTransactionApi } from "../../infrastructure/PurchaseTransactionApi";
import { TRANSACTION_STATUS_LABELS } from "../utils/purchaseTransactionList";

function createEmptyForm() {
  return {
    assignedToUserId: "",
    supplierId: "",
    status: "QUOTING",
    quotationNumber: "",
    paymentTerms: "",
    agreedDeliveryDate: "",
    items: [],
  };
}

function formatDateForInput(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default {
  name: "PurchaseTransactionEditDialog",

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
      saving: false,
      form: createEmptyForm(),
    };
  },

  computed: {
    statusOptions() {
      return Object.entries(TRANSACTION_STATUS_LABELS).map(([value, label]) => ({
        value,
        label,
      }));
    },
    transactionCode() {
      if (!this.transaction) return "";
      return this.transaction.code || this.transaction.id || "";
    },
  },

  watch: {
    value(isOpen) {
      if (isOpen) {
        this.initializeForm();
      }
    },
    transaction: {
      deep: true,
      handler() {
        if (this.value) {
          this.initializeForm();
        }
      },
    },
  },

  methods: {
    initializeForm() {
      const transaction = this.transaction || {};
      const items = Array.isArray(transaction.items) ? transaction.items : [];

      this.form = {
        assignedToUserId: transaction.assignedToUserId || "",
        supplierId: transaction.supplierId || "",
        status: String(transaction.status || "QUOTING").toUpperCase(),
        quotationNumber: transaction.quotationNumber || "",
        paymentTerms: transaction.paymentTerms || "",
        agreedDeliveryDate: formatDateForInput(transaction.agreedDeliveryDate),
        items: items.map((item, index) => ({
          _key: item.id || `item-${index}`,
          id: item.id || "",
          productName: item.productName || "",
          quantity: Number(item.quantity) || 0,
          unit: item.unit || "UND",
          unitPrice: Number(item.unitPrice) || 0,
        })),
      };
    },
    addItem() {
      this.form.items.push({
        _key: `new-${Date.now()}`,
        id: "",
        productName: "",
        quantity: 1,
        unit: "UND",
        unitPrice: 0,
      });
    },
    removeItem(index) {
      this.form.items.splice(index, 1);
    },
    buildPayload() {
      return {
        assignedToUserId: this.form.assignedToUserId.trim(),
        supplierId: this.form.supplierId || "",
        status: this.form.status,
        quotationNumber: this.form.quotationNumber || "",
        paymentTerms: this.form.paymentTerms || "",
        agreedDeliveryDate: this.form.agreedDeliveryDate || "",
        items: this.form.items
          .filter((item) => item.productName && Number(item.quantity) > 0)
          .map((item) => ({
            id: item.id || undefined,
            productName: item.productName,
            quantity: Number(item.quantity) || 0,
            unit: item.unit || "UND",
            unitPrice: Number(item.unitPrice) || 0,
          })),
      };
    },
    async saveChanges() {
      if (!this.transaction || !this.transaction.id) {
        return;
      }

      if (!this.form.assignedToUserId || !this.form.assignedToUserId.trim()) {
        this.$q.notify({
          type: "warning",
          message: "El gerente de compras es obligatorio.",
        });
        return;
      }

      this.saving = true;
      try {
        const updated = await purchaseTransactionApi.updateTransaction(
          this.transaction.id,
          this.buildPayload()
        );
        this.$q.notify({
          type: "positive",
          message: "Transacción actualizada correctamente.",
        });
        this.$emit("saved", updated);
        this.$emit("input", false);
      } catch (error) {
        this.$q.notify({
          type: "negative",
          message:
            (error && error.message) ||
            "No fue posible actualizar la transacción.",
        });
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.edit-dialog {
  width: min(920px, 95vw);
  max-width: 95vw;
  border-radius: 12px;
}

.edit-section-title {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #475569;
}

.item-row {
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  background: #f8fafc;
}
</style>
