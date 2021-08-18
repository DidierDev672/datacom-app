<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <div v-if="step == 1">
          <q-form ref="ubicacionForm">
            <p class="text-h6 q-mt-md q-mb-sm">1. Ubicación del Municipio</p>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Departamento *</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-select
                      dense
                      use-input
                      v-model="departamento"
                      option-label="nombreDepartamento"
                      option-value="id"
                      @input="buscarMunicipios"
                      @filter="filterFnDepartamento"
                      hint="Ingrese almenos dos caracteres para filtrar departamento"
                      :options="departamentos"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir un departamento'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Muncipio *</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-select
                      dense
                      ref="municipio"
                      use-input
                      v-model="infoGeneral.municipio"
                      option-label="nombreMunicipio"
                      option-value="id"
                      hint="Ingrese almenos dos caracteres para filtrar municipios"
                      :options="municipios"
                      @filter="filterFnMunicipio"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir un municipio'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Región</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-input
                      dense
                      v-model="infoGeneral.region"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Extensión en Km</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <!-- <q-input dense v-model="infoGeneral.extension" /> -->
                    <q-field
                      v-model="infoGeneral.extension"
                      lazy-rules
                      :rules="[val => val > 0 || 'Campo requerido']"
                      hint="#,###"
                    >
                      <template
                        v-slot:control="{ id, floatingLabel, value, emitValue }"
                      >
                        <money
                          :id="id"
                          class="q-field__input"
                          :value="value"
                          @input="emitValue"
                          v-bind="numero"
                          v-show="floatingLabel"
                        />
                      </template>
                    </q-field>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div v-if="step == 2">
          <q-form ref="limitesForm">
            <p class="text-h6 q-mt-md q-mb-sm">Límites Geográficos</p>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Límite Norte</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-input
                      dense
                      v-model="infoGeneral.limiteNorte"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Límite Sur</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-input
                      dense
                      v-model="infoGeneral.limiteSur"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Límite Oriente</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-input
                      dense
                      v-model="infoGeneral.limiteOriente"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Límite Occidente</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-input
                      dense
                      v-model="infoGeneral.limiteOccidente"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div v-if="step == 3">
          <q-form ref="otroForm">
            <p class="text-h6 q-mt-md q-mb-sm">Otros datos</p>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Composición</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-input
                      hint="No. de veredas"
                      dense
                      v-model="infoGeneral.composicion"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Altitud</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <!-- <q-input dense v-model="infoGeneral.altitud"/> -->
                    <q-field v-model="infoGeneral.altitud" hint="#,###">
                      <template
                        v-slot:control="{ id, floatingLabel, value, emitValue }"
                      >
                        <money
                          :id="id"
                          class="q-field__input"
                          :value="value"
                          @input="emitValue"
                          v-bind="altitudFormat"
                          v-show="floatingLabel"
                        />
                      </template>
                    </q-field>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Gentilicio</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-input
                      dense
                      v-model="infoGeneral.gentilicio"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Fecha de fundación</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-input
                      type="date"
                      dense
                      v-model="infoGeneral.fechaFundacion"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Emblema</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-input
                      type="textarea"
                      dense
                      v-model="infoGeneral.emblema"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Personajes representativos</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-input
                      type="textarea"
                      dense
                      v-model="infoGeneral.personajeRepresentativo"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Fuente de la Información</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12">
                      <q-input
                        dense
                        v-model="infoGeneral.fuenteInfoGeneral"
                        hint="Ingrese la fuente de donde obtuvo esta información"
                      />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
            </q-card>
          </q-form>
        </div>

        <div class="flex justify-center">
          <q-btn
            v-if="step > 1"
            label="Anterior"
            no-caps
            color="primary"
            flat
            class="q-mr-sm"
            @click="anterior"
          />
          <q-btn
            v-if="step < 3"
            label="Siguiente"
            no-caps
            color="primary"
            @click="siguiente"
          />
          <q-btn
            v-else
            label="Guardar y continuar"
            no-caps
            color="primary"
            :disable="getInformacionGeneralState.loading"
            :loading="getInformacionGeneralState.loading"
            @click="onSubmit"
          >
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { date } from "quasar";
export default {
  data() {
    return {
      encuestaID: 0,
      infoGeneral: {},
      departamentos: [],
      departamentosList: [],
      municipios: [],
      municipiosList: [],
      departamento: "",
      step: 1,
      numero: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false /* doesn't work with directive */
      },
      altitudFormat: {
        decimal: ".",
        thousands: ",",
        suffix: " MSNM",
        precision: 0,
        masked: false /* doesn't work with directive */
      }
    };
  },
  created() {
    const fecha = date.formatDate(new Date(), "YYYY-MM-DDTHH:mm:ss.SSSZ");
    this.infoGeneral = {
      id: 0,
      alcalde: "",
      altitud: "",
      categoria: "",
      composicion: "",
      correo: "",
      correoAlcalde: "",
      densidad: "",
      direccionAlcaldia: "",
      emblema: "",
      estado: "",
      extension: "",
      fechaActualizacion: "",
      fechaCreacion: "",
      fechaFundacion: "",
      gentilicio: "",
      horarioDeAtencion: "",
      limiteNorte: "",
      limiteOccidente: "",
      limiteOriente: "",
      limiteSur: "",
      noAfro: "",
      noHombres: "",
      noIndigenas: "",
      noMujeres: "",
      paginaDeFacebook: "",
      paginaWeb: "",
      partidoPolitico: "",
      personajeRepresentativo: "",
      poblacionRural: "",
      poblacionUrbana: "",
      region: "",
      tasaFecundidad: "",
      tasaNatalidad: "",
      telefono: "",
      telefonoAlcalde: "",
      usuarioActualizacion: "",
      usuarioCreacion: "",
      municipio: {
        codigoDane: "",
        nombreMunicipio: "",
        departamento: {
          codigo: "",
          nombreDepartamento: ""
        }
      },
      fechaActualizacion: fecha,
      usuarioActualizacion: this.getUser,
      fechaCreacion: fecha,
      usuarioCreacion: this.getUser,
      fuenteInfoGeneral: ""
    };
    this.encuestaID = this.$route.params.id;
    this.cargarListaDepartamentoAction().then(data => {
      this.departamentosList = data;
      this.departamentos = this.departamentosList;
    });
    this.buscarInformacionGeneralAction(this.encuestaID).then(data => {
      if (data.id > 0) {
        //this.step = 5
        this.infoGeneral = { ...data };
        if (data.municipio != null) {
          this.departamento = data.municipio.departamento;
        }
      }
    });
  },
  methods: {
    ...mapActions("informacionGeneral", [
      "buscarInformacionGeneralAction",
      "guardarInformacionGeneralAction"
    ]),
    ...mapActions("departamento", [
      "cargarListaDepartamentoAction",
      "cargarListaMunicipiosDelDepartamentoAction"
    ]),
    siguiente() {
      this.validarForm();
    },
    anterior() {
      if (this.step < 1) {
        this.step = 1;
        console.log("No se puede regresar mas");
      } else {
        this.step--;
      }
    },
    buscarMunicipios(departamentoID) {
      this.infoGeneral.municipio = null;
      this.$refs.municipio.resetValidation();
      if (departamentoID != null) {
        this.cargarListaMunicipiosDelDepartamentoAction(departamentoID.id).then(
          data => {
            this.municipiosList = data;
            this.municipios = this.municipiosList;
          }
        );
      }
    },
    onSubmit() {
      this.$refs.otroForm.validate().then(success => {
        if (success) {
          this.guardarInformacionGeneralAction({
            ...this.infoGeneral,
            encuesta: {
              id: this.encuestaID
            },
            usuarioActualizacion: this.getUser
          }).then(data => {
            this.$router.push({
              name: "demografia",
              params: { id: this.encuestaID }
            });
          });
        } else {
          this.$q.notify({
            message: "Favor completar los campos correctamente",
            color: "red"
          });
        }
      });
    },
    validarForm() {
      let stepValue = this.step;
      switch (stepValue) {
        case 1:
          //validar FormUbicacion
          this.$refs.ubicacionForm.validate().then(success => {
            if (success) {
              this.guardarInformacionGeneralAction({
                ...this.infoGeneral,
                encuesta: {
                  id: this.encuestaID
                },
                usuarioCreacion: this.getUser
              }).then(data => {
                this.infoGeneral.id = data;
                this.step++;
              });
            } else {
              this.$q.notify({
                message: "Favor completar los campos correctamente",
                color: "red"
              });
            }
          });
          break;
        case 2:
          //validar FormLimites
          this.$refs.limitesForm.validate().then(success => {
            if (success) {
              this.guardarInformacionGeneralAction({
                ...this.infoGeneral,
                encuesta: {
                  id: this.encuestaID
                },
                usuarioActualizacion: this.getUser
              }).then(data => {
                this.step++;
              });
            } else {
              this.$q.notify({
                message: "Favor completar los campos correctamente",
                color: "red"
              });
            }
          });
          break;
        default:
          this.step++;
          break;
      }
    },
    filterFnDepartamento(val, update, abort) {
      if (val.length < 2) {
        abort();
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.departamentos = this.departamentosList.filter(
          v => v.nombreDepartamento.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterFnMunicipio(val, update, abort) {
      if (val.length < 2) {
        abort();
        return;
      }

      update(() => {
        const needle = val.toLowerCase();
        this.municipios = this.municipiosList.filter(
          v => v.nombreMunicipio.toLowerCase().indexOf(needle) > -1
        );
      });
    }
  },
  computed: {
    ...mapGetters("informacionGeneral", ["getInformacionGeneralState"]),
    ...mapGetters("auth", ["getUser"])
  }
};
</script>

<style></style>
