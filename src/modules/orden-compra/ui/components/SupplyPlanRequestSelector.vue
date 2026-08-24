<template>
  <div class="selection-panel">
    <div class="selection-panel__content">
      <div v-if="value" class="selected-request relative-position">
        <q-inner-loading :showing="resolvingLinkage">
          <q-spinner-dots size="28px" color="primary" />
        </q-inner-loading>
        <div class="selected-request__label">Solicitud seleccionada</div>
        <div class="selected-request__title">
          {{ selectedTitle }}
        </div>
        <div class="selected-request__meta">
          <span>ID solicitud: {{ shortId(value.id) }}</span>
          <span v-if="planLabel(value)"> · {{ planLabel(value) }}</span>
          <span v-if="value.presupuestoDisponible">
            · {{ formatCurrency(value.presupuestoDisponible) }}
          </span>
        </div>
        <div class="selected-request__linkage">
          <div class="selected-request__linkage-item">
            <span class="selected-request__linkage-label">Orden de suministro</span>
            <span class="selected-request__linkage-value" :class="{ 'is-missing': !resolvedSupplyOrderId }">
              {{ resolvedSupplyOrderId || "Sin vínculo" }}
            </span>
          </div>
          <div class="selected-request__linkage-item">
            <span class="selected-request__linkage-label">Proveedor</span>
            <span class="selected-request__linkage-value" :class="{ 'is-missing': !resolvedSupplierId }">
              {{ resolvedSupplierId || "Sin proveedor asignado" }}
            </span>
          </div>
        </div>
        <q-banner v-if="linkageWarning" dense rounded class="bg-amber-1 text-amber-10 q-mt-sm">
          {{ linkageWarning }}
        </q-banner>
        <div class="selected-request__finance-grid">
          <div class="selected-request__finance-item">
            <span class="selected-request__finance-label">
              Presupuesto asignado
            </span>
            <span class="selected-request__finance-value">
              {{ formatCurrency(calculateAllocatedBudget(value)) }}
            </span>
          </div>
          <div class="selected-request__finance-item">
            <span class="selected-request__finance-label">
              Monto gastado en productos
            </span>
            <span class="selected-request__finance-value">
              {{ formatCurrency(calculateSpentAmount(value)) }}
            </span>
          </div>
          <div class="selected-request__finance-item">
            <span class="selected-request__finance-label">Saldo disponible</span>
            <span class="selected-request__finance-value">
              {{ formatCurrency(calculateAvailableBalance(value)) }}
            </span>
          </div>
        </div>
        <div class="selected-request__description ellipsis-2-lines">
          {{ value.descripcionNecesidad || "Sin descripción de necesidad." }}
        </div>
      </div>

      <div v-else class="selection-empty">
        <q-icon name="assignment_late" size="32px" color="grey-5" />
        <p>Aún no ha seleccionado una solicitud del plan de abastecimiento.</p>
      </div>
    </div>

    <div class="selection-panel__actions">
      <q-btn unelevated color="primary" icon="playlist_add_check" label="Seleccionar orden del plan" no-caps
        class="btn-select-request" @click="openRequestDialog" />
      <q-btn v-if="value" flat color="grey-7" icon="close" label="Quitar selección" no-caps @click="clearSelection" />
    </div>

    <SupplyPlanRequestsSelectModal v-model="showRequestDialog" dialog-title="Seleccionar requisiciónes"
      dialog-subtitle="Seleccione una requisición registrada para vincular la orden de suministro y el proveedor."
      @selected="selectRequest" />
  </div>
</template>

<script>
import { SolicitudHttpRepository } from "../../../solicitud-abastecimiento/infrastructure/SolicitudHttpRepository";
import SupplyPlanRequestsSelectModal from "../../../solicitud-abastecimiento/ui/components/SupplyPlanRequestsSelectModal.vue";
import { supplyOrderApi } from "../../infrastructure/SupplyOrderApi";
import {
  enrichRequestWithOrderLineItems,
  ensureSolicitudLineItems,
} from "../../utils/supplyOrderLinkage";
import {
  calculateAllocatedBudget,
  calculateAvailableBalance,
  calculateSpentAmount,
  formatCurrency,
  planLabel,
  shortId,
} from "../utils/purchaseOrderFinance";

