<template>
  <div>
    <q-table
      title="Municipios"
      :data="lstMunicipios"
      :columns="columns"
      row-key="codigo"
      :loading="getMunicipioState.loading"
      loading-label="Cargando información, por favor espere"
      wrap-cells
      @row-click="seleccionar"
    >
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
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "PageListaMunicipios",
  data() {
    return {
      lstMunicipios: [],
      columns: [
        {
          name: "departamento",
          align: "left",
          label: "Departamento",
          field: row => {
            return (
              row.departamento.codigo +
              " - " +
              row.departamento.nombreDepartamento
            );
          },
          sortable: true
        },
        {
          name: "municipio",
          align: "left",
          label: "Municipio",
          field: row => {
            return row.codigoDane + " - " + row.nombreMunicipio;
          },
          sortable: true
        },
        { name: "estado", label: "Estado", field: "estado" },
        { name: "usuarioCreacion", label: "Usuario", field: "usuarioCreacion" }
        // { name: "action", align: "center", label: "Acciones" }
      ]
    };
  },
  created() {
    this.cargarListaMunicipiosAction().then(data => {
      this.lstMunicipios = data;
    });
  },
  methods: {
    ...mapActions("municipios", ["cargarListaMunicipiosAction"]),
    seleccionar(evt, row, index) {
      // this.setCategoriaSuccess(row)
      // this.$router.push({ name: 'categoria', params: { id: row.id } })
    }
  },
  computed: {
    ...mapGetters("municipios", ["getMunicipioState"])
  }
};
</script>

<style></style>
