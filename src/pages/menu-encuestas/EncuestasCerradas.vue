<template>
  <div>
    <q-table
      title="Encuestas Cerradas"
      :data="encuestas"
      :columns="columns"
      row-key="name"
      :pagination.sync="pagination"
      @request="onRequest"
      @row-click="seleccionar"
      :loading="getEncuestaState.loading"
      loading-label="Cargando información, por favor espere"
    >
      <template v-slot:top="props">
        <div class="col-4 q-table__title">Encuestas Cerradas</div>

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
        <q-btn flat round icon="ti-zoom-in" />
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
      filter: "",
      pagination: {
        sortBy: "id",
        descending: false,
        page: 1,
        rowsPerPage: 10,
        rowsNumber: 10
      },
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
        {
          name: "usuarioCreacion",
          align: "left",
          label: "Usuario",
          field: "usuarioCreacion"
        },
        { name: "acciones", label: "", field: "acciones" }
      ]
    };
  },
  created() {
    // this.cargarListaEncuestaCerradasAction().then(data => {
    //   this.encuestas = data;
    // });
    this.onRequest({
      pagination: this.pagination,
      filter: ""
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
          this.$router.push({ name: "v-ver-encuesta", params: { id: row.id } });
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
    },
    onRequest(props) {
      const { page, rowsPerPage, sortBy, descending } = props.pagination;
      const filter = props.filter;

      // get all rows if "All" (0) is selected
      const fetchCount =
        rowsPerPage === 0 ? this.pagination.rowsNumber : rowsPerPage;

      // calculate starting row of data
      // const startRow = (page - 1) * rowsPerPage;
      const startRow = page - 1;

      // fetch data from "server"
      this.cargarListaEncuestaCerradasAction({
        page: startRow,
        rowsPerPage: fetchCount,
        filter: filter
        // sort: `${sortBy},${descending ? "desc" : "asc"}`
      }).then(response => {
        // update rowsCount with appropriate value
        this.pagination.rowsNumber = response.data.totalElements;
        // clear out existing data and add new
        this.encuestas.splice(
          0,
          this.encuestas.length,
          ...response.data.content
        );
      });

      // don't forget to update local pagination object
      this.pagination.page = page;
      this.pagination.rowsPerPage = rowsPerPage;
      this.pagination.sortBy = sortBy;
      this.pagination.descending = descending;
    }
  },
  computed: {
    ...mapGetters("encuesta", ["getEncuestaState"])
  }
};
</script>

<style></style>
