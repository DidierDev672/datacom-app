<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <div>
          <q-form ref="fiestasForm">
            <p class="text-h6 q-mt-md q-mb-sm">Fiestas Tradicionales</p>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Fiesta Tradicional # 1</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-input
                      type="textarea"
                      dense
                      v-model="infoGeneral.expresionCultural"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Fiesta Tradicional # 2</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-input
                      type="textarea"
                      dense
                      v-model="infoGeneral.expresionArtistica"
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
export default {
  data() {
    return {
      encuestaID: 0,
      infoGeneral: {}
    };
  },
  created() {
    this.infoGeneral = {
      id: 0,
      expresionCultural: "",
      expresionArtistica: ""
    };
    this.encuestaID = this.$route.params.id;
    this.buscarInformacionGeneralAction(this.encuestaID).then(data => {
      if (data.id > 0) {
        this.infoGeneral = { ...data };
      }
    });
  },
  methods: {
    ...mapActions("informacionGeneral", [
      "buscarInformacionGeneralAction",
      "guardarInformacionGeneralAction"
    ]),
    onSubmit() {
      this.guardarInformacionGeneralAction({
        ...this.infoGeneral,
        encuesta: {
          id: this.encuestaID
        },
        usuarioCreacion: this.getUser,
        usuarioActualizacion: this.getUser
      }).then(data => {
        this.$router.push({
          name: "c-fin-encuesta",
          params: { id: this.encuestaID }
        });
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