export default {
  name: "SupplyPlanRequestSelector",

  components: {
    SupplyPlanRequestsSelectModal,
  },

  props: {
    value: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      showRequestDialog: false,
      resolvingLinkage: false,
      linkageWarning: null,
    };
  },

  computed: {
    selectedTitle() {
      if (!this.value) {
        return "Sin solicitud seleccionada";
      }
      if (this.value.nombreOrden && this.value.nombreOrden.trim()) {
        return this.value.nombreOrden.trim();
      }
      return this.value.subdireccion || "Sin subdirección";
    },
    resolvedSupplyOrderId() {
      if (!this.value) return "";
      return (
        this.value.supplyOrderId || this.value._resolvedSupplyOrderId || ""
      );
    },
    resolvedSupplierId() {
      if (!this.value) return "";
      return this.value.supplierId || this.value._resolvedSupplierId || "";
    },
  },

  methods: {
    shortId,
    planLabel,
    formatCurrency,
    calculateSpentAmount,
    calculateAllocatedBudget,
    calculateAvailableBalance,
    openRequestDialog() {
      this.showRequestDialog = true;
    },
    async selectRequest(request) {
      this.resolvingLinkage = true;
      this.linkageWarning = null;

      try {
        const linkage = await supplyOrderApi.resolveLinkageForRequest(request, {
          forceRefresh: true,
        });

        let selected = {
          ...request,
          supplyOrderId: linkage.supplyOrderId || "",
          supplierId: linkage.supplierId || "",
          _resolvedSupplyOrderId: linkage.supplyOrderId || "",
          _resolvedSupplierId: linkage.supplierId || "",
          _linkedSupplyOrder: linkage.linkedSupplyOrder || null,
        };

        const solicitudRepository = new SolicitudHttpRepository();
        selected = await ensureSolicitudLineItems(selected, solicitudRepository, {
          forceRefresh: true,
        });
        selected = await enrichRequestWithOrderLineItems(
          selected,
          supplyOrderApi
        );

        if (!selected.supplyOrderId) {
          this.linkageWarning =
            "La solicitud seleccionada no tiene una orden de suministro vinculada.";
        } else if (!selected.supplierId) {
          this.linkageWarning =
            "La orden de suministro no tiene proveedor asignado. Seleccione un proveedor antes de registrar.";
        }

        this.$emit("input", selected);
        this.$emit("selected", selected);
      } catch (error) {
        this.linkageWarning =
          error.message ||
          "No fue posible resolver el vínculo con la orden de suministro.";
        this.$emit("input", request);
        this.$emit("selected", request);
      } finally {
        this.resolvingLinkage = false;
      }
    },
    clearSelection() {
      this.linkageWarning = null;
      supplyOrderApi.clearApprovedOrdersCache();
      this.$emit("input", null);
      this.$emit("cleared");
    },
  },
};
</script>

<style scoped>
.selection-panel {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.selection-panel__content {
  width: 100%;
}

.selection-panel__actions {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.btn-select-request {
  border-radius: 8px;
  font-weight: 600;
  min-height: 40px;
  width: 100%;
  padding: 10px 18px;
}

.selection-empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 1rem 1.25rem;
  border: 1px dashed #cbd5e1;
  border-radius: 10px;
  background: #f8fafc;
  color: #64748b;
}

.selection-empty p {
  margin: 0;
  font-size: 0.9375rem;
}

.selected-request {
  padding: 1rem 1.25rem;
  border: 1px solid rgba(78, 156, 76, 0.25);
  border-radius: 10px;
  background: rgba(132, 178, 77, 0.08);
}

.selected-request__label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: #4e9c4c;
  margin-bottom: 4px;
}

.selected-request__title {
  font-size: 1.125rem;
  font-weight: 700;
  color: #0f172a;
}

.selected-request__meta {
  margin-top: 4px;
  font-size: 0.8125rem;
  color: #64748b;
}

.selected-request__linkage {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 8px;
}

.selected-request__linkage-item {
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.75);
}

.selected-request__linkage-label {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 2px;
}

.selected-request__linkage-value {
  display: block;
  font-size: 0.84rem;
  font-weight: 600;
  color: #0f172a;
  word-break: break-all;
}

.selected-request__linkage-value.is-missing {
  color: #b45309;
}

.selected-request__description {
  margin-top: 10px;
  font-size: 0.875rem;
  color: #475569;
  line-height: 1.45;
}

.selected-request__finance-grid {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  gap: 10px;
}

.selected-request__finance-item {
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(249, 115, 22, 0.18);
  background: linear-gradient(180deg,
      rgba(254, 242, 242, 0.95) 0%,
      rgba(255, 237, 213, 0.95) 100%);
}

.selected-request__finance-label {
  display: block;
  font-size: 0.76rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #7c2d12;
  margin-bottom: 4px;
}

.selected-request__finance-value {
  display: inline-block;
  font-size: 1rem;
  font-weight: 800;
  line-height: 1.2;
  background: linear-gradient(90deg,
      #dc2626 0%,
      #ef4444 38%,
      #f97316 72%,
      #fb923c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.ellipsis-2-lines {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .selection-panel__actions {
    grid-template-columns: 1fr;
  }
}
</style>
