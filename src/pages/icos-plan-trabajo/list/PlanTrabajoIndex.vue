<template>
  <div>
    <q-table
      title="Planes de trabajo"
      :data="getPlanTrabajoState.lista"
      :columns="columns"
      row-key="name"
      @row-click="seleccionar"
      wrap-cells
      :loading="getPlanTrabajoState.loading"
      loading-label="Cargando información, por favor espere"
    >
      <template v-slot:top="props">
        <div class="col-8 q-table__title">Planes de trabajo</div>

        <q-space />
        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
          class="q-ml-md"
        />
      </template>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" :to="{ name: 'PlanTrabajoCreate' }">
        <q-tooltip>
          Agregar Plan de Trabajo
        </q-tooltip>
      </q-btn>
    </q-page-sticky>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "IcoList",
  data() {
    return {
      columns: [
        {
          name: "titulo",
          align: "left",
          label: "Descripción del plan",
          field: "titulo"
        },
        {
          name: "ja",
          align: "left",
          label: "Organización",
          field: row => row.jac.nombre
        },
        {
          name: "fechaCreacion",
          align: "left",
          label: "Fecha registro",
          field: "fechaCreacion"
        }
      ]
    };
  },
  created() {},
  methods: {
    seleccionar(evt, row, index) {
      this.$router.push({
        name: "PlanTrabajoActividades",
        params: { id: row.id }
      });
    }
  },
  computed: {
    ...mapGetters("planTrabajo", ["getPlanTrabajoState"])
  }
};
</script>

<style scoped lang="sass">
.jac-creada-offline
  tbody tr
    background-color: #c1f4cd
</style>
