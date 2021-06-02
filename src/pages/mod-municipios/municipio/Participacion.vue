<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <q-form ref="ubicacionForm">
          <p class="text-h6 q-mt-md q-mb-sm">13. Participación</p>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Porcentaje de participación elecciones locales</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-input dense v-model="infoGeneral.porcentajeElecciones" />
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
                <div class="col-xs-12 col-sm-6">
                  <q-input dense v-model="infoGeneral.totalVotosAlcalde" />
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
                <div class="col-xs-12 col-sm-6">
                  <q-input dense v-model="infoGeneral.porcentajeVotos" />
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
export default {
  data() {
    return {
      encuestaID: 0,
      infoGeneral: {}
    };
  },

  created() {
    this.encuestaID = this.$route.params.id;
    this.infoGeneral = {
      id: 0,
      porcentajeElecciones: "",
      totalVotosAlcalde: "",
      porcentajeVotos: ""
    };

    this.buscarInformacionGeneralAction(this.encuestaID).then(data => {
      console.log(data);
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
      this.actualizarInformacionGeneralAction(this.infoGeneral).then(data => {
          this.infoGeneral.id = data
        this.$router.push({
          name: "medios",
          params: { id: this.encuestaID }
        });
      });
    }
  },

  computed: {
    ...mapGetters("informacionGeneral", ["getInformacionGeneralState"])
  }
};
</script>

<style></style>
