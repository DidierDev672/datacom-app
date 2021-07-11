<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show"
  >
    <q-card style="width: 700px;">
      <q-card-section>
        <div class="text-h6">{{ mensajeBoton }} Política Pública</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-form ref="politicasForm" class="q-gutter-md">
          <p>Seleccione un tipo de política</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="politica.tipoPolitica"
                :options="options"
                label="Seleccione una política"
                lazy-rules
                :rules="[val => !!val || 'Campo requerido']"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="politica.numero"
                label="No. Acuerdo municipal"
                lazy-rules
                :rules="[val => !!val || 'Campo requerido']"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="politica.ano"
                label="Año"
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
          :disable="getPoliticasPublicasState.loading"
          @click="close"
        />
        <q-btn
          :label="mensajeBoton"
          color="primary"
          :loading="getPoliticasPublicasState.loading"
          :disable="getPoliticasPublicasState.loading"
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
      politica: {},
      encuestaID: 0,
      options: []
    };
  },
  created() {
    let categorias = [CATEGORIAS.POLITICAS_PUBLICAS];
    this.encuestaID = this.$route.params.id;
    this.politica = {
      id: 0,
      tipoPolitica: "",
      numero: "",
      ano: "",
      fechaActualizacion: this.getFecha,
      usuarioActualizacion: this.getUser,
      fechaCreacion: this.getFecha,
      usuarioCreacion: this.getUser
    };
    if (
      Object.keys(this.getPoliticasPublicasState.objPoliticasPublicas).length >
      0
    ) {
      this.politica.id = this.getPoliticasPublicasState.objPoliticasPublicas.id;
      this.politica.tipoPolitica = this.getPoliticasPublicasState.objPoliticasPublicas.tipoPolitica;
      this.politica.ano = this.getPoliticasPublicasState.objPoliticasPublicas.ano;
      this.politica.numero = this.getPoliticasPublicasState.objPoliticasPublicas.numero;
    }

    // this.cargarListaParametroAction().then(data => {
    //   this.options = data
    // })

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.options = data;
    });
  },
  methods: {
    ...mapActions("politicasPublicas", [
      "registrarPoliticasPublicasAction",
      "actualizarPoliticasPublicasAction",
      "unsetPoliticasPublicasAction"
    ]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    onSubmit() {
      this.$refs.politicasForm.validate().then(success => {
        if (success) {
          let info = {
            ...this.politica,
            encuesta: {
              id: this.encuestaID
            },
            fechaActualizacion: this.getFecha,
            usuarioActualizacion: this.getUser
          };
          if (info.id > 0) {
            //Actualizar
            this.actualizarPoliticasPublicasAction(info).then(() => {
              this.$q.notify({
                message: "Registro actualizado",
                color: "positive"
              });
            });
          } else {
            //Guardar
            this.registrarPoliticasPublicasAction(info).then(data => {
              this.politica.id = data;
              this.$q.notify({
                message: "Registro guardado",
                color: "positive"
              });
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
    ...mapGetters("politicasPublicas", ["getPoliticasPublicasState"]),
    mensajeBoton() {
      return this.politica.id > 0 ? "Actualizar" : "Guardar";
    },
    ...mapGetters("auth", ["getUser"]),
    getFecha() {
      return date.formatDate(new Date(), "YYYY-MM-DDTHH:mm:ss.SSSZ");
    }
  },
  beforeDestroy() {
    this.unsetPoliticasPublicasAction();
  }
};
</script>

<style></style>
