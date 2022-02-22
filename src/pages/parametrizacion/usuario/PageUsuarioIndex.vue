<template>
  <div>
    <q-table
      title="Usuarios"
      :data="usuariosList"
      :columns="columns"
      row-key="name"
      @row-click="seleccionar"
      :loading="getUsuarioState.loading"
      loading-label="Cargando información, por favor espere"
    >
      <template v-slot:top="props">
        <div class="col-4 q-table__title">Usuarios</div>

        <q-space />
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
        <q-btn flat round icon="edit" />
      </q-td>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" :to="{ name: 'PageUsuarioCreate' }">
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "UsuariosIndex",
  data() {
    return {
      usuariosList: [],
      columns: [
        {
          name: "identificacion",
          align: "left",
          label: "Identificación",
          field: row => row.tercero.identificacion,
          sortable: true
        },
        {
          name: "nombre",
          align: "left",
          label: "Nombre",
          field: row => row.tercero.primerNombre,
          sortable: true
        },
        {
          name: "email",
          align: "left",
          label: "Email",
          field: row => row.tercero.email
        },
        {
          name: "telefono",
          align: "left",
          label: "Teléfono",
          field: row => row.tercero.telefono,
          sortable: true
        },
        { name: "username", align: "left", label: "Cuenta", field: "username" },
        { name: "acciones", label: "", field: "acciones" }
      ]
    };
  },
  created() {
    this.cargarListaUsuarioAction().then(data => {
      console.log("Usuarios: ", data);
      this.usuariosList = data;
    });
  },
  methods: {
    ...mapActions("usuario", ["cargarListaUsuarioAction"]),
    seleccionar(evt, row, index) {
      console.log(row);
      this.$router.push({
        name: "PageUsuarioEdit",
        params: { id: row.id }
      });
    }
  },
  computed: {
    ...mapGetters("usuario", ["getUsuarioState"])
  }
};
</script>

<style lang="scss" scoped></style>
