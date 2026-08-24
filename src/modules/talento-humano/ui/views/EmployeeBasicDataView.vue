<template>
  <q-page class="q-pa-md employee-page">
    <div class="employee-container">
      <EmployeeBasicDataForm :saving="saving" @save="handleSave" />
    </div>
  </q-page>
</template>

<script>
import EmployeeBasicDataForm from "src/modules/talento-humano/ui/components/EmployeeBasicDataForm.vue";
import { useTalentoHumanoStore } from "../store/useTalentoHumanoStore";
import { formToColaboradorDto } from "../utils/colaboradorFormMapper";
import { talentoHumanoRouteNames } from "../utils/talentoHumanoRoutes";

export default {
  name: "EmployeeBasicDataView",
  components: {
    EmployeeBasicDataForm,
  },
  data() {
    return {
      store: useTalentoHumanoStore(),
      saving: false,
    };
  },
  methods: {
    listaEmpleadosRouteName() {
      return talentoHumanoRouteNames(this.$route).listaEmpleados;
    },
    async handleSave(payload) {
      const dto = formToColaboradorDto(payload);
      this.saving = true;
      try {
        await this.store.createColaborador(dto);
        this.$q.notify({
          type: "positive",
          message: `Empleado ${payload.fullName || ""} registrado correctamente.`,
          icon: "check_circle",
        });
        this.$router.push({ name: this.listaEmpleadosRouteName() });
      } catch (e) {
        const errData = e && e.response && e.response.data;
        this.$q.notify({
          type: "negative",
          message:
            (errData && (errData.detail || errData.message)) ||
            (e && e.message) ||
            "No fue posible registrar el empleado.",
          icon: "error",
        });
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.employee-page {
  background: #f8fafc;
}

.employee-container {
  max-width: 1080px;
  margin: 0 auto;
}
</style>
