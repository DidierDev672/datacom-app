<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <q-form ref="ubicacionForm">
          <p class="text-h6 q-mt-md q-mb-sm">13. Participación</p>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">
                Porcentaje de participación elecciones locales
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 ">
                  <!-- <q-input dense v-model="infoGeneral.porcentajeElecciones" /> -->
                  <q-field
                    v-model="infoGeneral.porcentajeElecciones"
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
                Total votos del alcalde
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 ">
                  <!-- <q-input dense v-model="infoGeneral.totalVotosAlcalde" /> -->
                  <q-field v-model="infoGeneral.totalVotosAlcalde" hint="#,###">
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
              <div class="text-h6 q-mb-none">Porcentaje votos</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 ">
                  <!-- <q-input dense v-model="infoGeneral.porcentajeVotos" /> -->
                  <q-field v-model="infoGeneral.porcentajeVotos" hint="#,###">
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
              <div class="text-h6 q-mb-none">Fuente de la Información</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 ">
                  <q-input
                    dense
                    v-model="infoGeneral.fuenteInfoParticipacion"
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
        suffix: " %",
        precision: 2,
        masked: false /* doesn't work with directive */
      }
    };
  },

  created() {
    this.encuestaID = this.$route.params.id;
    this.infoGeneral = {
      id: 0,
      fuenteInfoParticipacion: "",
      porcentajeElecciones: "",
      totalVotosAlcalde: "",
      porcentajeVotos: "",
      fechaActualizacion: this.getFecha,
      usuarioActualizacion: this.getUser,
      fechaCreacion: this.getFecha,
      usuarioCreacion: this.getUser
    };

    this.buscarInformacionGeneralAction(this.encuestaID).then(data => {
      if (data.id > 0) {
        this.infoGeneral = { ...data };
      }
    });
  },

  methods: {
    ...mapActions("informacionGeneral", [
      "buscarInformacionGeneralAction",
      "actualizarInformacionGeneralAction"
    ]),
    onSubmit() {
      this.actualizarInformacionGeneralAction({
        ...this.infoGeneral,
        fechaActualizacion: this.getFecha,
        usuarioActualizacion: this.getUser
      }).then(data => {
        this.infoGeneral.id = data;
        this.$router.push({
          name: "medios",
          params: { id: this.encuestaID }
        });
      });
    }
  },

  computed: {
    ...mapGetters("informacionGeneral", ["getInformacionGeneralState"]),
    ...mapGetters("auth", ["getUser"]),
    getFecha() {
      return date.formatDate(new Date(), "YYYY-MM-DDTHH:mm:ss.SSSZ");
    }
  }
};
</script>

<style></style>
