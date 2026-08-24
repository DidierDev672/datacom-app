<template>
  <div class="q-pa-md comparisons-page">
    <SupplierComparisonsList />
  </div>
</template>

<script>
import SupplierComparisonsList from "../components/SupplierComparisonsList.vue";

export default {
  name: "SupplierComparisonsListView",
  components: {
    SupplierComparisonsList,
  },
};
</script>

<style scoped>
.comparisons-page {
  min-height: 100vh;
  background: #f8fafc;
}
</style>
