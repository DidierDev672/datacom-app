<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <q-form ref="viviendaForm">
          <p class="text-h6 q-mt-md q-mb-sm">5. Vivienda</p>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">No. Viviendas Urbanas</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <!-- <q-input
                          dense
                          v-model.number="vivienda.numeroDeViviendasUrbanas"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                  <q-field
                    v-model="vivienda.numeroDeViviendasUrbanas"
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
              <div class="text-h6 q-mb-none">No. Viviendas Rurales</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <!-- <q-input
                          dense
                          v-model.number="vivienda.numeroDeViviendasRurales"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                  <q-field
                    v-model="vivienda.numeroDeViviendasRurales"
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
              <div class="text-h6 q-mb-none">No. Hogares Urbanos</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <!-- <q-input
                          dense
                          v-model.number="vivienda.numeroDeHogaresUrbanos" 
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]"/> -->
                  <q-field
                    v-model="vivienda.numeroDeHogaresUrbanos"
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
              <div class="text-h6 q-mb-none">No. Hogares Rurales</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <!-- <q-input
                          dense
                          v-model.number="vivienda.numeroDeHogaresRurales" 
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]"/> -->
                  <q-field
                    v-model="vivienda.numeroDeHogaresRurales"
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
              <div class="text-h6 q-mb-none">Déficit Cuantitativo</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <!-- <q-input
                          dense
                          v-model.number="vivienda.deficitCuantitativo"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                  <q-field v-model="vivienda.deficitCuantitativo" hint="#,###">
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
              <div class="text-h6 q-mb-none">Déficit Cualitativo</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <!-- <q-input
                          dense
                          v-model.number="vivienda.deficitCualitativo"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                  <q-field v-model="vivienda.deficitCualitativo" hint="#,###">
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
        </q-form>

        <div class="flex justify-center">
          <q-btn
            label="Guardar y continuar"
            no-caps
            color="primary"
            :disable="getViviendaState.loading"
            :loading="getViviendaState.loading"
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
      vivienda: {},
      numero: {
        decimal: ".",
        thousands: ",",
        precision: 0,
        masked: false /* doesn't work with directive */
      },
      decimales: {
        decimal: ".",
        thousands: ",",
        suffix: " %",
        precision: 2,
        masked: false /* doesn't work with directive */
      }
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    this.vivienda = {
      id: 0,
      deficitCualitativo: 0,
      deficitCuantitativo: 0,
      numeroDeHogaresRurales: 0,
      numeroDeHogaresUrbanos: 0,
      numeroDeViviendasRurales: 0,
      numeroDeViviendasUrbanas: 0,
      fechaActualizacion: this.getFecha,
      usuarioActualizacion: this.getUser,
      fechaCreacion: this.getFecha,
      usuarioCreacion: this.getUser
    };
    this.buscarViviendasAction(this.encuestaID).then(data => {
      if (data.id > 0) {
        this.vivienda = { ...data };
      }
    });
  },
  methods: {
    ...mapActions("viviendas", [
      "registrarViviendaAction",
      "buscarViviendasAction"
    ]),
    onSubmit() {
      this.$refs.viviendaForm.validate().then(success => {
        if (success) {
          console.log("Form valido", this.vivienda);
          this.registrarViviendaAction({
            ...this.vivienda,
            encuesta: {
              id: this.encuestaID
            },
            fechaActualizacion: this.getFecha,
            usuarioActualizacion: this.getUser
          }).then(data => {
            this.vivienda.id = data;
            this.$router.push({
              name: "cobertura-servicio",
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
    ...mapGetters("viviendas", ["getViviendaState"]),
    ...mapGetters("auth", ["getUser"]),
    getFecha() {
      return date.formatDate(new Date(), "YYYY-MM-DDTHH:mm:ss.SSSZ");
    }
  }
};
</script>

<style></style>
