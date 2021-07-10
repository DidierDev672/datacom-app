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
        <q-form class="q-gutter-md" ref="productoForm">
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="producto.nombre"
                label="Nombre del producto"
                lazy-rules
                :rules="[val => !!val || 'Campo requerido']"
              />
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
          :disable="getProductoState.loading"
          @click="close"
        />
        <q-btn
          :label="mensajeBoton"
          color="primary"
          :loading="getProductoState.loading"
          :disable="getProductoState.loading"
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
import { mapGetters, mapActions } from "vuex";
import { CATEGORIAS } from "../../utils/config";
import { date } from "quasar";
export default {
  data() {
    return {
      show: true,
      producto: {},
      encuestaID: 0
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    this.producto = {
      id: 0,
      nombre: "",
      fechaActualizacion: this.getFecha,
      usuarioActualizacion: this.getUser,
      fechaCreacion: this.getFecha,
      usuarioCreacion: this.getUser
    };
    if (Object.keys(this.getProductoState.objProducto).length > 0) {
      this.producto.id = this.getProductoState.objProducto.id;
      this.producto.nombre = this.getProductoState.objProducto.nombre;
    }
  },
  methods: {
    ...mapActions("producto", [
      "registrarProductoAction",
      "actualizarProductoAction",
      "unsetProductoAction"
    ]),

    onSubmit() {
      this.$refs.productoForm.validate().then(success => {
        if (success) {
          let info = {
            ...this.producto,
            encuesta: {
              id: this.encuestaID
            },
            fechaActualizacion: this.getFecha,
            usuarioActualizacion: this.getUser
          };

          if (info.id > 0) {
            //Actualizar
            this.actualizarProductoAction(info).then(() => {
              this.$q.notify({
                message: "Registro actualizado",
                color: "positive"
              });
            });
          } else {
            //Guardar
            this.registrarProductoAction(info).then(data => {
              this.producto.id = data;
            });
          }
        } else {
          this.$q.notify({
            message: "Favor completar los campos correctamente",
            color: "red"
          });
        }
      });
    },
    close() {
      this.$emit("close");
    }
  },
  computed: {
    ...mapGetters("producto", ["getProductoState"]),
    mensajeBoton() {
      return this.producto.id > 0 ? "Actualizar" : "Guardar";
    },
    ...mapGetters("auth", ["getUser"]),
    getFecha() {
      return date.formatDate(new Date(), "YYYY-MM-DDTHH:mm:ss.SSSZ");
    }
  },
  beforeDestroy() {
    this.unsetProductoAction();
  }
};
</script>

<style></style>
