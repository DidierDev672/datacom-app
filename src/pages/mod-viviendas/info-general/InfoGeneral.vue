<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <div>
          <q-form ref="ubicacionForm">
            <p class="text-h6 q-mt-md q-mb-sm">Ubicación de la Vivienda</p>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">3. Departamento *</div>
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
                <div class="text-h6 q-mb-none">4. Muncipio *</div>
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
                <div class="text-h6 q-mb-none">5. Area</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-select
                      dense
                      ref="area"
                      v-model="infoGeneral.area"
                      option-label="nombre"
                      option-value="id"
                      :options="areasOptions"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) || 'Debe elegir un área'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">5.1. Comunidad</div>
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
                <div class="text-h6 q-mb-none">6. Dirección de la Vivienda</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-input dense v-model="infoGeneral.direccionVivienda" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div class="flex justify-center">
          <q-btn
            label="Guardar y continuar"
            class="full-width"
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
import { CATEGORIAS } from "src/utils/config";
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
      comunidades: [],
      areasOptions: []
    };
  },
  created() {
    let categorias = [CATEGORIAS.AREAS_UBICACION_VIVIENDAS];
    this.infoGeneral = {
      id: 0,
      municipio: "",
      comunidad: "",
      area: "",
      direccionVivienda: ""
    };
    this.encuestaID = this.$route.params.id;
    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.areasOptions = data;
    });
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
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
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
      const fecha = date.formatDate(new Date(), "YYYY-MM-DDTHH:mm:ss.SSSZ");
      this.$refs.ubicacionForm.validate().then(success => {
        if (success) {
          console.log(this.infoGeneral);
          this.guardarInformacionGeneralAction({
            ...this.infoGeneral,
            encuesta: {
              id: this.encuestaID
            },
            fechaActualizacion: fecha,
            usuarioActualizacion: this.getUser,
            fechaCreacion: fecha,
            usuarioCreacion: this.getUser
          }).then(data => {
            this.$router.push({
              name: "informacion-vivienda",
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
    filterFnDepartamento(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.departamentos = this.departamentosList.filter(
          v => v.nombreDepartamento.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterFnMunicipio(val, update) {
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
