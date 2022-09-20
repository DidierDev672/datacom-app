<template>
  <div>
    <div class="text-h6 page-title-box" >Planes de Trabajo</div>
    <div class="q-ma-md bg-white">
      <div v-if="filter.length > 0" class="row">
        <div class="col q-px-md q-pt-md">
          <p class="q-mb-none">Los resultados se filtran por: <b>{{ filter }}</b></p>
        </div>
      </div>
      <q-table
        title="Planes de trabajo"
        :data="planes"
        class="planes-table"
        :columns="columns"
        separator="vertical"
        :pagination.sync="pagination"
        :filter="filter"
        @request="onRequest"
        row-key="name"
        wrap-cells
        flat
        :bordered="false"
        :loading="getPlanTrabajoState.loading"
        loading-label="Cargando información, por favor espere"
      >
        <template v-slot:top>
          <q-btn
            no-caps
            color="secondary"
            :to="{ name: 'PlanTrabajoCreate' }"
            flat>Nuevo Plan de Trabajo</q-btn>
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
            <q-td slot="body-cell-acciones" slot-scope="props" :props="props">
              <q-btn color="grey-7" round flat icon="more_vert" :disable="activarDescarga">
                <q-menu cover auto-close>
                  <q-list>
                    <q-item clickable @click="seleccionar(props.row)">
                      <q-item-section>Ver plan</q-item-section>
                    </q-item>
                    <q-item clickable @click="descargarPdf(props.row)">
                      <q-item-section>Descargar PDF</q-item-section>
                    </q-item>
                    <!-- <q-item clickable>
                      <q-item-section>Share</q-item-section>
                    </q-item> -->
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
      </q-table>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from 'axios';
import { URL_API } from '../../../utils/config';
export default {
  name: "PlanTrabajoIndex",
  data() {
    return {
      filter: "",
      activarDescarga: false,
      pagination: {
        sortBy: "id",
        descending: false,
        page: 1,
        rowsPerPage: 50,
        rowsNumber: 10
      },
      planes: [],
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
          name: "titulo",
          align: "left",
          label: "Descripción del plan",
          field: "titulo"
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
        },
        { name: "acciones", label: "", field: "acciones" }
      ]
    };
  },
  created() {
    if(localStorage.getItem("filtroPlanDeTrabajo")){
      this.filter = localStorage.getItem("filtroPlanDeTrabajo");
    }else{
      this.filter = JSON.parse(localStorage.getItem("user"));
    }

    this.onRequest({
      pagination: this.pagination,
      filter: this.filter
    });

  },
  methods: {
    ...mapActions("planTrabajo", ["cargarListaPlanTrabajoAction"]),
    seleccionar( row ) {
      console.log(row)
      this.$router.push({
        name: "PlanTrabajoActividadesIndex",
        params: { id: row.evaluacionId }
      });
    },

    descargarPdf( row ) {
      console.log('Registro: ',row)
      this.activarDescarga = true;
      const url_service = 'reportes-plan-trabajo';
      axios.get(`${URL_API}/${url_service}/organizacion/${row.evaluacionId}/`, { responseType: 'blob' })
      .then( ({data}) => {
          console.log(data)
          setTimeout(() => {
            const url = window.URL.createObjectURL(data);
              console.log('Url: ', url)
              const a = document.createElement('a');
              a.setAttribute('style', 'display:none;');
              document.body.appendChild(a);
              a.href = url;
              a.download = `${row.jac}-${row.titulo}.pdf`;
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

      this.cargarListaPlanTrabajoAction({
        page: startRow,
        rowsPerPage: fetchCount,
        filter: filter
      }).then(response => {
        //this.jacInfos = data;
        // update rowsCount with appropriate value
        this.pagination.rowsNumber = response.data.totalElements;
        // clear out existing data and add new
        this.planes.splice(
          0,
          this.planes.length,
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
      localStorage.setItem("filtroPlanDeTrabajo", this.filter);
    },

    removeFilter(){
      this.filter = '';
      localStorage.removeItem("filtroPlanDeTrabajo");
    }
  },
  computed: {
    ...mapGetters("planTrabajo", ["getPlanTrabajoState"])
  }
};
</script>

<style lang="sass" scoped>

.planes-table
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
