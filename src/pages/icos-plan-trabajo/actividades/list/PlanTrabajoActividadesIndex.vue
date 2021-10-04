<template>
  <div>
    <q-table
      title="Planes de trabajo"
      :data="icoPlanTrabajoDetalle"
      :columns="columns"
      row-key="name"
      @row-click="seleccionar"
      wrap-cells
      :loading="getPlanTrabajoState.loading"
      loading-label="Cargando información, por favor espere"
    >
      <template v-slot:top="props">
        <div class="col-8 q-table__title">Actividades del plan de trabajo</div>

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
      <q-btn
        fab
        icon="add"
        color="primary"
        :to="{ name: 'PlanTrabajoActividadCreate' }"
      >
        <q-tooltip>
          Agregar Actividad
        </q-tooltip>
      </q-btn>
    </q-page-sticky>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "IcoList",
  data() {
    return {
      evaluacionID: 0,
      icoPlanTrabajoDetalle: [],
      icoPlanTrabajo: null,
      columns: [
        {
          name: "indicador",
          align: "left",
          label: "Indicador evaluado",
          field: row => row.indicador.descripcion
        },
        {
          name: "calificacion",
          align: "left",
          label: "Calificacion",
          field: "calificacion"
        },
        {
          name: "actividad",
          align: "left",
          label: "Actividad",
          field: "actividad"
        },
        {
          name: "responsable",
          align: "left",
          label: "Responsable",
          field: "responsable"
        },
        {
          name: "cargo",
          align: "left",
          label: "Cargo",
          field: "cargo"
        },
        {
          name: "fecha_vencimiento",
          align: "left",
          label: "Fecha entrega",
          field: "fecha_vencimiento"
        }
      ]
    };
  },
  created() {
    this.evaluacionID = this.$route.params.id;
    this.buscarPlanTrabajoAction(this.evaluacionID).then(data => {
      console.log("detalle: ", data.detalle);
      this.icoPlanTrabajo = data;
      this.icoPlanTrabajoDetalle = data.detalle;
    });
  },
  methods: {
    ...mapActions("planTrabajo", ["buscarPlanTrabajoAction"]),
    seleccionar(evt, row, index) {
      this.$router.push({
        name: "PlanTrabajoActividadEdit",
        params: { actividadId: row.id }
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
