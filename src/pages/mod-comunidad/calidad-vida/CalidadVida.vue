<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <q-form ref="calidadForm">
          <p class="text-h6 q-mt-md q-mb-sm">
            Población del Sistema de Seguridad Social
          </p>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Población Régimen Subsidiado</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 ">
                  <q-input
                    dense
                    v-model.number="calidad.noPersonasSubsidiado"
                    hint="Número de personas"
                    type="number"
                    lazy-rules
                    :rules="[
                      val =>
                        (val !== null && val !== '') ||
                        'Debe ingresar un valor ',
                      val =>
                        val > -1 || 'El valor ingresado debe ser mayor a cero '
                    ]"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">
                Población Régimen Contributivo
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 ">
                  <q-input
                    dense
                    v-model.number="calidad.noPersonasContributivo"
                    hint="Número de personas"
                    type="number"
                    lazy-rules
                    :rules="[
                      val =>
                        (val !== null && val !== '') ||
                        'Debe ingresar un valor ',
                      val =>
                        val > -1 || 'El valor ingresado debe ser mayor a cero '
                    ]"
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
            :disable="getCalidadDeVidaState.loading"
            :loading="getCalidadDeVidaState.loading"
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
export default {
  data() {
    return {
      calidad: {},
      encuestaID: 0
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    this.calidad = {
      id: 0,
      noPersonasSubsidiado: 0,
      noPersonasContributivo: 0
    };
    this.buscarCalidadDeVidaAction(this.encuestaID).then(data => {
      if (data.id > 0) {
        this.calidad = { ...data };
      }
    });
  },
  methods: {
    ...mapActions("calidadDeVida", [
      "registrarCalidadDeVidaAction",
      "buscarCalidadDeVidaAction"
    ]),
    onSubmit() {
      this.$refs.calidadForm.validate().then(success => {
        if (success) {
          console.log("Form valido", this.calidad);
          this.registrarCalidadDeVidaAction({
            ...this.calidad,
            encuesta: {
              id: this.encuestaID
            },
            usuarioCreacion: this.getUser,
            usuarioActualizacion: this.getUser
          }).then(data => {
            this.calidad.id = data;
            this.$router.push({
              name: "c-poblacion-infantil",
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
    ...mapGetters("calidadDeVida", ["getCalidadDeVidaState"]),
    ...mapGetters("auth", ["getUser"])
  }
};
</script>

<style></style>
