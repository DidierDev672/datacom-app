<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <p class="text-h6 q-mt-md q-mb-sm">Productos de la Vivienda</p>

        <productos-card
          v-for="prod in getProductoViviendaState.lista"
          class="q-mb-sm"
          @editar="editarInfo"
          @eliminar="eliminarInfo"
          :producto="prod"
          :key="prod.id"
        />

        <div class="flex justify-center">
          <q-btn
            label="Anterior"
            no-caps
            color="primary"
            flat
            class="q-mr-sm"
            :to="{ name: 'personas-vivienda', params: { id: this.viviendaID } }"
          />
          <q-btn
            label="Guardar y continuar"
            no-caps
            color="primary"
            :to="{ name: 'control-vivienda', params: { id: this.viviendaID } }"
          />
        </div>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showProductoForm = true">
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <productos-form v-if="showProductoForm" @close="closeModal" />
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import ProductosCard from "src/components/mod-vivienda/productos/ProductosCard.vue";
import ProductosForm from "src/components/mod-vivienda/productos/ProductosForm.vue";
export default {
  components: { ProductosCard, ProductosForm },
  data() {
    return {
      viviendaID: "",
      showProductoForm: false,
      productos: [],
      unidadMedida: []
    };
  },
  created() {
    this.viviendaID = this.$route.params.id;
    this.cargarListaProductoViviendaAction(this.viviendaID).then(result => {
      this.productos = result;
    });
  },
  methods: {
    ...mapActions("productoVivienda", [
      "cargarListaProductoViviendaAction",
      "eliminarProductoViviendaAction"
    ]),
    ...mapMutations("productoVivienda", ["setProductoViviendaSuccess"]),
    closeModal() {
      this.showProductoForm = false;
    },
    editarInfo(value) {
      this.setProductoViviendaSuccess(value);
      this.showProductoForm = true;
    },
    eliminarInfo(value) {
      this.eliminarProductoViviendaAction(value.id);
    }
  },
  computed: {
    ...mapGetters("productoVivienda", ["getProductoViviendaState"])
  }
};
</script>

<style></style>
