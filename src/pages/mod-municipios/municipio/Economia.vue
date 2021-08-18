<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <q-form ref="economiaForm">
          <p class="text-h6 q-mt-md q-mb-sm">15. Economía y Marca Propia</p>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">
                Producto Artesanal Característico
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 ">
                  <q-input
                    dense
                    v-model="infoGeneral.productoArtesanal"
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
                Riqueza Natural Orgullo del Municipio
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 ">
                  <q-input
                    dense
                    v-model="infoGeneral.riquesaNatural"
                    lazy-rules
                    :rules="[val => !!val || 'Campo requerido']"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Bien o Expresión Cultural</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 ">
                  <q-input
                    dense
                    v-model="infoGeneral.expresionCultural"
                    lazy-rules
                    :rules="[val => !!val || 'Campo requerido']"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Expresión Artística</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 ">
                  <q-input
                    dense
                    v-model="infoGeneral.expresionArtistica"
                    lazy-rules
                    :rules="[val => !!val || 'Campo requerido']"
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
      productoArtesanal: "",
      riquesaNatural: "",
      expresionCultural: "",
      expresionArtistica: ""
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
      this.$refs.economiaForm.validate().then(success => {
        if (success) {
          this.actualizarInformacionGeneralAction(this.infoGeneral).then(
            data => {
              this.infoGeneral.id = data;
              this.$router.push({
                name: "productos",
                params: { id: this.encuestaID }
              });
            }
          );
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
    ...mapGetters("informacionGeneral", ["getInformacionGeneralState"])
  }
};
</script>

<style></style>
