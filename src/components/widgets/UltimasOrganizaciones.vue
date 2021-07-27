<template>
  <div>
    <q-card class="my-card">
      <q-card-section>
        <div class="text-h6">Últimas organizaciones registradas</div>
        <div class="text-subtitle2">Datacom</div>
      </q-card-section>

      <q-table
        class="organizacion-table"
        :data="organizaciones"
        :columns="columns"
        row-key="name"
        wrap-cells
        :loading="getOrganizacionState.loading"
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
      organizaciones: [],
      columns: [
        {
          name: "municipio",
          align: "left",
          label: "Municipio",
          field: "municipio"
        },
        {
          name: "organizacion",
          align: "left",
          label: "Organizacion",
          field: "organizacion"
        },
        {
          name: "telefono",
          align: "left",
          label: "Teléfono",
          field: "telefono"
        }
      ]
    };
  },
  created() {
    this.cargarListaOrganizacionesRecientesAction().then(data => {
      this.organizaciones = data;
    });
  },
  methods: {
    ...mapActions("organizacion", ["cargarListaOrganizacionesRecientesAction"])
  },
  computed: {
    ...mapGetters("organizacion", ["getOrganizacionState"])
  }
};
</script>
