<template>
  <div>
    <div class="text-h6 page-title-box" >Evaluaciones ICO</div>
    <div class="q-ma-md bg-white">
      <div v-if="filter.length > 0" class="row">
        <div class="col q-px-md q-pt-md">
          <p class="q-mb-none">Los resultados se filtran por: <b>{{ filter }}</b></p>
        </div>
      </div>
      <q-table
        title="Evaluaciones Ico"
        class="ico-table"
        :data="icos"
        :columns="columns"
        separator="vertical"
        :pagination.sync="pagination"
        :filter="filter"
        @request="onRequest"
        row-key="name"
        @row-click="seleccionar"
        wrap-cells
        flat
        :bordered="false"
        :loading="getIcoState.loading"
        loading-label="Cargando información, por favor espere"
      >
        <template v-slot:top>
          <q-btn
            no-caps
            color="secondary"
            :to="{ name: 'IcoCreate' }"
            flat>Nuevo Ico</q-btn>
              <!-- <q-btn no-caps color="secondary" flat :to="{ name: 'PageJacCreate' }">Descargar Jacs</q-btn> -->
              <q-space />
              <q-input
                dense
                debounce="300"
                color="primary"
                v-model="filter"
                placeholder="Filtrar"
                @input="saveFilter()">
                <template v-slot:append>
                  <q-icon v-if="filter.length < 1" name="search" />
                  <q-icon v-else name="clear" @click="removeFilter()" />
                </template>
              </q-input>
            </template>

        <q-td slot="body-cell-descripcion" slot-scope="props" :props="props">
          {{ props.row.descripcion }}
          <q-badge v-if="props.row.offline" color="orange" label="OffLine" />
        </q-td>
      </q-table>
    </div>

  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { TIPO_ENCUESTA } from "src/utils/config";
import { openDB } from "idb";
export default {
  name: "IcoList",
  data() {
    return {
      filter: "",
      showCrearNuevIcoForm: false,
      icos: [],
      pagination: {
        sortBy: "id",
        descending: false,
        page: 1,
        rowsPerPage: 50,
        rowsNumber: 10
      },
      columns: [
        {
          name: "rut",
          align: "left",
          label: "NIT",
          field: "rut"
        },
        {
          name: "ubicacion",
          align: "left",
          label: "Ubicación",
          field: "ubicacion"
        },
        {
          name: "jac",
          align: "left",
          label: "Organización",
          field: "jac"
        },
        {
          name: "presidente",
          align: "left",
          label: "Representante Legal",
          field: "presidente"
        },
        {
          name: "celular",
          align: "left",
          label: "Teléfono",
          field: "celular"
        },
        {
          name: "evaluacion",
          align: "left",
          label: "Evaluación",
          field: "evaluacion"
        },
        {
          name: "puntaje",
          align: "left",
          label: "Puntaje",
          field: "puntaje"
        },
        {
          name: "encuestador",
          align: "left",
          label: "Encuestador",
          field: "encuestador"
        },
        {
          name: "fecha",
          align: "left",
          label: "Fecha",
          field: "fecha"
        }
      ]
    };
  },
  created() {
    if(localStorage.getItem("filtroIco")){
      this.filter = localStorage.getItem("filtroIco");
    }else{
      this.filter = JSON.parse(localStorage.getItem("user"));
    }
    this.onRequest({
      pagination: this.pagination,
      filter: this.filter
    });
  },
  methods: {
    ...mapActions("ico", ["cargarListaIcoAction"]),
    seleccionar(evt, row, index) {
      console.log("Ico: ", row);
      // let jacID = row.id;
      this.$router.push({ name: "IcoView", params: { id: row.evaluacionId } });
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

          this.cargarListaIcoAction({
            page: startRow,
            rowsPerPage: fetchCount,
            filter: filter
          }).then(response => {
            //this.jacInfos = data;
            // update rowsCount with appropriate value
            this.pagination.rowsNumber = response.data.totalElements;
            // clear out existing data and add new
            this.icos.splice(
              0,
              this.icos.length,
              ...response.data.content
            );
        });

          // don't forget to update local pagination object
          this.pagination.page = page;
          this.pagination.rowsPerPage = rowsPerPage;
          this.pagination.sortBy = sortBy;
          this.pagination.descending = descending;
        },

        saveFilter(){
          localStorage.setItem("filtroIco", this.filter);
        },

        removeFilter(){
          this.filter = '';
          localStorage.removeItem("filtroIco");
        }


  },
  computed: {
    ...mapGetters("ico", ["getIcoState"])
  }
};
</script>

<style lang="sass" scoped>

.ico-table
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
