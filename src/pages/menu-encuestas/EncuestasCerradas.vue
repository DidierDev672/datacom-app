<template>
  <div>
    <q-table
      title="Encuestas en Proceso"
      :data="encuestas"
      :columns="columns"
      row-key="name"
      @row-click="seleccionar"
      :loading="getEncuestaState.loading"
      loading-label="Cargando información, por favor espere"
    >
      <template v-slot:top="props">
        <div class="col-4 q-table__title">Encuestas en Proceso</div>

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

      <q-td slot="body-cell-acciones" slot-scope="props" :props="props">
        <q-btn flat round icon="edit" />
      </q-td>
    </q-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { TIPO_ENCUESTA, CATEGORIAS } from "../../utils/config";
export default {
  data() {
    return {
      encuestas: [],
      columns: [
        { name: "id", align: "left", label: "#", field: "id", sortable: true },
        {
          name: "tipoEncuesta",
          align: "left",
          label: "Tipo de Encuesta",
          field: row => row.tipoEncuesta.title,
          sortable: true
        },
        {
          name: "descripcion",
          align: "left",
          label: "Descripción",
          field: "descripcion"
        },
        {
          name: "anio",
          align: "left",
          label: "Fecha de aplicación",
          field: row => row.anio + "-" + row.mes + "-" + row.dia,
          sortable: true
        },
        {
          name: "tipoEstudio",
          align: "left",
          label: "Tipo de Estudio",
          field: row => row.tipoEstudio.nombre
        },
        { name: "acciones", label: "", field: "acciones" }
      ]
    };
  },
  created() {
    this.cargarListaEncuestaCerradasAction().then(data => {
      this.encuestas = data;
    });
  },
  methods: {
    ...mapActions("encuesta", ["cargarListaEncuestaCerradasAction"]),
    seleccionar(evt, row, index) {
      console.log("Encuesta: ", row);
      let tipoEncuestaID = row.tipoEncuesta.id;
      switch (tipoEncuestaID) {
        case TIPO_ENCUESTA.VIVIENDA:
          console.log("Tipo encuesta vivienda");
          break;
        case TIPO_ENCUESTA.COMUNIDAD:
          console.log("Tipo encuesta comunidad");
          this.$router.push({ name: "c-info-general", params: { id: row.id } });

          break;
        case TIPO_ENCUESTA.MUNICIPIO:
          console.log("Tipo encuesta municipio");
          this.$router.push({ name: "ver-encuesta", params: { id: row.id } });
          break;
        default:
          console.log("Tipo encuesta JAC");
          this.$router.push({ name: "a-info-general", params: { id: row.id } });
          break;
      }
    }
  },
  computed: {
    ...mapGetters("encuesta", ["getEncuestaState"])
  }
};
</script>

<style></style>
