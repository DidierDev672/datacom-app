<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show"
  >
    <q-card style="width: 700px;">
      <q-card-section>
        <div class="text-h6">{{ mensajeBoton }} Producto</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-form class="q-gutter-md">
          <p>Datos del Producto</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="producto.producto"
                :options="productosOptions"
                label="Seleccione el producto"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input outlined v-model="producto.cantidad" label="Cantidad" />
            </div>
          </div>
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancelar"
          color="primary"
          :disable="getProductoViviendaState.loading"
          @click="close"
        />
        <q-btn
          :label="mensajeBoton"
          color="primary"
          :loading="getProductoViviendaState.loading"
          :disable="getProductoViviendaState.loading"
          @click="onSubmit"
        >
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { CATEGORIAS } from "src/utils/config";
export default {
  data() {
    return {
      viviendaID: "",
      show: true,
      producto: {},
      productosOptions: []
    };
  },
  created() {
    this.viviendaID = this.$route.params.id;
    let categorias = [CATEGORIAS.PRODUCTOS_VIVIENDA];
    this.producto = {
      id: 0,
      producto: "",
      cantidad: 0
    };

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.productosOptions = data;
    });

    if (
      Object.keys(this.getProductoViviendaState.objProductoVivienda).length > 0
    ) {
      this.producto.id = this.getProductoViviendaState.objProductoVivienda.id;
      this.producto.producto = this.getProductoViviendaState.objProductoVivienda.producto;
      this.producto.cantidad = this.getProductoViviendaState.objProductoVivienda.cantidad;
    }
  },
  methods: {
    ...mapActions("productoVivienda", [
      "registrarProductoViviendaAction",
      "actualizarProductoViviendaAction",
      "unsetProductoViviendaAction"
    ]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    onSubmit() {
      let info = {
        ...this.producto,
        encuesta: {
          id: this.viviendaID
        }
      };
      if (info.id > 0) {
        //Actualizar
        this.actualizarProductoViviendaAction(info).then(() => {});
      } else {
        //Guardar
        this.registrarProductoViviendaAction(info).then(data => {
          this.producto.id = data;
        });
      }
    },
    close() {
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters("productoVivienda", ["getProductoViviendaState"]),
    mensajeBoton() {
      return this.producto.id > 0 ? "Actualizar" : "Guardar";
    }
  },
  beforeDestroy() {
    this.unsetProductoViviendaAction();
  }
};
</script>

<style scoped></style>
