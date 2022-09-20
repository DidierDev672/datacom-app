<template>
    <div>
<q-table
      class="my-sticky-header-table"
      :data="data"
      :columns="columns"
      :filter="filter"
      @request="onRequest"
      @row-click="seleccionar"
      :pagination.sync="pagination"
      separator="vertical"
      row-key="name"
      flat
      bordered
      wrap-cells
    >
    <template v-slot:top="props">

        <q-space />
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Filtrar municipios"
          dark
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
    </q-table>
    <ficha-municipio-dialog :municipio="municipioId" v-if="showFichaMunicipioDialog" @close="closeFichaMunicipioDialog"></ficha-municipio-dialog>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import FichaMunicipioDialog from '../FichaMunicipioDialog.vue'
export default {
  components: {FichaMunicipioDialog},
  data () {
    return {
      showFichaMunicipioDialog: false,
      municipioId: 0,
        filter: "",
        pagination: {
            sortBy: "id",
            descending: false,
            page: 1,
            rowsPerPage: 50,
            rowsNumber: 10
        },
      columns: [
        {
          name: 'id',
          required: true,
          label: 'ID',
          align: 'left',
          field: 'id',
          sortable: true
        },
        {
          name: 'departamento',
          align: 'left',
          label: 'Depto',
          field: 'departamento',
          sortable: true
        },
        { name: 'municipio', align: 'left', label: 'Municipio', field: 'municipio', sortable: true },
        { name: 'alcalde', align: 'left', label: 'Alcalde', field: 'alcalde', sortable: true },
        { name: 'telefono', align: 'left', label: 'Teléfono', field: 'telefono', sortable: true },
        { name: 'direccion', align: 'left', label: 'Dirección', field: 'direccion', sortable: true },

      ],

      data: []
    }
  },
  created(){
      this.onRequest({
        pagination: this.pagination,
        filter: ""
    });
  },
  methods: {
      ...mapActions('buscar', ['buscarListaMunicipiosAction']),
      seleccionar(evt, row, index){
        this.$router.push({ name: "ver-encuesta", params: { id: row.id } });
      },
      closeFichaMunicipioDialog(){
        this.showFichaMunicipioDialog = false
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
      this.buscarListaMunicipiosAction({
        page: startRow,
        rowsPerPage: fetchCount,
        filter: filter
        // sort: `${sortBy},${descending ? "desc" : "asc"}`
      }).then(response => {
        // update rowsCount with appropriate value
        this.pagination.rowsNumber = response.data.totalElements;
        // clear out existing data and add new
        this.data.splice(
          0,
          this.data.length,
          ...response.data
        );
      });

      // don't forget to update local pagination object
      this.pagination.page = page;
      this.pagination.rowsPerPage = rowsPerPage;
      this.pagination.sortBy = sortBy;
      this.pagination.descending = descending;
    }
  }
}
</script>

<style lang="sass">

.my-sticky-header-table
  /* height or max-height is important */
  height: 410px

  .q-table__top,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #64ab9b
    color:#fff

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
