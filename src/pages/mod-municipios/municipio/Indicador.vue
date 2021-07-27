<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <q-form ref="indicadorForm">
          <p class="text-h6 q-mt-md q-mb-sm">11. Indicadores de Gestión</p>
          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Indice de desempeño Fiscal</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <!-- <q-input
                          dense
                          v-model.number="indicador.indiceDeDesempenoFiscal"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                  <q-field
                    v-model="indicador.indiceDeDesempenoFiscal"
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
                        v-bind="decimales"
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
              <div class="text-h6 q-mb-none">Nivel del Desempeño Fiscal</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-select
                    dense
                    v-model="indicador.nivelDeDesempeno"
                    :options="options"
                    label="Seleccione una opción"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Índice de Funcionamiento</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <!-- <q-input
                          dense
                          v-model.number="indicador.indiceDeFuncionamiento"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                  <q-field
                    v-model="indicador.indiceDeFuncionamiento"
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
                        v-bind="decimales"
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
              <div class="text-h6 q-mb-none">
                ¿Cumple Límite de Ley 617 de 2000
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-option-group
                    :options="optionsCumple"
                    type="radio"
                    v-model="indicador.cumpleLimiteDeley"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Dependencia de Transferencias</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <!-- <q-input
                          dense
                          v-model.number="indicador.dependenciaDetransferencia"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                  <q-field
                    v-model="indicador.dependenciaDetransferencia"
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
                        v-bind="decimales"
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
              <div class="text-h6 q-mb-none">
                Índice de Gestión y Transparencia
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <!-- <q-input
                          dense
                          v-model.number="indicador.indiceDeGestionYTransferencia"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                  <q-field
                    v-model="indicador.indiceDeGestionYTransferencia"
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
                        v-bind="decimales"
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
              <div class="text-h6 q-mb-none">Índice de Resultado</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <!-- <q-input
                          dense
                          v-model.number="indicador.indiceDeResultado"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                  <q-field v-model="indicador.indiceDeResultado" hint="#,###">
                    <template
                      v-slot:control="{ id, floatingLabel, value, emitValue }"
                    >
                      <money
                        :id="id"
                        class="q-field__input"
                        :value="value"
                        @input="emitValue"
                        v-bind="decimales"
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
              <div class="text-h6 q-mb-none">
                Medidor de desempeño Municipal
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <!-- <q-input
                          dense
                          v-model.number="indicador.medidorDesempenoMunicipal"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                  <q-field
                    v-model="indicador.medidorDesempenoMunicipal"
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
                        v-bind="decimales"
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
              <div class="text-h6 q-mb-none">Nivel</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-select
                    dense
                    v-model="indicador.nivelDesempenoMunicipal"
                    :options="optionsDesempeño"
                    label="Seleccione una opción"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Fuente de la Información</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-input
                    dense
                    v-model="indicador.fuente"
                    hint="Ingrese la fuente de donde obtuvo esta información"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>
        </q-form>

        <div class="flex justify-center">
          <q-btn
            label="Guardar y continuar"
            no-caps
            color="primary"
            :disable="getIndicadorState.loading"
            :loading="getIndicadorState.loading"
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
import { date } from "quasar";
export default {
  data() {
    return {
      encuestaID: 0,
      indicador: {},
      decimales: {
        decimal: ".",
        thousands: ",",
        suffix: " %",
        precision: 2,
        masked: false /* doesn't work with directive */
      },
      options: [
        "Sostenible",
        "Solvente",
        "Vulnerable",
        "En Riesgo",
        "En Deterioro"
      ],
      optionsDesempeño: ["Bajo", "Medio", "Alto", "En Riesgo"],
      optionsCumple: [
        { label: "Si", value: true },
        { label: "No", value: false }
      ]
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    this.indicador = {
      id: 0,
      fuente: "",
      indiceDeDesempenoFiscal: "",
      nivelDeDesempeno: "",
      indiceDeFuncionamiento: "",
      cumpleLimiteDeley: true,
      dependenciaDetransferencia: "",
      indiceDeGestionYTransferencia: "",
      indiceDeResultado: "",
      medidorDesempenoMunicipal: "",
      nivelDesempenoMunicipal: "",
      fechaActualizacion: this.getFecha,
      usuarioActualizacion: this.getUser,
      fechaCreacion: this.getFecha,
      usuarioCreacion: this.getUser
    };

    this.buscarIndicadorAction(this.encuestaID).then(data => {
      if (data.id > 0) {
        this.indicador = { ...data };
      }
    });
  },
  methods: {
    ...mapActions("indicador", [
      "registrarIndicadorAction",
      "buscarIndicadorAction"
    ]),
    onSubmit() {
      this.$refs.indicadorForm.validate().then(success => {
        if (success) {
          console.log("Form valido", this.indicador);
          this.registrarIndicadorAction({
            ...this.indicador,
            encuesta: {
              id: this.encuestaID
            },
            fechaActualizacion: this.getFecha,
            usuarioActualizacion: this.getUser
          }).then(data => {
            this.indicador.id = data;
            this.$router.push({
              name: "territorio",
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
    }
  },
  computed: {
    ...mapGetters("indicador", ["getIndicadorState"]),
    ...mapGetters("auth", ["getUser"]),
    getFecha() {
      return date.formatDate(new Date(), "YYYY-MM-DDTHH:mm:ss.SSSZ");
    }
  }
};
</script>

<style></style>
ViviendaCard
