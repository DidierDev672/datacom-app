<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <div v-if="step == 1">
          <q-form ref="infoTerceroForm">
            <p class="text-h6 q-mt-md q-mb-sm">Información personal</p>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">
                  Tipo documento de identidad *
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      use-input
                      v-model="usuario.tercero.tipoIdentificacion"
                      option-label="nombre"
                      option-value="id"
                      :options="tipoIdentificacionOptions"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir un tipo de identificacion'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">
                  No. documento de identidad *
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      dense
                      v-model="usuario.tercero.identificacion"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">
                  Nombre *
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      dense
                      v-model="usuario.tercero.primerNombre"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">
                  Primer Apellido *
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      dense
                      v-model="usuario.tercero.primerApellido"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">
                  Segundo Apellido *
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      dense
                      v-model="usuario.tercero.segundoApellido"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">
                  Departamento *
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      use-input
                      v-model="usuario.tercero.departamento"
                      @input="buscarMunicipios"
                      @filter="filterFnDepartamento"
                      option-label="nombreDepartamento"
                      option-value="nombreDepartamento"
                      :options="departamentoOptions"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir un tipo de identificacion'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Ciudad *</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      ref="ciudad"
                      use-input
                      v-model="usuario.tercero.ciudad"
                      option-label="nombreMunicipio"
                      option-value="nombreMunicipio"
                      :options="municipiosOptions"
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
                <div class="text-h6 q-mb-none">
                  Dirección *
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      dense
                      v-model="usuario.tercero.direccion"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">
                  Teléfono *
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      dense
                      v-model="usuario.tercero.telefono"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">
                  Email *
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      dense
                      v-model="usuario.tercero.email"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>
        <div v-if="step == 2">
          <q-form ref="rolForm">
            <p class="text-h6 q-mt-md q-mb-sm">Rol del Usuario</p>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">
                  Seleccione un Rol *
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      use-input
                      v-model="usuario.rol"
                      option-label="nombre"
                      option-value="id"
                      :options="rolOptions"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) || 'Debe elegir un Rol'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>
        <div v-if="step == 3">
          <q-form ref="cuentaForm">
            <p class="text-h6 q-mt-md q-mb-sm">Cuenta</p>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">
                  Nombre usuario *
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      dense
                      v-model="usuario.username"
                      hint="ingrese un nombre de usuario sin espacio y sin caracteres especiales"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">
                  Contraseña *
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      dense
                      type="password"
                      v-model="usuario.password"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
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
            label="Siguiente"
            no-caps
            color="primary"
            @click="siguiente"
          />
          <q-btn
            v-else
            label="Registrar usuario"
            no-caps
            color="primary"
            :disable="getUsuarioState.loading"
            :loading="getUsuarioState.loading"
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
import { mapActions, mapGetters } from "vuex";
import { CATEGORIAS } from "src/utils/config";
export default {
  name: "UsuarioCreate",
  data() {
    return {
      step: 1,
      usuarioID: 0,
      usuario: {},
      tipoIdentificacionOptions: [],
      departamentoOptions: [],
      departamentoList: [],
      municipiosOptions: [],
      municipiosList: [],
      rolOptions: []
    };
  },
  created() {
    this.usuarioID = this.$route.params.id;
    let categorias = [CATEGORIAS.TIPO_DOCUMENTO_IDENTIDAD];

    this.usuario = {
      id: 0,
      username: "",
      password: "",
      tercero: {
        id: 0,
        tipoIdentificacion: null,
        identificacion: "",
        primerNombre: "",
        segundoNombre: "",
        primerApellido: "",
        segundoApellido: "",
        codigoPais: "169",
        departamento: "",
        ciudad: "",
        direccion: "",
        telefono: "",
        email: ""
      },
      rol: ""
    };

    this.buscarUsuarioAction(this.usuarioID).then(data => {
      this.usuario = JSON.parse(JSON.stringify(data));
    });

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      this.tipoIdentificacionOptions = data;
    });
    this.cargarListaDepartamentoAction().then(data => {
      this.departamentosList = data;
      this.departamentoOptions = data;
    });
    this.cargarListaRolAction().then(data => {
      this.rolOptions = data;
    });
  },
  methods: {
    ...mapActions("usuario", [
      "buscarUsuarioAction",
      "actualizarUsuarioAction"
    ]),
    ...mapActions("rol", ["cargarListaRolAction"]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    ...mapActions("departamento", [
      "cargarListaDepartamentoAction",
      "cargarListaMunicipiosDelDepartamentoAction"
    ]),
    buscarMunicipios(departamento) {
      this.usuario.tercero.ciudad = null;
      this.$refs.ciudad.resetValidation();
      if (departamento != null) {
        this.cargarListaMunicipiosDelDepartamentoAction(departamento.id).then(
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
        this.departamentoOptions = this.departamentosList.filter(
          v => v.nombreDepartamento.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    filterFnMunicipio(val, update) {
      update(() => {
        const needle = val.toLowerCase();
        this.municipiosOptions = this.municipiosList.filter(
          v => v.nombreMunicipio.toLowerCase().indexOf(needle) > -1
        );
      });
    },
    anterior() {
      if (this.step < 1) {
        this.step = 1;
        console.log("No se puede regresar mas");
      } else {
        this.step--;
      }
    },
    siguiente() {
      this.validarForm();
    },
    onSubmit() {
      this.$refs.cuentaForm.validate().then(success => {
        if (success) {
          this.actualizarUsuarioAction(this.usuario).then(data => {
            this.$router.push({
              name: "UsuariosIndex"
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
          this.$refs.infoTerceroForm.validate().then(success => {
            if (success) {
              console.log("Usuario: ", this.usuario);
              this.step++;
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
          this.$refs.rolForm.validate().then(success => {
            if (success) {
              this.step++;
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
    }
  },
  computed: {
    ...mapGetters("usuario", ["getUsuarioState"])
  }
};
</script>

<style lang="scss" scoped></style>
