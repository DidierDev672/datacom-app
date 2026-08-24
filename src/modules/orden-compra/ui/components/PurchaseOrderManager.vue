<template>
  <div class="purchase-order-manager">
    <q-card class="manager-card shadow-lg rounded-lg">
      <q-card-section class="header-gradient text-white q-pa-lg">
        <div class="text-h5 text-weight-bold text-white">
          Gestión de órdenes de compra
        </div>
        <div class="text-caption opacity-80 q-mt-xs">
          Seleccione una solicitud aceptada del plan de abastecimiento para
          iniciar la orden.
        </div>
      </q-card-section>

      <q-card-section class="q-pa-lg">
        <SupplyPlanRequestSelector
          :value="selectedRequest"
          @input="onRequestSelected"
          @selected="onRequestSelected"
          @cleared="onRequestCleared"
        />

        <PurchaseOrderStatusSelector
          :value="selectedOrderStatus"
          @input="onStatusInput"
          @change="onStatusChange"
        />

        <PurchaseOrderRegistrationPanel
          :selected-request="selectedRequest"
          @purchase-manager-selected="onPurchaseManagerSelected"
          @requesting-area-selected="onRequestingAreaSelected"
          @transaction-registered="onTransactionRegistered"
          @registration-cleared="onRegistrationCleared"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import SupplyPlanRequestSelector from "./SupplyPlanRequestSelector.vue";
import PurchaseOrderStatusSelector from "./PurchaseOrderStatusSelector.vue";
import PurchaseOrderRegistrationPanel from "./PurchaseOrderRegistrationPanel.vue";

export default {
  name: "PurchaseOrderManager",

  components: {
    SupplyPlanRequestSelector,
    PurchaseOrderStatusSelector,
    PurchaseOrderRegistrationPanel,
  },

  data() {
    return {
      selectedRequest: null,
      selectedOrderStatus: null,
    };
  },

  methods: {
    onRequestSelected(request) {
      this.selectedRequest = request;
      this.$emit("request-selected", request);
    },
    onRequestCleared() {
      this.selectedRequest = null;
      this.$emit("request-cleared");
    },
    onStatusInput(value) {
      this.selectedOrderStatus = value;
    },
    onStatusChange(payload) {
      this.$emit("status-changed", payload);
    },
    onPurchaseManagerSelected(manager) {
      this.$emit("purchase-manager-selected", manager);
    },
    onRequestingAreaSelected(area) {
      this.$emit("requesting-area-selected", area);
    },
    onTransactionRegistered(result) {
      this.$emit("transaction-registered", result);
    },
    onRegistrationCleared() {
      this.selectedRequest = null;
      this.selectedOrderStatus = null;
      this.$emit("request-cleared");
      this.$emit("registration-cleared");
    },
  },
};
</script>

<style scoped>
.purchase-order-manager {
  max-width: 960px;
  margin: 0 auto;
}

.manager-card {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.header-gradient {
  background: linear-gradient(135deg, #84b24d 0%, #75af7e 50%, #4e9c4c 100%);
}
</style>
