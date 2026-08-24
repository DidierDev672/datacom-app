<template>
  <div class="q-pa-md budget-categories-page">
    <BudgetCategoriesList />
  </div>
</template>

<script>
import BudgetCategoriesList from "../components/BudgetCategoriesList.vue";

export default {
  name: "ListarBudgetCategoriesView",
  components: {
    BudgetCategoriesList,
  },
};
</script>

<style scoped>
.budget-categories-page {
  min-height: 100vh;
  background: #f8fafc;
}
</style>
