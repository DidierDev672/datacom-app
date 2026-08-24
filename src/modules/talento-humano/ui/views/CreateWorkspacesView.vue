<template>
  <q-page class="q-pa-md workspace-page">
    <div class="workspace-container">
      <WorkAreaRegistrationForm
        :existing-areas="areas"
        @save="handleSave"
      />
    </div>
  </q-page>
</template>

<script>
import WorkAreaRegistrationForm from "src/modules/orden-compra/ui/components/WorkAreaRegistrationForm.vue";

export default {
  name: "CreateWorkspacesView",
  components: {
    WorkAreaRegistrationForm,
  },
  data() {
    return {
      areas: [],
    };
  },
  methods: {
    handleSave(payload) {
      this.areas = [...this.areas, payload];
      this.$q.notify({
        type: "positive",
        message: "Workspace registered successfully.",
      });
    },
  },
};
</script>

<style scoped>
.workspace-page {
  background: #f8fafc;
}

.workspace-container {
  max-width: 940px;
  margin: 0 auto;
}
</style>
