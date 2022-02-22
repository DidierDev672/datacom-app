<template>
  <q-page>
    <div class="row q-col-gutter-sm q-pa-sm">
      <div class="col-xs-12">
        <q-select
          outlined
          option-value="codigo"
          option-label="descripcion"
          v-model="l"
          :options="lstCategoria"
          @input="cargarParametrosPorcategoria(l)"
          label="Seleccione el tipo de categoria"
        />
      </div>
    </div>

    <q-table
      title="Parámetros"
      :data="lstParametro"
      :columns="columns"
      row-key="name"
      @row-click="seleccionar"
    >
      <q-td slot="body-cell-descripcion" slot-scope="props" :props="props">
        {{ props.row.descripcion }}
        <q-badge v-if="props.row.offline" color="orange" label="OffLine" />
      </q-td>

      <q-td slot="body-cell-estado" slot-scope="props" :props="props">
        <q-badge v-if="props.row.estado" color="green" label="Activo" />
        <q-badge v-else color="red" label="Inactivo" />
      </q-td>
    </q-table>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" :to="{ name: 'PageParametroCreate' }">
        <q-tooltip>
          Agregar Parametro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>
  </q-page>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import { cargarListaParametroPorCategoriaAction } from "src/store/module-parametrizacion/parametros/actions";
export default {
  name: "PageParametros",
  data() {
    return {
      l: "",
      lstParametro: [],
      lstCategoria: [],
      columns: [
        // {
        //   name: "codigo",
        //   align: "left",
        //   label: "Código",
        //   field: "codigo",
        //   sortable: true
        // },
        {
          name: "nombre",
          align: "left",
          label: "Parámetro",
          field: "nombre",
          sortable: true
        },
        {
          name: "fechaCreacion",
          label: "Fecha",
          field: "fechaCreacion",
          sortable: true
        },
        { name: "estado", label: "Estado", field: "estado" },
        { name: "usuarioCreacion", label: "Usuario", field: "usuarioCreacion" }
      ],
      model: null
    };
  },
  created() {
    this.cargarListaParametroAction().then(data => {
      this.lstParametro = [...data];
    });
    this.cargarListaCategoriasAction().then(response => {
      this.lstCategoria = [...response];
    });
  },
  methods: {
    ...mapActions("parametros", [
      "cargarListaParametroAction",
      "cargarListaParametroPorCategoriaAction"
    ]),
    ...mapActions("categoria", ["cargarListaCategoriasAction"]),
    ...mapMutations("parametros", ["setListaParametroSuccess"]),
    ...mapMutations("parametros", ["setParametroSuccess"]),
    ...mapMutations("categoria", ["setCategoriaSuccess"]),
    seleccionar(evt, row, index) {
      this.setParametroSuccess(row);
      this.$router.push({ name: "PageParametroEdit", params: { id: row.id } });
    },
    cargarParametrosPorcategoria(valor) {
      console.log("cargo datos " + valor.id);
      this.cargarListaParametroPorCategoriaAction(valor.codigo).then(data => {
        console.log(data);
        this.lstParametro = [...data];
      });
    }
  },
  computed: {
    ...mapGetters("parametros", ["getParametroState"]),
    parametros() {
      // return this.getCategoriaState.lstCategorias
      return this.getParametroState.lstParametro;
    }
  }
};
</script>

<style scoped></style>
