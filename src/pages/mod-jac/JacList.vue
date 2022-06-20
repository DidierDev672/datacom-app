<template>
    <div>
        <div class="text-h6 page-title-box" >Juntas de acciones comunales</div>
        <div class="q-ma-md bg-white"">
          <div v-if="filter.length > 0" class="row">
            <div class="col-xs-12px q-px-md q-pt-md">
              <p class="q-mb-none">Los resultados se filtran por: <b>{{ filter }}</b></p>
            </div>
          </div>
        <q-table
            title="Jacs"
            class="jac-table"
            :data="jacInfos"
            :columns="columns"
            separator="vertical"
            :pagination.sync="pagination"
            :filter="filter"
            flat
            :bordered="false"
            @request="onRequest"
            row-key="name"
            @row-click="seleccionar"
            :loading="getJacInfoState.loading"
            loading-label="Cargando información, por favor espere"
        >
            <template v-slot:top>
              <q-btn
                no-caps
                color="secondary"
                @click="showCrearNuevaJacForm = true"
                flat>Nueva Jac</q-btn>
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
                  <!-- <q-icon name="search" /> -->
                  <q-icon v-if="filter.length < 1" name="search" />
                  <q-icon v-else name="clear" @click="removeFilter()" />
                </template>
              </q-input>
            </template>

            <q-td slot="body-cell-acciones" slot-scope="props" :props="props">
                <q-btn flat round icon="edit" />
            </q-td>
        </q-table>
        </div>

        <!-- Formulario para crear una nueva Junta -->
        <crear-nueva-jac-form
          v-if="showCrearNuevaJacForm"
          @close="closeModal">
        </crear-nueva-jac-form>

    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import CrearNuevaJacForm from 'components/mod-jac/CrearNuevaJacForm';
import { TIPO_ENCUESTA } from 'src/utils/config';

export default {
    name: 'JacList',
    components: { CrearNuevaJacForm },
    data() {
        return {
          showCrearNuevaJacForm: false,
          filter: "",
          pagination: {
            sortBy: "id",
            descending: false,
            page: 1,
            rowsPerPage: 50,
            rowsNumber: 10
          },
            jacInfos: [],
            columns: [
                {
                    name: 'rut',
                    align: 'left',
                    label: 'Rut',
                    field: 'rut',
                    sortable: true,
                },
                {
                    name: 'ubicacion',
                    align: 'left',
                    label: 'Ubicacion',
                    field: 'ubicacion',
                    sortable: true,
                },
                {
                    name: 'jac',
                    align: 'left',
                    label: 'Jac',
                    field: 'jac',
                    sortable: true,
                },
                {
                    name: 'presidente',
                    align: 'left',
                    label: 'Representante legal',
                    field: 'presidente',
                    sortable: true,
                },
                {
                    name: 'celular',
                    align: 'left',
                    label: 'Celular',
                    field: 'celular',
                },
                {
                    name: 'usuario',
                    align: 'left',
                    label: 'Usuario',
                    field: 'usuario',
                },
                {
                    name: 'fecha',
                    align: 'left',
                    label: 'Fecha',
                    field: 'fecha',
                },
            ],
        };
    },
    created() {
      if(localStorage.getItem("filtroJac")){
        this.filter = localStorage.getItem("filtroJac");
      }
      this.onRequest({
        pagination: this.pagination,
        filter: this.filter
      });
    },
    methods: {
        ...mapActions('jacInfo', ['cargarListaJacInfoAction']),
        seleccionar(evt, row, index) {
            console.log('jacInfo: ', row);
            let jacID = row.id;
            // this.$router.push({ name: 'jac-info', params: { id: row.id } });
            this.$router.push({ name: 'jac-detalle-info-general', params: { id: row.id } });
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
          // this.cargarListaEncuestaEnProcesoAction({
          //   page: startRow,
          //   rowsPerPage: fetchCount,
          //   filter: filter
          //   // sort: `${sortBy},${descending ? "desc" : "asc"}`
          // }).then(response => {
          //   // update rowsCount with appropriate value
          //   this.pagination.rowsNumber = response.data.totalElements;
          //   // clear out existing data and add new
          //   this.encuestas.splice(
          //     0,
          //     this.encuestas.length,
          //     ...response.data.content
          //   );
          // });

          this.cargarListaJacInfoAction({
            page: startRow,
            rowsPerPage: fetchCount,
            filter: filter
          }).then(response => {
            //this.jacInfos = data;
            // update rowsCount with appropriate value
            this.pagination.rowsNumber = response.data.totalElements;
            // clear out existing data and add new
            this.jacInfos.splice(
              0,
              this.jacInfos.length,
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
          localStorage.setItem("filtroJac", this.filter);
        },

        removeFilter(){
          this.filter = '';
          localStorage.removeItem("filtroJac");
        },

        closeModal() {
            this.showCrearNuevaJacForm = false;
        },

    },
    computed: {
        ...mapGetters('jacInfo', ['getJacInfoState']),
    },
};
</script>

<style lang="sass" scoped>

.jac-table
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
