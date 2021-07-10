<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <p class="text-h6 q-mt-md">Editar Persona</p>
        <div v-if="step === 1">
          <q-form ref="infoPersonal">
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Tipo del Documento de Identidad
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      v-model="persona.tipoDocumento"
                      :options="tipoDocOptions"
                      option-label="nombre"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir una opción'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Número del Documento de Identidad
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      dense
                      v-model="persona.noDocumento"
                      lazy-rules
                      :rules="[
                        val => val =>
                          !!val || 'Debe ingresar el número de documento'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Nombres
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      dense
                      v-model="persona.nombre"
                      hint="Ingrese primer y segundo nombre"
                      lazy-rules
                      :rules="[
                        val => val =>
                          !!val || 'Debe ingresar el nombre de la persona'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Primer Apellido
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      dense
                      v-model="persona.primerApellido"
                      lazy-rules
                      :rules="[
                        val => val =>
                          !!val || 'Debe ingresar el primer apellido'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Segundo Apellido
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="persona.segundoApellido" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Sexo
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      v-model="persona.sexo"
                      :options="sexoOptions"
                      option-label="nombre"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir una opción'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Parentesco con el Jefe del Hogar
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      v-model="persona.parentescoJefeDeHogar"
                      :options="parentescoOptions"
                      option-label="nombre"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir una opción'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div v-if="step === 2">
          <q-form ref="caracteristicasPersona">
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Fecha de Nacimiento
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      outlined
                      v-model="persona.fechaNacimiento"
                      mask="date"
                    >
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy
                            ref="qDateProxy"
                            transition-show="scale"
                            transition-hide="scale"
                          >
                            <q-date v-model="persona.fechaNacimiento">
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
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Años Cumplidos
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      dense
                      v-model="persona.edad"
                      lazy-rules
                      :rules="[val => val => !!val || 'Debe ingresar la edad']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Nivel Educativo
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      v-model="persona.nivelEducativo"
                      :options="educacionOptions"
                      option-label="nombre"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir una opción'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Pertenencia Étnica
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      v-model="persona.etnia"
                      :options="etniaOptions"
                      option-label="nombre"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir una opción'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Ocupación
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      v-model="persona.ocupacion"
                      :options="ocupacionOptions"
                      option-label="nombre"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir una opción'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div v-if="step === 3">
          <q-form ref="socialPersona">
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Seguridad Social
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      v-model="persona.seguridadSocial"
                      :options="seguridadSocialOptions"
                      option-label="nombre"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir una opción'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Nivel de Ingreso
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      v-model="persona.nivelIngreso"
                      :options="nivelIngresosOptions"
                      option-label="nombre"
                      lazy-rules
                      :rules="[
                        val =>
                          (val != null && val.id > 0) ||
                          'Debe elegir una opción'
                      ]"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  ¿La persona registrada presenta alguna de las siguientes
                  discapacidades?
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="persona.discapacidadVisual"
                      label="Discapacidad Visual"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="persona.discapacidadMental"
                      label="Discapacidad Mental"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="persona.discapacidadFisica"
                      label="Discapacidad Física"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="persona.discapacidadAuditiva"
                      label="Discapacidad Auditiva"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="persona.discapacidadNoPresenta"
                      label="No presenta discapacidad"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  ¿La persona registrada es beneficiario de alguno de los
                  siguientes programas sociales?
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="persona.programaFamiliasEnAccion"
                      label="Familias en Acción"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="persona.programaDesplazadoVictima"
                      label="Programa desplazados / víctima"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="persona.programaJovenesEnAccion"
                      label="Jóvenes en Acción"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="persona.programaIngresoSolidario"
                      label="Ingreso Solidario"
                    />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="persona.programaAdultoMayor"
                      label="Adulto Mayor"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div v-if="step === 4">
          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section>
              <div class="text-h6">
                Resumen de la información ingresada
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12">
                  <p>
                    <strong>Parentesco con el Jefe del Hogar: </strong
                    >{{ persona.parentescoJefeDeHogar.nombre }}
                  </p>
                  <p>
                    <strong>Tipo de Documento: </strong
                    >{{ persona.tipoDocumento.nombre }}
                  </p>
                  <p>
                    <strong>No. Documento: </strong>{{ persona.noDocumento }}
                  </p>
                  <p><strong>Nombre: </strong>{{ persona.nombre }}</p>
                  <p>
                    <strong>Primer Apellido: </strong
                    >{{ persona.primerApellido }}
                  </p>
                  <p>
                    <strong>Segundo Apellido: </strong
                    >{{ persona.segundoApellido }}
                  </p>
                  <p>
                    <strong>Fecha Nacimiento: </strong
                    >{{ persona.fechaNacimiento }}
                  </p>
                  <p><strong>Sexo: </strong>{{ persona.sexo.nombre }}</p>
                  <p><strong>Edad: </strong>{{ persona.edad }}</p>
                  <p>
                    <strong>Nivel Educativo: </strong
                    >{{ persona.nivelEducativo.nombre }}
                  </p>
                  <p><strong>Etnia: </strong>{{ persona.etnia.nombre }}</p>
                  <p>
                    <strong>Ocupacion: </strong>{{ persona.ocupacion.nombre }}
                  </p>
                  <p>
                    <strong>Seguridad Social: </strong
                    >{{ persona.seguridadSocial.nombre }}
                  </p>
                  <p>
                    <strong>Nivel Ingreso: </strong
                    >{{ persona.nivelIngreso.nombre }}
                  </p>
                  <p>
                    <strong>Discapacidad Visual: </strong
                    >{{ persona.discapacidadVisual ? "Si" : "No" }}
                  </p>
                  <p>
                    <strong>Discapacidad Fisica: </strong
                    >{{ persona.discapacidadFisica ? "Si" : "No" }}
                  </p>
                  <p>
                    <strong>Discapacidad Auditiva: </strong
                    >{{ persona.discapacidadAuditiva ? "Si" : "No" }}
                  </p>
                  <p>
                    <strong>Discapacidad NoPresenta: </strong
                    >{{ persona.discapacidadNoPresenta ? "Si" : "No" }}
                  </p>
                  <p>
                    <strong>Discapacidad Mental: </strong
                    >{{ persona.discapacidadMental ? "Si" : "No" }}
                  </p>
                  <p>
                    <strong>Programa Familias En Accion: </strong
                    >{{ persona.programaFamiliasEnAccion ? "Si" : "No" }}
                  </p>
                  <p>
                    <strong>Programa Desplazado Victima: </strong
                    >{{ persona.programaDesplazadoVictima ? "Si" : "No" }}
                  </p>
                  <p>
                    <strong>Programa Jovenes En Accion: </strong
                    >{{ persona.programaJovenesEnAccion ? "Si" : "No" }}
                  </p>
                  <p>
                    <strong>Programa Ingreso Solidario: </strong
                    >{{ persona.programaIngresoSolidario ? "Si" : "No" }}
                  </p>
                  <p>
                    <strong>Programa Adulto Mayor: </strong
                    >{{ persona.programaAdultoMayor ? "Si" : "No" }}
                  </p>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="flex justify-center">
          <!-- <q-btn v-if="step = 1" label="Cancelar" no-caps color="primary" flat class="q-mr-sm" :to="{name: 'personas-vivienda', params: {id: this.viviendaID}}"/> -->
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
            v-if="step < 4"
            label="Siguiente"
            no-caps
            color="primary"
            @click="siguiente"
          />
          <q-btn
            v-else
            label="Guardar Persona"
            no-caps
            color="primary"
            :disable="getPersonaState.loading"
            :loading="getPersonaState.loading"
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
import { date } from "quasar";
export default {
  data() {
    return {
      step: 1,
      personaID: 0,
      persona: {},
      parentescoOptions: [],
      tipoDocOptions: [],
      sexoOptions: [],
      educacionOptions: [],
      etniaOptions: [],
      ocupacionOptions: [],
      seguridadSocialOptions: [],
      nivelIngresosOptions: []
    };
  },

  created() {
    this.viviendaID = this.$route.params.id;
    let categorias = [
      CATEGORIAS.PARENTESCO,
      CATEGORIAS.TIPO_DOCUMENTO_IDENTIDAD,
      CATEGORIAS.SEXO,
      CATEGORIAS.NIVEL_EDUCATIVO,
      CATEGORIAS.ETNIAS,
      CATEGORIAS.OCUPACION,
      CATEGORIAS.SEGURIDAD_SOCIAL,
      CATEGORIAS.NIVEL_INGRESOS
    ];
    this.persona = {
      id: 0,
      noOrden: 0,
      parentescoJefeDeHogar: "",
      tipoDocumento: null,
      noDocumento: "",
      nombre: "",
      primerApellido: "",
      segundoApellido: "",
      fechaNacimiento: "",
      sexo: "",
      edad: "",
      nivelEducativo: "",
      etnia: "",
      ocupacion: "",
      seguridadSocial: "",
      nivelIngreso: "",
      discapacidadVisual: false,
      discapacidadMental: false,
      discapacidadFisica: false,
      discapacidadAuditiva: false,
      discapacidadNoPresenta: false,
      programaFamiliasEnAccion: false,
      programaDesplazadoVictima: false,
      programaJovenesEnAccion: false,
      programaIngresoSolidario: false,
      programaAdultoMayor: false
    };

    if (this.getPersonaState.objPersona.id > 0) {
      this.persona = JSON.parse(
        JSON.stringify(this.getPersonaState.objPersona)
      );
    } else {
      this.$router.push({
        name: "personas-vivienda",
        params: { id: this.viviendaID }
      });
    }

    // this.buscarPersonaAction(this.personaID).then(data => {
    //     console.log(data)
    //     this.persona = data
    // })

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
      data.forEach(opt => {
        if (opt.categoria.codigo === CATEGORIAS.TIPO_DOCUMENTO_IDENTIDAD) {
          this.tipoDocOptions.push(opt);
        } else if (opt.categoria.codigo === CATEGORIAS.PARENTESCO) {
          this.parentescoOptions.push(opt);
        } else if (opt.categoria.codigo === CATEGORIAS.SEXO) {
          this.sexoOptions.push(opt);
        } else if (opt.categoria.codigo === CATEGORIAS.NIVEL_EDUCATIVO) {
          this.educacionOptions.push(opt);
        } else if (opt.categoria.codigo === CATEGORIAS.ETNIAS) {
          this.etniaOptions.push(opt);
        } else if (opt.categoria.codigo === CATEGORIAS.OCUPACION) {
          this.ocupacionOptions.push(opt);
        } else if (opt.categoria.codigo === CATEGORIAS.SEGURIDAD_SOCIAL) {
          this.seguridadSocialOptions.push(opt);
        } else if (opt.categoria.codigo === CATEGORIAS.NIVEL_INGRESOS) {
          this.nivelIngresosOptions.push(opt);
        }
      });
    });
  },
  methods: {
    ...mapActions("persona", ["buscarPersonaAction", "registrarPersonaAction"]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
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
      const fecha = date.formatDate(new Date(), "YYYY-MM-DDTHH:mm:ss.SSSZ");
      this.registrarPersonaAction({
        ...this.persona,
        fechaActualizacion: fecha,
        usuarioActualizacion: this.getUser
      }).then(data => {
        this.$router.push({
          name: "personas-vivienda",
          params: { id: this.persona.encuesta.id }
        });
      });
    },
    validarForm() {
      let stepValue = this.step;
      switch (stepValue) {
        case 1:
          //validar infoPersonal
          this.$refs.infoPersonal.validate().then(success => {
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
        case 2:
          //validar FormLimites
          this.$refs.caracteristicasPersona.validate().then(success => {
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
        case 3:
          //validar FormLimites
          this.$refs.socialPersona.validate().then(success => {
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
    ...mapGetters("persona", ["getPersonaState", "getPersonaPorNoOrden"]),
    ...mapGetters("auth", ["getUser"])
  }
};
</script>

<style></style>
