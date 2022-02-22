<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show"
  >
    <q-card style="width: 700px;">
      <q-card-section>
        <div class="text-h6">{{ mensajeBoton }} Medio de Comunicación</div>
      </q-card-section>


      <q-separator />


      <q-card-section style="max-height: 50vh" class="scroll">
        <q-form class="q-gutter-md">
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="medio.tipoMedio"
                :options="options"

                label="Seleccione el tipo de medio de comunicación"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="medio.nombre"
                label="Nombre del local"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="medio.contacto"
                label="Persona de Contacto"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">

              <q-input outlined v-model="medio.telefono" label="Teléfono" />

            </div>
          </div>

          <!-- <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                type="textarea"
                v-model="medio.alcance"
                label="Alcance que tiene el medio de comunicación"
              />
            </div>
          </div> -->

          <!-- <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              El medio es público?

              <q-option-group
                :options="optionsCumple"
                type="radio"
                v-model="medio.publico"
              />
            </div>
          </div> -->
        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancelar"
          color="primary"
          :disable="getMedioState.loading"
          @click="close"
        />
        <q-btn
          :label="mensajeBoton"
          color="primary"
          :loading="getMedioState.loading"
          :disable="getMedioState.loading"
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
      medio: {},
      encuestaID: 0,
      options: [],
      optionsCumple: [
        { label: "Si", value: true },
        { label: "No", value: false }
      ]
    };
  },
  created() {
    let categorias = [CATEGORIAS.MEDIOS_DE_COMUNICACION];
    this.encuestaID = this.$route.params.id;
    this.medio = {
      id: 0,
      tipoMedio: "",
      nombre: "",
      contacto: "",
      telefono: "",
      alcance: "",
      publico: true,
      fechaActualizacion: this.getFecha,
      usuarioActualizacion: this.getUser,
      fechaCreacion: this.getFecha,
      usuarioCreacion: this.getUser
    };

    if (Object.keys(this.getMedioState.objMedio).length > 0) {
      this.medio.id = this.getMedioState.objMedio.id;
      this.medio.tipoMedio = this.getMedioState.objMedio.tipoMedio;
      this.medio.nombre = this.getMedioState.objMedio.nombre;
      this.medio.contacto = this.getMedioState.objMedio.contacto;
      this.medio.telefono = this.getMedioState.objMedio.telefono;
      this.medio.alcance = this.getMedioState.objMedio.alcance;
      this.medio.publico = this.getMedioState.objMedio.publico;
    }

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {

      this.options = data;
    });
  },
  methods: {
    ...mapActions("medio", [
      "registrarMedioAction",
      "actualizarMedioAction",
      "unsetMedioAction"
    ]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    onSubmit() {

      let info = {
        ...this.medio,
        encuesta: {
          id: this.encuestaID
        },

        fechaActualizacion: this.getFecha,
        usuarioActualizacion: this.getUser
      };

      if (info.id > 0) {
        //Actualizar
        this.actualizarMedioAction(info).then(() => {
          this.$q.notify({
            message: "Registro actualizado",
            color: "positive"
          });
        });
      } else {

        //Guardar
        this.registrarMedioAction(info).then(data => {
          this.medio.id = data;
        });
      }
    },
    close() {
      this.$emit("close");
    }
  },
  computed: {

    ...mapGetters("medio", ["getMedioState"]),
    mensajeBoton() {
      return this.medio.id > 0 ? "Actualizar" : "Guardar";
    },
    ...mapGetters("auth", ["getUser"]),
    getFecha() {
      return date.formatDate(new Date(), "YYYY-MM-DDTHH:mm:ss.SSSZ");
    }
  },
  beforeDestroy() {
    this.unsetMedioAction();
  }

};
</script>

<style></style>

