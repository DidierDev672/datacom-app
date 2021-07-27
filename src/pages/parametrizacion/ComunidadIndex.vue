<template>
  <div>
    <q-table
      title="Comunidades"
      :data="comunidadList"
      :columns="columns"
      :loading="getComunidadState.loading"
      :pagination.sync="pagination"
      @request="onRequest"
      :filter="filter"
      loading-label="Cargando información, por favor espere"
      row-key="codigo"
      wrap-cells
    >
      <template v-slot:top-right>
        <q-input
          borderless
          dense
          debounce="300"
          v-model="filter"
          placeholder="Filtrar"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <q-td slot="body-cell-estado" slot-scope="props" :props="props">
        <q-badge v-if="props.row.estado" color="green" label="Activo" />
        <q-badge v-else color="red" label="Inactivo" />
      </q-td>

      <q-td slot="body-cell-estado" slot-scope="props" :props="props">
        <q-badge v-if="props.row.estado" color="green" label="Activo" />
        <q-badge v-else color="red" label="Inactivo" />
      </q-td>

      <!-- <q-td slot="body-cell-action" slot-scope="props" :props="props">
      <q-btn dense outline round type="button" color="primary" icon="edit" :to="{name: 'info-general', params: {id: props.row.id}}">
        <q-tooltip anchor="center left" self="center right">Editar registro</q-tooltip>
      </q-btn>
    </q-td> -->
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" :to="{ name: 'ComunidadCreate' }">
        <q-tooltip>
          Agregar comunidad
        </q-tooltip>
      </q-btn>
    </q-page-sticky>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "ComunidadIndex",
  data() {
    return {
      filter: "",
      pagination: {
        sortBy: "id",
        descending: false,
        page: 1,
        rowsPerPage: 7,
        rowsNumber: 10
      },
      comunidadList: [],
      columns: [
        {
          name: "municipio",
          align: "left",
          label: "Municipio",
          field: row => {
            return (
              row.municipio.codigoDane + " - " + row.municipio.nombreMunicipio
            );
          }
        },
        {
          name: "nombreComunidad",
          align: "left",
          label: "Comunidad",
          field: row => {
            return row.codigoDane + " " + row.nombreComunidad;
          }
        },
        { name: "estado", label: "Estado", field: "estado" },
        { name: "usuarioCreacion", label: "Usuario", field: "usuarioCreacion" }
        // { name: "action", align: "center", label: "Acciones" }
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
    ...mapActions("comunidad", ["cargarListaComunidadAction"]),
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
      this.cargarListaComunidadAction({
        page: startRow,
        rowsPerPage: fetchCount,
        filter: filter
        // sort: `${sortBy},${descending ? "desc" : "asc"}`
      }).then(response => {
        // update rowsCount with appropriate value
        this.pagination.rowsNumber = response.data.totalElements;
        // clear out existing data and add new
        this.comunidadList.splice(
          0,
          this.comunidadList.length,
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
    ...mapGetters("comunidad", ["getComunidadState"])
  }
};
</script>

<style lang="scss" scoped></style>
