<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <q-form ref="comunidadForm">
          <p>Datos de la Comunidad</p>
          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Departamento</div>
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
              <div class="text-h6 q-mb-none">Municipio</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12">
                  <q-select
                    dense
                    ref="municipio"
                    use-input
                    v-model="comunidad.municipio"
                    option-label="nombreMunicipio"
                    option-value="id"
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
              <div class="text-h6 q-mb-none">Código Dane</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12">
                  <q-input
                    dense
                    v-model="comunidad.codigoDane"
                    label="Código Dane de la Comunidad"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Nombre de la comunidad</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12">
                  <q-input
                    dense
                    v-model="comunidad.nombreComunidad"
                    label="Nombre de la Comunidad"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Tipo de Comunidad</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12">
                  <q-select
                    dense
                    v-model="comunidad.tipoComunidad"
                    option-label="nombre"
                    option-value="id"
                    :options="tipoComunidadOptions"
                    lazy-rules
                    :rules="[
                      val =>
                        (val != null && val.id > 0) ||
                        'Debe elegir un tipo de comunidad'
                    ]"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-form>
        <div class="flex justify-center">
          <q-btn
            no-caps
            flat
            :to="{ name: 'PageComunidadIndex' }"
            label="Cancelar"
            color="primary"
            class="q-mr-sm"
          />

          <q-btn
            label="Guardar"
            no-caps
            color="primary"
            :disable="getComunidadState.loading"
            :loading="getComunidadState.loading"
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
export default {
  name: "ComunidadCreate",
  data() {
    return {
      comunidad: {},
      departamentos: [],
      departamentosList: [],
      municipios: [],
      municipiosList: [],
      tipoComunidadOptions: [],
      departamento: ""
    };
  },
  created() {
    let categorias = [CATEGORIAS.TIPO_COMUNIDAD];
    this.comunidad = {
      id: 0,
      municipio: null,
      codigoDane: "",
      nombreComunidad: "",
      tipoComunidad: ""
    };
    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.tipoComunidadOptions = data;
    });
    this.cargarListaDepartamentoAction().then(data => {
      this.departamentosList = data;
      this.departamentos = this.departamentosList;
    });
  },
  methods: {
    ...mapActions("departamento", [
      "cargarListaDepartamentoAction",
      "cargarListaMunicipiosDelDepartamentoAction"
    ]),
    ...mapActions("comunidad", ["registrarComunidadAction"]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    onSubmit() {
      console.log("Comunidad: ", this.comunidad);
      this.$refs.comunidadForm.validate().then(success => {
        if (success) {
          this.registrarComunidadAction({
            ...this.comunidad,
            usuarioActualizacion: this.getUser,
            usuarioCreacion: this.getUser
          }).then(data => {
            this.$q.notify({
              message: "Comunidad registrada correctamente",
              color: "primary"
            });
            this.$router.push({
              name: "ComunidadIndex"
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
    buscarMunicipios(departamentoID) {
      this.comunidad.municipio = null;
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
    ...mapGetters("comunidad", ["getComunidadState"]),
    ...mapGetters("auth", ["getUser"])
  }
};
</script>

<style scoped></style>
