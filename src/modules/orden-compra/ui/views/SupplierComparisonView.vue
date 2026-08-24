<template>
  <div class="q-pa-md page-wrapper">
    <SupplierComparisonPanel
      @comparison-confirmed="onComparisonConfirmed"
      @comparisons-cleared="onComparisonsCleared"
    />
  </div>
</template>

<script>
import SupplierComparisonPanel from "../components/SupplierComparisonPanel.vue";

export default {
  name: "SupplierComparisonView",
  components: {
    SupplierComparisonPanel,
  },
  methods: {
    onComparisonConfirmed() {
      // El panel registra, notifica y limpia el formulario automáticamente.
    },
    onComparisonsCleared() {
      if (this.$q) {
        this.$q.notify({
          type: "info",
          message: "El historial quedó vacío. Ya puede generar nuevas comparaciones.",
          timeout: 2500,
        });
      }
    },
  },
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: #f8fafc;
}
</style>
