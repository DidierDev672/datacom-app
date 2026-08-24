<template>
  <div class="q-pa-md transactions-page">
    <PurchaseTransactionsList />
  </div>
</template>

<script>
import PurchaseTransactionsList from "../components/PurchaseTransactionsList.vue";

export default {
  name: "PurchaseTransactionsListView",
  components: {
    PurchaseTransactionsList,
  },
};
</script>

<style scoped>
.transactions-page {
  min-height: 100vh;
  background: #f8fafc;
}
</style>
