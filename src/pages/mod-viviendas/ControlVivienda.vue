<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <div>
          <q-form ref="controlForm">
            <h6 class="q-mt-sm q-mb-md">
              Información de la persona que brinda la información
            </h6>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Nombre
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      outlined
                      v-model="datosVivienda.nombre"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                      hint="Ingrese primer y segundo nombre"
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
                      outlined
                      v-model="datosVivienda.primerApellido"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
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
                    <q-input outlined v-model="datosVivienda.segundoApellido" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Teléfono
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      outlined
                      v-model="datosVivienda.telefono"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">
                  Email
                </div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input outlined v-model="datosVivienda.email" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div class="flex justify-center">
          <q-btn
            class="full-width"
            label="Guardar y continuar"
            no-caps
            color="primary"
            :disable="getDatosViviendaState.loading"
            :loading="getDatosViviendaState.loading"
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
      encuestaID: 0,
      datosVivienda: {}
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    this.datosVivienda = {
      id: 0,
      nombre: "",
      primerApellido: "",
      segundoApellido: "",
      telefono: "",
      email: ""
    };

    this.buscarDatosViviendaAction(this.encuestaID).then(data => {
      if (data.id > 0) {
        this.datosVivienda = { ...data };
      }
    });
  },
  methods: {
    ...mapActions("datosVivienda", [
      "buscarDatosViviendaAction",
      "actualizarDatosViviendaAction"
    ]),
    onSubmit() {
      //validar FormUbicacion
      this.$refs.controlForm.validate().then(success => {
        if (success) {
          this.actualizarDatosViviendaAction({
            ...this.datosVivienda,
            encuesta: {
              id: this.encuestaID
            }
          }).then(data => {
            this.datosVivienda.id = data;
            this.$router.push({
              name: "v-fin-encuesta",
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
    ...mapGetters("datosVivienda", ["getDatosViviendaState"])
  }
};
</script>

<style></style>
