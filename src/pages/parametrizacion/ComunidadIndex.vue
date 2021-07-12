<template>
  <div>
    <q-table
      title="Comunidades"
      :data="comunidadList"
      :columns="columns"
      :loading="getComunidadState.loading"
      loading-label="Cargando información, por favor espere"
      row-key="codigo"
      wrap-cells
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
  name: "ComunidadIndex",
  data() {
    return {
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
          },
          sortable: true
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
    this.cargarListaComunidadAction().then(data => {
      console.log("Comunidad: ", data);
      this.comunidadList = data;
    });
  },
  methods: {
    ...mapActions("comunidad", ["cargarListaComunidadAction"])
  },
  computed: {
    ...mapGetters("comunidad", ["getComunidadState"])
  }
};
</script>

<style lang="scss" scoped></style>
