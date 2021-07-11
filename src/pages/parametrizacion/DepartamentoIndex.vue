<template>
  <div>
    <q-table
      title="Departamentos"
      :data="departamentosList"
      :columns="columns"
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
  name: "DepartamentoIndex",
  data() {
    return {
      departamentosList: [],
      columns: [
        {
          name: "departamento",
          align: "left",
          label: "Departamento",
          field: row => {
            return row.codigo + " - " + row.nombreDepartamento;
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
    this.cargarListaDepartamentoAction().then(data => {
      this.departamentosList = data;
    });
  },
  methods: {
    ...mapActions("departamento", ["cargarListaDepartamentoAction"])
  }
};
</script>

<style lang="scss" scoped></style>
