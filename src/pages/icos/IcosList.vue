<template>
  <div>
    <div class="text-h6 page-title-box" >Evaluaciones ICO</div>
    <div class="q-ma-md">
      <q-table
        title="Evaluaciones ICO"
        class="my-sticky-header-table"
        :data="encuestas"
        :columns="columns"
        row-key="name"
        @row-click="seleccionar"
        :loading="getEncuestaState.loading"
        loading-label="Cargando información, por favor espere"
      >
        <template v-slot:top="props">
          <div class="col-4 q-table__title">Evaluaciones ICO</div>

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
          <q-btn flat round icon="ti-check" />
        </q-td>
      </q-table>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          fab
          icon="add"
          color="primary"
          :to="{ name: 'nueva-encuesta', params: { id: encuestaTipoICO } }"
        >
          <q-tooltip>
            Agregar Ico
          </q-tooltip>
        </q-btn>
      </q-page-sticky>
    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { TIPO_ENCUESTA, CATEGORIAS } from "../../utils/config";
export default {
  data() {
    return {
      encuestas: [],
      encuestaTipoICO: 4,
      columns: [
        { name: "id", align: "left", label: "#", field: "id", sortable: true },
        {
          name: "comunidad",
          align: "left",
          label: "Comunidad",
          field: "comunidad",
          sortable: true
        },
        { name: "rut", align: "left", label: "Nit", field: "rut" },
        {
          name: "organizacion",
          align: "left",
          label: "Organización",
          field: "organizacion",
          sortable: true
        },
        {
          name: "puntaje",
          align: "left",
          label: "Calificación",
          field: "calificacion"
        },
        {
          name: "fecha",
          align: "left",
          label: "Fecha Evaluación",
          field: "fecha"
        },
        { name: "acciones", label: "", field: "acciones" }
      ]
    };
  },
  created() {
    this.cargarListaEncuestaPorTipoAction(TIPO_ENCUESTA.JAC).then(data => {
      this.encuestas = data;
    });
  },
  methods: {
    ...mapActions("encuesta", ["cargarListaEncuestaPorTipoAction"]),
    ...mapMutations("detalleAutoevaluacion", [
      "setDetalleAutoevaluacionSuccess"
    ]),
    seleccionar(evt, row, index) {
      this.setDetalleAutoevaluacionSuccess(row);
      this.$router.push({ name: "icos-view", params: { id: row.id } });
    }
  },
  computed: {
    ...mapGetters("encuesta", ["getEncuestaState"])
  }
};
</script>

<style></style>
