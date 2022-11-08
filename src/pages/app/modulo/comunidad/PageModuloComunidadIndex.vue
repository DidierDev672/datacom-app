<template>
  <div>
    <div class="text-h6 page-title-box" >Comunidades</div>
    <div class="q-ma-md">
      <q-table
      title="Encuestas de Comunidad"
      class="my-sticky-header-table"
      :data="encuestas"
      :columns="columns"
      wrap-cells
      separator="vertical"
      row-key="name"
      :pagination.sync="pagination"
      :filter="filter"
      @request="onRequest"
      @row-click="seleccionar"
      :loading="getEncuestaState.loading"
      loading-label="Cargando información, por favor espere"
    >
      <template v-slot:top="props">
        <div class="col-4 q-table__title">Listado de Comunidades</div>

        <q-space />
        <q-input
          borderless
          dark
          dense
          debounce="300"
          v-model="filter"
          placeholder="Filtrar comunidades"
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
import { TIPO_ENCUESTA, CATEGORIAS } from "../../../../utils/config";
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
          name: "departamento",
          align: "left",
          label: "Departamento",
          field: "departamento",
          sortable: true
        },
        {
          name: "municipio",
          align: "left",
          label: "Municipio",
          field: "municipio",
          sortable: true
        },
        {
          name: "comunidad",
          align: "left",
          label: "Comunidad",
          field: "comunidad",
          sortable: true
        },
        {
          name: "fecha",
          align: "left",
          label: "Fecha",
          field: "fecha",
          sortable: true
        },
        {
          name: "tipoEstudio",
          align: "left",
          label: "Tipo de Estudio",
          field: "tipoEstudio"
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
    this.onRequest({
      pagination: this.pagination,
      filter: ""
    });
  },
  methods: {
    ...mapActions("encuestasComunidad", ["cargarListaEncuestasComunidadAction"]),
    seleccionar(evt, row, index) {
      //console.log("Encuesta: ", row);
      //let tipoEncuestaID = row.tipoEncuestaId;
      this.$router.push({ name: "c-ver-encuesta", params: { id: row.id } });
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
      this.cargarListaEncuestasComunidadAction({
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
