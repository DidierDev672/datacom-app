<template>
  <div>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Encuestas por departamentos</div>
        <div class="text-subtitle2">Datacom</div>
      </q-card-section>

      <q-table
        class="organizacion-table"
        :data="encuestasPorDepartamentos"
        :columns="columns"
        row-key="name"
        wrap-cells
        :loading="loading"
        loading-label="Cargando información, por favor espere"
      ></q-table>
    </q-card>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "WidgetUltimasOrganizaciones",
  data() {
    return {
      loading: false,
      encuestasPorDepartamentos: [],
      columns: [
        {
          name: "departamento",
          align: "left",
          label: "Departamento",
          field: "departamento"
        },
        {
          name: "cant",
          align: "left",
          label: "Cant.",
          field: "cant"
        }
      ]
    };
  },
  created() {
    this.loading = true;
    this.cargarTotalEncuestasPorDepartamentosAction().then(data => {
      this.encuestasPorDepartamentos = data;
      this.loading = false;
    });
  },
  methods: {
    ...mapActions("encuesta", ["cargarTotalEncuestasPorDepartamentosAction"])
  }
};
</script>
