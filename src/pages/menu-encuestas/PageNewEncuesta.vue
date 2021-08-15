<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <q-form ref="encuestaForm">
          <p class="text-h6 q-mt-md">
            Nueva encuesta de {{ tipoEncuesta ? tipoEncuesta.title : "" }}
          </p>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section>
              <div class="text-h6">Seleccione un estudio</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12">
                  <!-- <q-input v-model="nuevaEncuesta.tipoEstudio" placeholder="Estudio" /> -->
                  <q-select
                    outlined
                    option-value="id"
                    option-label="nombre"
                    v-model="nuevaEncuesta.tipoEstudio"
                    :options="lstTiposDeEstudios"
                    behavior="dialog"
                    label="Seleccione un estudio"
                    lazy-rules
                    :rules="[
                      val => val.id > 0 || 'Debe seleccionar un estudio'
                    ]"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section>
              <div class="text-h6">Descripción de la encuesta</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12">
                  <q-input
                    outlined
                    type="textarea"
                    v-model="nuevaEncuesta.descripcion"
                    placeholder="Agregue una descripción a la encuesta que va a registrar"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section>
              <div class="text-h6">Fecha de la encuesta</div>
            </q-card-section>

            <q-card-section>
              <div class="row q-col-gutter-sm">
                <div class="col-xs-12 col-sm-6">
                  <q-input
                    outlined
                    type="number"
                    v-model.number="nuevaEncuesta.anio"
                    placeholder="Año"
                    lazy-rules
                    :rules="[val => val || 'Digite el año']"
                  />
                </div>
                <div class="col-xs-12 col-sm-3">
                  <q-input
                    outlined
                    v-model="nuevaEncuesta.mes"
                    placeholder="Mes"
                    lazy-rules
                    :rules="[
                      val =>
                        (val && val.length > 0 && val.length <= 2) ||
                        'Digite el mes'
                    ]"
                  />
                </div>
                <div class="col-xs-12 col-sm-3">
                  <q-input
                    outlined
                    v-model="nuevaEncuesta.dia"
                    placeholder="Dia"
                    lazy-rules
                    :rules="[
                      val =>
                        (val && val.length > 0 && val.length <= 2) ||
                        'Digite el dia'
                    ]"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <div class="flex justify-center">
            <q-btn
              label="Cancelar"
              no-caps
              color="primary"
              flat
              class="q-mr-sm"
              to="/"
            />
            <q-btn
              label="Siguiente"
              no-caps
              color="primary"
              :loading="getEncuestaState.loading"
              :disable="getEncuestaState.loading"
              @click="onSubmit"
            >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </div>
        </q-form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { TIPO_ENCUESTA, CATEGORIAS } from "../../utils/config";
import { date } from "quasar";

export default {
  name: "PageNuevaEncuesta",
  data() {
    return {
      tipoEncuestaID: 0,
      tipoEncuesta: {},
      lstTiposDeEstudios: [],
      nuevaEncuesta: {}
    };
  },
  created() {
    const fecha = date.formatDate(new Date(), "YYYY-MM-DDTHH:mm:ss.SSSZ");
    let categorias = [CATEGORIAS.TIPOS_ESTUDIO];
    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.lstTiposDeEstudios = data;
    });
    this.tipoEncuestaID = this.$route.params.id;
    if (this.tipoEncuestaID > 0) {
      this.tipoEncuesta = this.getTipoEncuestaPorId(this.tipoEncuestaID);
    }
    this.nuevaEncuesta = {
      id: 0,
      tipoEncuesta: this.tipoEncuesta,
      tipoEstudio: "",
      descripcion: "",
      anio: "",
      mes: "",
      dia: "",
      fechaCreacion: fecha,
      fechaActualizacion: fecha,
      encuestaCerrada: false,
      usuarioCreacion: this.getUser,
      usuarioActualizacion: this.getUser
    };
  },
  methods: {
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    ...mapActions("encuesta", ["registrarEncuestaAction"]),
    onSubmit() {
      this.$refs.encuestaForm.validate().then(success => {
        if (success) {
          // yay, models are correct
          this.registrarEncuestaAction(this.nuevaEncuesta).then(encuestaID => {
            this.nuevaEncuesta.id = encuestaID;
            switch (this.tipoEncuestaID) {
              case TIPO_ENCUESTA.VIVIENDA:
                console.log("Tipo encuesta vivienda");
                this.$router.push({
                  name: "v-info-general",
                  params: { id: encuestaID }
                });
                break;
              case TIPO_ENCUESTA.COMUNIDAD:
                console.log("Tipo encuesta comunidad");
                this.$router.push({
                  name: "c-info-general",
                  params: { id: encuestaID }
                });
                break;
              case TIPO_ENCUESTA.MUNICIPIO:
                console.log("Tipo encuesta municipio");
                this.$router.push({
                  name: "info-general",
                  params: { id: encuestaID }
                });
                break;
              default:
                console.log("Tipo encuesta JAC");
                this.$router.push({
                  name: "a-info-general",
                  params: { id: encuestaID }
                });
                break;
            }
          });
        } else {
          console.log("Formulario inválido");

          // oh no, user has filled in
          // at least one invalid value
        }
      });
    }
  },
  computed: {
    ...mapGetters("tipoEncuesta", ["getTipoEncuestaPorId"]),
    ...mapGetters("encuesta", ["getEncuestaState"]),
    ...mapGetters("auth", ["getUser"])
  }
};
</script>

<style></style>
