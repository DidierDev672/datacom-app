<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <div>
          <q-form ref="demografiaForm">
            <p class="text-h6 q-mt-md q-mb-sm">2. Demografía</p>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Población urbana</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-field
                      v-model.number="infoGeneral.poblacionUrbana"
                      @input="getDensidad"
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

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Población rural</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-field
                      v-model.number="infoGeneral.poblacionRural"
                      @input="getDensidad"
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
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No. Hombres</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12  ">
                    <q-field
                      v-model.number="infoGeneral.noHombres"
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

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No. Mujeres</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12  ">
                    <!-- <q-input
                            dense
                            type="number"
                            v-model.number="infoGeneral.noMujeres"
                            lazy-rules
                            :rules="[
                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero ',
                            val => val > 0 || 'El valor ingresado debe ser mayor a cero '
                            ]"/> -->
                    <q-field v-model="infoGeneral.noMujeres" hint="#,###">
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

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No. Indígenas</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12  ">
                    <!-- <q-input
                            dense
                            type="number"
                            v-model.number="infoGeneral.noIndigenas"
                            lazy-rules
                            :rules="[
                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero ',
                            val => val > 0 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->
                    <q-field v-model="infoGeneral.noIndigenas" hint="#,###">
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

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No. Afro</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12  ">
                    <!-- <q-input
                            dense
                            type="number"
                            v-model.number="infoGeneral.noAfro"
                            lazy-rules
                            :rules="[
                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero ',
                            val => val > 0 || 'El valor ingresado debe ser mayor a cero '
                            ]"/> -->
                    <q-field v-model="infoGeneral.noAfro" hint="#,###">
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

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Tasa de Fecundidad</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12  ">
                    <q-input
                      dense
                      v-model="infoGeneral.tasaFecundidad"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Tasa de Natalidad</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12  ">
                    <q-input
                      dense
                      v-model="infoGeneral.tasaNatalidad"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Densidad</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12  ">
                    <q-field v-model="infoGeneral.densidad" hint="#,###">
                      <template
                        v-slot:control="{ id, floatingLabel, value, emitValue }"
                      >
                        <money
                          :id="id"
                          readonly
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
                <div class="text-h6 q-mb-none">Fuente de la Información</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12  ">
                    <q-input
                      dense
                      v-model="infoGeneral.fuenteDemografia"
                      hint="Ingrese la fuente de donde obtuvo esta información"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>
        <div class="flex justify-center">
          <q-btn
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
      numero: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false /* doesn't work with directive */
      },
      decimales: {
        decimal: ".",
        thousands: ",",
        precision: 2,
        masked: false /* doesn't work with directive */
      }
    };
  },
  created() {
    this.infoGeneral = {
      id: 0,
      fuenteDemografia:
        "DNP Sistema de información Terridata datos de 2021 proyectados del Censo 2018",
      poblacionUrbana: 0,
      poblacionRural: 0,
      noHombres: 0,
      noMujeres: 0,
      noIndigenas: 0,
      noAfro: 0,
      densidad: 0,
      tasaFecundidad: 0,
      tasaNatalidad: 0
    };
    this.encuestaID = this.$route.params.id;

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
    onSubmit() {
      this.$refs.demografiaForm.validate().then(success => {
        if (success) {
          this.guardarInformacionGeneralAction({
            ...this.infoGeneral,
            encuesta: {
              id: this.encuestaID
            },
            usuarioActualizacion: this.getUser
          }).then(data => {
            this.$router.push({
              name: "poblacion",
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
    getDensidad(value) {
      console.log("Llama el metodo getDensidad: ", value);
      let extension = parseInt(this.infoGeneral.extension);
      if (extension > 0) {
        console.log("Extensión es mayor que cero: ", this.infoGeneral.densidad);
        this.infoGeneral.densidad =
          (this.infoGeneral.poblacionUrbana + this.infoGeneral.poblacionRural) /
          extension;
      } else {
        console.log(
          "Extensión NO es mayor que cero: ",
          this.infoGeneral.densidad
        );
      }
    }
  },
  computed: {
    ...mapGetters("informacionGeneral", ["getInformacionGeneralState"]),
    ...mapGetters("auth", ["getUser"])
  }
};
</script>
