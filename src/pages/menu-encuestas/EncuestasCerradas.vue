<template>
  <div>
    <div class="text-h6 page-title-box" >Encuestas cerradas</div>
    <div class="q-ma-md">
      <q-table
      title="Encuestas Cerradas"
      class="my-sticky-header-table"
      :data="encuestas"
      :columns="columns"
      row-key="name"
      :pagination.sync="pagination"
      :filter="filter"
      @request="onRequest"
      @row-click="seleccionar"
      :loading="getEncuestaState.loading"
      loading-label="Cargando información, por favor espere"
    >
      <template v-slot:top="props">
        <div class="col-4 q-table__title">Listado de encuestas</div>

        <q-space />
        <q-input
          borderless
          dark
          dense
          debounce="300"
          v-model="filter"
          placeholder="Filtrar resultados"
        >
          <template v-slot:prepend>
            <q-icon name="search" />
          </template>
        </q-input>
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
          field: row => row.tipoEncuesta,
          sortable: true
        },
        {
          name: "descripcion",
          align: "left",
          label: "Descripción",
          field: "descripcion"
        },
        {
          name: "fecha",
          align: "left",
          label: "Fecha de aplicación",
          field: row => row.fecha,
          sortable: true
        },
        {
          name: "tipoEstudio",
          align: "left",
          label: "Tipo de Estudio",
          field: row => row.tipoEstudio
        },
        {
          name: "usuario",
          align: "left",
          label: "Usuario",
          field: "usuario"
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
      let tipoEncuestaID = row.tipoEncuestaId;
      switch (tipoEncuestaID) {
        case TIPO_ENCUESTA.VIVIENDA:
          console.log("Tipo encuesta vivienda");
          this.$router.push({ name: "v-ver-encuesta", params: { id: row.id } });
          break;
        case TIPO_ENCUESTA.COMUNIDAD:
          console.log("Tipo encuesta comunidad");
          //this.$router.push({ name: "c-info-general", params: { id: row.id } });
          this.$router.push({ name: "c-ver-encuesta", params: { id: row.id } });

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

      //Filtramos solo cuando la persona ha escrito 3 caracteres en el control
      if(filter.length > 0 && filter.length < 3){
        return
      }

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
