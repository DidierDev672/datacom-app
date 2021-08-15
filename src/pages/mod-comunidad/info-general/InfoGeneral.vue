<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <div v-if="step == 1">
          <q-form ref="ubicacionForm">
            <p class="text-h6 q-mt-md q-mb-sm">1. Datos de la Comunidad</p>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Departamento *</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
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
                <div class="text-h6 q-mb-none">Municipio *</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
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
                      @input="buscarComunidades"
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
                <div class="text-h6 q-mb-none">Comunidad</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-select
                      dense
                      ref="comunidad"
                      v-model="infoGeneral.comunidad"
                      option-label="nombreComunidad"
                      option-value="id"
                      :options="comunidades"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir una comunidad'
                      ]"
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
                  <div class="col-xs-12 ">
                    <q-input dense v-model="infoGeneral.extension" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div v-if="step == 2">
          <q-form ref="limitesForm">
            <p class="text-h6 q-mt-md q-mb-sm">1. Datos de la Comunidad</p>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No. Manzanas</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-input dense v-model="infoGeneral.noManzanas" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">
                  Distancia a la cabecera en Tiempo
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-input dense v-model="infoGeneral.distanciaTiempo" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">
                  Distancia a la cabecera en Kilómetros
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-input dense v-model="infoGeneral.distanciaKm" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Longitud del Oleoducto</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-input dense v-model="infoGeneral.longitudOleoducto" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div v-if="step == 3">
          <q-form ref="otroForm">
            <p class="text-h6 q-mt-md q-mb-sm">Datos del Inspector</p>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Nombre completo</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-input
                      hint="No. de veredas"
                      dense
                      v-model="infoGeneral.nombreInspector"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Teléfono</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-input dense v-model="infoGeneral.telefonoInspector" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Dirección</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-input dense v-model="infoGeneral.direccionInspector" />
                  </div>
                </div>
              </q-card-section>
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
            label="Guardar y continuar"
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
      comunidades: [],
      step: 1
    };
  },
  created() {
    this.infoGeneral = {
      id: 0,
      municipio: {
        codigoDane: "",
        nombreMunicipio: "",
        departamento: {
          codigo: "",
          nombreDepartamento: ""
        }
      },
      comunidad: {
        id: 0,
        nombreComunidad: ""
      },
      extension: "",
      noManzanas: "",
      distanciaTiempo: "",
      distanciaKm: "",
      longitudOleoducto: "",
      nombreInspector: "",
      direccionInspector: "",
      telefonoInspector: ""
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
    ...mapActions("municipios", ["cargarListaComunidadesDelMunicipioAction"]),
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
    buscarComunidades(municipioID) {
      this.infoGeneral.comunidad = null;
      this.$refs.comunidad.resetValidation();
      if (municipioID != null) {
        this.cargarListaComunidadesDelMunicipioAction(municipioID.id).then(
          data => {
            this.comunidades = data;
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
            usuarioCreacion: this.getUser,
            usuarioActualizacion: this.getUser
          }).then(data => {
            this.$router.push({
              name: "c-poblacion",
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
                usuarioCreacion: this.getUser,
                usuarioActualizacion: this.getUser
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
                usuarioCreacion: this.getUser,
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
