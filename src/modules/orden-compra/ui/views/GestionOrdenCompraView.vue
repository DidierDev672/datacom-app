<template>
  <div class="q-pa-md page-wrapper">
    <PurchaseOrderManager @request-selected="onRequestSelected" />
  </div>
</template>

<script>
import PurchaseOrderManager from '../components/PurchaseOrderManager.vue';

export default {
  name: 'GestionOrdenCompraView',
  components: {
    PurchaseOrderManager
  },
  methods: {
    onRequestSelected(request) {
      if (this.$q) {
        this.$q.notify({
          type: 'positive',
          message: `Solicitud ${request.subdireccion || ''} seleccionada.`,
          timeout: 2000
        });
      }
    }
  }
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
  background: #f8fafc;
}
</style>
