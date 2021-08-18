<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <p class="text-h6 q-mt-md q-mb-sm">15.1. Productos</p>

        <producto-card
          v-for="producto in getProductoState.lista"
          class="q-mb-sm"
          :producto="producto"
          @editar="editarInfo"
          :key="producto.id"
        ></producto-card>

        <div v-if="showBtnContinuar" class="flex justify-center">
          <q-btn label="Continuar" no-caps color="primary" @click="onSubmit" />
        </div>

        <div class="flex flex-center" v-if="!showBtnContinuar">
          No hay registros para mostrar, agregue los que necesite haciendo click
          en el botón
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

    <producto-form v-if="showProductoForm" @close="closeModal"></producto-form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import ProductoCard from "src/components/mod-municipios/ProductoCard.vue";
import ProductoForm from "src/components/mod-municipios/ProductoForm.vue";
export default {
  components: { ProductoCard, ProductoForm },
  data() {
    return {
      encuestaID: 0,
      showProductoForm: false
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    if (this.encuestaID > 0) {
      this.cargarListaProductoAction(this.encuestaID);
    }
  },
  methods: {
    ...mapActions("producto", ["cargarListaProductoAction"]),
    ...mapMutations("producto", ["setProductoSuccess"]),
    closeModal() {
      this.showProductoForm = false;
    },
    editarInfo(value) {
      this.setProductoSuccess(value);
      this.showProductoForm = true;
    },
    onSubmit() {
      this.$router.push({
        name: "fin-encuesta",
        params: { id: this.encuestaID }
      });
    }
  },
  computed: {
    ...mapGetters("producto", ["getProductoState"]),
    showBtnContinuar() {
      return this.getProductoState.lista.length > 0 ? true : false;
    }
  }
};
</script>

<style></style>
