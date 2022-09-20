<template>
  <div>
    <div class="text-h6 page-title-box" >Actividades del Plan de Trabajo</div>
    <div class="q-ma-md bg-white">
      <q-table
        class="actividades-table"
        :data="icoPlanTrabajoDetalle"
        :columns="columns"
        row-key="name"
        @row-click="seleccionar"
        :rows-per-page-options="[50, 100]"
        wrap-cells
        :loading="getPlanTrabajoState.loading"
        loading-label="Cargando información, por favor espere"
      >
      <template v-slot:top>
          <q-btn
            no-caps
            color="secondary"
            :to="{ name: 'PlanTrabajoActividadCreate' }"
            flat>Agregar actividad</q-btn>
            <q-space />
            <q-btn flat no-caps dense label="Download" @click="descargarPdf()" />

            </template>
      </q-table>
    </div>
    <!-- <q-page-sticky position="bottom-right" :offset="[18, 18]">
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
    </q-page-sticky> -->
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from 'axios';
import { URL_API } from '../../../../utils/config';
export default {
  name: "IcoList",
  data() {
    return {
      evaluacionID: 0,
      activarDescarga: false,
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
    },
    descargarPdf() {
      this.activarDescarga = true;
      const url_service = 'reportes-plan-trabajo';
      axios.get(`${URL_API}/${url_service}/organizacion/${this.evaluacionID}/`, { responseType: 'blob' })
      .then( ({data}) => {
          console.log(data)
          setTimeout(() => {
            const url = window.URL.createObjectURL(data);
              console.log('Url: ', url)
              const a = document.createElement('a');
              a.setAttribute('style', 'display:none;');
              document.body.appendChild(a);
              a.href = url;
              a.download = `Plan de trabajo.pdf`;
              a.click();
              this.activarDescarga = false;
              return url;

          }, 500)
      })
      .catch( (error) => {
        this.activarDescarga = false;
          console.log('Error: ',error);
      })
    },
  },
  computed: {
    ...mapGetters("planTrabajo", ["getPlanTrabajoState"])
  }
};
</script>

<style lang="sass" scoped>

.actividades-table
  /* height or max-height is important */
  height: 75vh

  thead tr th
    position: sticky
    z-index: 1
  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px

</style>
