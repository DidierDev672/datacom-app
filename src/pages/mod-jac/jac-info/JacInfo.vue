<template>
<div>
  <div class="text-h6 page-title-box" >Información General</div>
  <div class="q-ma-md">
    <div class="row bg-white q-pa-md">
      <div class="col-xs-12 ">
        <q-form ref="jacForm">
          <p class="text-h6 q-mt-md q-mb-sm">1. Información General</p>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-12 col-md-7">
              <p class="text-h6">1.1. Nombre de la organización *</p>
              <q-input
                outlined
                v-model="jacInfoDB.nombre"
                lazy-rules
                :rules="[val => !!val || 'Campo requerido']"
              />
            </div>
            <div class="col-xs-12 col-sm-12 col-md-5">
              <p class="text-h6">1.2. Tipo *</p>
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="jacInfoDB.tipo"
                :options="tipoOptions"
                lazy-rules
                :rules="[val => !!val || 'Campo requerido']"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-md-4">
              <p class="text-h6">1.3. Departamento *</p>
              <q-select
                outlined
                use-input
                v-model="departamento"
                option-label="nombreDepartamento"
                option-value="id"
                @input="buscarMunicipios"
                @filter="filterFnDepartamento"
                :options="departamentos"
                lazy-rules
                :rules="[
                  val =>
                    (val != null && val.id > 0) || 'Debe elegir un departamento'
                ]"
              />
            </div>
            <div class="col-xs-12 col-md-4">
              <p class="text-h6">1.4. Municipio *</p>
              <q-select
                outlined
                ref="municipio"
                use-input
                v-model="municipio"
                option-label="nombreMunicipio"
                option-value="id"
                :options="municipios"
                @filter="filterFnMunicipio"
                @input="buscarComunidades"
                lazy-rules
                :rules="[
                  val =>
                    (val != null && val.id > 0) || 'Debe elegir un municipio'
                ]"
              />
            </div>
            <div class="col-xs-12 col-md-4">
              <p class="text-h6">1.5. Comunidad/Barrio/Vereda *</p>
              <q-select
                outlined
                ref="comunidad"
                v-model="jacInfoDB.comunidad"
                option-label="nombreComunidad"
                option-value="id"
                :options="comunidades"
                lazy-rules
                :rules="[
                  val =>
                    (val != null && val.id > 0) || 'Debe elegir una comunidad'
                ]"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <p class="text-h6">1.6. Dirección</p>
              <q-input
                outlined
                v-model="jacInfoDB.direccionOrganizacion"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <p class="text-h6">1.7. Email </p>
              <q-input
                outlined
                v-model="jacInfoDB.email"
              />
            </div>
          </div>

          <!-- Personería Juridica -->

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <p class="text-h6">1.8. ¿Tiene personería jurídica? </p>
              <q-option-group
                inline
                :options="options"
                type="radio"
                v-model="jacInfoDB.tienePersoneriaJuridica"
              />
            </div>
          </div>
          <div
            class="row q-col-gutter-sm q-mt-md"
            v-if="jacInfoDB.tienePersoneriaJuridica"
          >
            <div class="col-xs-12 col-md-4">
              <p class="text-h6">1.9. No. Personería Jurídica</p>
              <q-input outlined v-model="jacInfoDB.noPersoneriaJuridica" />
            </div>
            <div class="col-xs-12 col-md-8">
              <p class="text-h6">1.10. ¿Tiene el documento de la Personería Jurídica escaneado?</p>
              <!-- <q-input outlined v-model="jacInfoDB.personeriaJuridicaEscaneada" /> -->
              <q-option-group
                inline
                :options="options"
                type="radio"
                v-model="jacInfoDB.personeriaJuridicaEscaneada"
              />
            </div>
            <!-- <div class="col-xs-12 col-md-4">
              <p class="text-h6">Otorgada por:</p>
              <q-input
                outlined
                v-model="jacInfoDB.personeriaJuridicaOtorgadaPor"
              />
            </div> -->
          </div>
          <div
            class="row q-col-gutter-sm q-mt-md"
            v-if="jacInfoDB.tienePersoneriaJuridica"
          >

          <div class="col-xs-12 col-md-4">
              <p class="text-h6">1.11. Fecha de expedición</p>
              <q-input
                outlined
                v-model="jacInfoDB.fechaExpedicionPersoneria"
                mask="date"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="jacInfoDB.fechaExpedicionPersoneria">
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

          <!-- Fin Personería Juridica -->

          <!-- Autoreconocimiento -->

          <div class="row q-col-gutter-sm q-mt-md">
            <div class="col-xs-12">
              <p class="text-h6">1.12. ¿Tiene Autoreconocimiento? </p>
              <q-option-group
                inline
                :options="options"
                type="radio"
                v-model="jacInfoDB.tieneAutoreconocimiento"
              />
            </div>
          </div>
          <div
            class="row q-col-gutter-sm q-my-md"
            v-if="jacInfoDB.tieneAutoreconocimiento"
          >
            <div class="col-xs-12 col-md-4">
              <p class="text-h6">1.13. No. Autoreconocimiento</p>
              <q-input outlined v-model="jacInfoDB.noAutorecocimiento" />
            </div>
            <!-- <div class="col-xs-12 col-md-5">
              <p class="text-h6">Autoreconocimiento otorgado por:</p>
              <q-input
                outlined
                v-model="jacInfoDB.autorecocimientoExpedidoPor"
              />
            </div> -->
            <div class="col-xs-12 col-md-3">
              <p class="text-h6">1.14. Fecha expedición</p>
              <q-input
                outlined
                v-model="jacInfoDB.fechaExpedicionAutoreconocimiento"
                mask="date"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date
                        v-model="jacInfoDB.fechaExpedicionAutoreconocimiento"
                      >
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

            <div class="col-xs-12 col-md-5">
              <p class="text-h6">1.14. ¿Autoreconocimiento escaneado? </p>
              <q-option-group
                inline
                :options="options"
                type="radio"
                v-model="jacInfoDB.autoreconocimientoEscaneada"
              />
            </div>

          </div>

          <!-- Fin Autoreconocimiento -->

          <!-- Rut -->

          <div class="row q-col-gutter-sm q-mt-md">
            <div class="col-xs-12">
              <p class="text-h6">1.15. ¿Tiene RUT?</p>
              <q-option-group
                inline
                :options="options"
                type="radio"
                v-model="jacInfoDB.tieneRut"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mt-md" v-if="jacInfoDB.tieneRut">

            <div class="col-xs-12 col-md-4">
              <p class="text-h6">1.16. Fecha de Expedición</p>
              <q-input
                outlined
                v-model="jacInfoDB.fechaExpedicionRut"
                mask="date"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="jacInfoDB.fechaExpedicionRut">
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
            <div class="col-xs-12 col-md-4">
              <p class="text-h6">1.17. ¿Rut escaneado? </p>
              <q-option-group
                inline
                :options="options"
                type="radio"
                v-model="jacInfoDB.rutEscaneada"
              />
            </div>
            <div class="col-xs-12 col-md-4">
              <p class="text-h6">1.18. Actividad económica 1</p>
              <q-input outlined v-model="jacInfoDB.actividadEconomica1" />
            </div>
            <div class="col-xs-12 col-md-4">
              <p class="text-h6">1.19. Actividad económica 2</p>
              <q-input outlined v-model="jacInfoDB.actividadEconomica2" />
            </div>
            <div class="col-xs-12 col-md-4">
              <p class="text-h6">1.20. Actividad económica 3</p>
              <q-input outlined v-model="jacInfoDB.actividadEconomica3" />
            </div>
            <div class="col-xs-12 col-md-4">
              <p class="text-h6">1.21. No. del Rut</p>
              <q-input outlined v-model="jacInfoDB.noRut" />
            </div>
          </div>

          <!-- Fin Rut -->

          <!-- Ruc -->

          <div class="row q-col-gutter-sm q-mt-md">
            <div class="col-xs-12">
              <p class="text-h6">1.22. ¿Tiene RUC? </p>
              <q-option-group
                inline
                :options="options"
                type="radio"
                v-model="jacInfoDB.tieneRuc"
              />
            </div>
          </div>
          <div class="row q-col-gutter-sm q-mt-md" v-if="jacInfoDB.tieneRuc">

            <div class="col-xs-12 col-md-4">
              <p class="text-h6">1.23. Fecha de Expedición</p>
              <q-input
                outlined
                v-model="jacInfoDB.fechaExpedicionRuc"
                mask="date"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="jacInfoDB.fechaExpedicionRuc">
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

            <div class="col-xs-12 col-md-4">
              <p class="text-h6">1.24. No. del Ruc</p>
              <q-input outlined v-model="jacInfoDB.noRuc" />
            </div>
            <div class="col-xs-12 col-md-4">
              <p class="text-h6">1.25. ¿Ruc escaneado? </p>
              <q-option-group
                inline
                :options="options"
                type="radio"
                v-model="jacInfoDB.rucEscaneada"
              />
            </div>
          </div>

          <!-- Fin Ruc -->

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
      departamentos: [],
      departamentosList: [],
      departamento: "",
      municipios: [],
      municipiosList: [],
      municipio: "",
      tipoOptions: [],
      comunidades: [],
      tipoIdentificacionRepresentante: [],
      options: [
        { label: "Si", value: true },
        { label: "No", value: false }
      ]
    };
  },
  created() {
    this.jacID = this.$route.params.id;

    let categorias = [CATEGORIAS.TIPO_JUNTA];

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.tipoOptions = data;
    });

    this.cargarListaDepartamentoAction().then(data => {
      this.departamentosList = data;
      this.departamentos = this.departamentosList;
    });

    this.jacInfoDB = {
      id: 0,
      nombre: "",
      tipo: "",
      comunidad: "",
      email: "",
      tienePersoneriaJuridica: true,
      noPersoneriaJuridica: "",
      personeriaJuridicaOtorgadaPor: "",
      fechaExpedicionPersoneria: "",
      tieneRut: true,
      noRut: "",
      fechaExpedicionRut: "",
      tieneRuc: true,
      noRuc: "",
      fechaExpedicionRuc: "",
      tieneAutoreconocimiento: true,
      noAutorecocimiento: "",
      autorecocimientoExpedidoPor: "",
      fechaExpedicionAutoreconocimiento: "",
      fechaActualizacionJac: "",
      direccionOrganizacion: "",
      personeriaJuridicaEscaneada: false,
      autoreconocimientoEscaneada: false,
      rutEscaneada: false,
      actividadEconomica1: "",
      actividadEconomica2: "",
      actividadEconomica3: "",
      rucEscaneada: false
    };

    this.buscarJacInfoAction(this.jacID).then(data => {
      if (data.id > 0) {
        this.jacInfoDB = { ...data };
        if(data.comunidad){
          this.municipio = data.comunidad.municipio;
          this.departamento = data.comunidad.municipio.departamento;
        }
      }
    });
  },
  methods: {
    ...mapActions("jacInfo", ["buscarJacInfoAction", "registrarJacInfoAction"]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    ...mapActions("departamento", [
      "cargarListaDepartamentoAction",
      "cargarListaMunicipiosDelDepartamentoAction"
    ]),
    ...mapActions("municipios", ["cargarListaComunidadesDelMunicipioAction"]),
    buscarMunicipios(departamentoID) {
      this.municipio = null;
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
      this.jacInfoDB.comunidad = null;
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
      this.$refs.jacForm.validate().then(success => {
        if (success) {
          console.log("Formulario: ", this.jacInfoDB);
          this.registrarJacInfoAction({
            ...this.jacInfoDB,
            id: this.jacID,
            usuarioCreacion: this.getUser,
            usuarioActualizacion: this.getUser
          }).then(data => {
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
    },
    filterFnDepartamento(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.departamentos = this.departamentosList.filter(
          v => v.nombreDepartamento.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterFnMunicipio(val, update, abort) {
      update(() => {
        const needle = val.toLowerCase();
        this.municipios = this.municipiosList.filter(
          v => v.nombreMunicipio.toLowerCase().indexOf(needle) > -1
        );
      });
    }
  },
  computed: {
    ...mapGetters("jacInfo", ["getJacInfoState"]),
    ...mapGetters("auth", ["getUser"])
  }
};
</script>

<style lang="sass"></style>
