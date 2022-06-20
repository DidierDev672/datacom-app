<template>
<div>
  <div class="text-h6 page-title-box" >Representante legal</div>
    <div class="q-ma-md">
      <div class="row bg-white q-pa-md">
        <div class="col-xs-12 ">
          <q-form ref="repLegalForm">
            <p class="text-h6">2. Datos del representante legal</p>
            <div class="row q-col-gutter-sm">
              <div class="col-xs-12 col-md-8">
                <p class="text-h6">Nombre completo</p>
                <q-input
                  outlined
                  v-model="jacInfoDB.representanteLegal"
                />
              </div>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-xs-12 col-md-4">
                <p class="text-h6">Tipo de identificación</p>
                <q-select
                  outlined
                  v-model="jacInfoDB.tipoIdentificacionRepresentanteLegal"
                  option-label="nombre"
                  option-value="id"
                  :options="tipoIdentificacionOptions"
                />
              </div>
              <div class="col-xs-12 col-md-4">
                <p class="text-h6">Número de Documento</p>
                <q-input
                  outlined
                  v-model="jacInfoDB.noIdentificacionRepresentanteLegal"
                />
              </div>
              <div class="col-xs-12 col-md-4">
                <p class="text-h6">Fecha nacimiento</p>
                <q-input
                  outlined
                  v-model="jacInfoDB.fechaNacimiento"
                  mask="date"
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy
                        ref="qDateProxy"
                        transition-show="scale"
                        transition-hide="scale"
                      >
                        <q-date v-model="jacInfoDB.fechaNacimiento">
                          <div class="row items-center justify-end">
                            <q-btn
                              v-close-popup
                              label="Close"
                              color="primary"
                              flat
                            />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-xs-12 col-md-4">
                <p class="text-h6">Sexo</p>
                <q-select
                  outlined
                  v-model="jacInfoDB.genero"
                  option-label="nombre"
                  option-value="id"
                  :options="generoOptions"
                />
              </div>
              <div class="col-xs-12 col-md-4">
                <p class="text-h6">Nivel educativo</p>
                <q-select
                  outlined
                  v-model="jacInfoDB.nivelEducativa"
                  option-label="nombre"
                  option-value="id"
                  :options="nivelEscolaridadOptions"
                />
              </div>
              <div class="col-xs-12 col-md-4">
                <p class="text-h6">Tel. Celular</p>
                <q-input
                  outlined
                  v-model="jacInfoDB.celular"
                />
              </div>
            </div>

            <div class="row q-col-gutter-sm">
              <div class="col-xs-12 col-md-6">
                <p class="text-h6">Dirección</p>
                <q-input
                  outlined
                  v-model="jacInfoDB.direccion"
                />
              </div>
              <div class="col-xs-12 col-md-6">
                <p class="text-h6">Email</p>
                <q-input
                  outlined
                  v-model="jacInfoDB.emailRepresentanteLegal"
                />
              </div>
            </div>

            <div align="right">
              <q-btn @click="onSubmit" color="primary">Actualizar</q-btn>
            </div>
          </q-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { CATEGORIAS } from "src/utils/config";

export default {
  name: "JacInfo",
  data() {
    return {
      jacID: 0,
      jacInfoDB: {},
      tipoIdentificacionOptions: [],
      generoOptions: [],
      nivelEscolaridadOptions: []
    };
  },
  created() {
    this.jacID = this.$route.params.id;

    let categorias = [
      CATEGORIAS.TIPO_DOCUMENTO_IDENTIDAD,
      CATEGORIAS.NIVEL_EDUCATIVO,
      CATEGORIAS.SEXO
    ];

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      data.forEach(opt => {
        if (opt.categoria.codigo === "TDI")
          this.tipoIdentificacionOptions.push(opt);
        else if (opt.categoria.codigo === "SEXO") this.generoOptions.push(opt);
        else this.nivelEscolaridadOptions.push(opt);
      });
    });

    this.jacInfoDB = {
      id: this.$route.params.id,
      representanteLegal: "",
      tipoIdentificacionRepresentanteLegal: "",
      noIdentificacionRepresentanteLegal: "",
      fechaNacimiento: "",
      genero: "",
      nivelEducativa: "",
      celular: "",
      direccion: "",
      emailRepresentanteLegal: ""
    };

    this.buscarJacInfoAction(this.jacID).then(data => {
      if (data.id > 0) {
        this.jacInfoDB = { ...data };
      }
    });
  },
  methods: {
    ...mapActions("jacInfo", ["buscarJacInfoAction", "registrarJacInfoAction"]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    onSubmit() {
      this.$refs.repLegalForm.validate().then(success => {
        if (success) {
          this.registrarJacInfoAction(this.jacInfoDB).then(data => {
            this.$q.notify({
              message: "Información actualizada correctamente",
              color: "positive"
            });
          });
        } else {
          this.$q.notify({
            message: "Favor completar los campos correctamente",
            color: "red"
          });
        }
      });
    }
  },
  computed: {
    ...mapGetters("jacInfo", ["getJacInfoState"])
  }
};
</script>

<style lang="sass"></style>
