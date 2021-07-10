<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <q-form ref="administracionForm">
          <p class="text-h6 q-mt-md q-mb-sm">7. Administración Pública</p>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Dirección de la Alcaldía *</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-input
                    dense
                    v-model="infoGeneral.direccionAlcaldia"
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
                No. de Funcionarios de la Alcaldía *
              </div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-input
                    dense
                    v-model="infoGeneral.numeroFuncionarios"
                    lazy-rules
                    :rules="[val => !!val || 'Campo requerido']"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Teléfono fijo *</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-input
                    dense
                    v-model="infoGeneral.telefono"
                    lazy-rules
                    :rules="[val => !!val || 'Campo requerido']"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Horario de Atención *</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-input
                    dense
                    v-model="infoGeneral.horarioDeAtencion"
                    lazy-rules
                    :rules="[val => !!val || 'Campo requerido']"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Correo electrónico *</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-input
                    dense
                    v-model="infoGeneral.correo"
                    lazy-rules
                    :rules="[val => !!val || 'Campo requerido']"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Página Web *</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-input
                    dense
                    v-model="infoGeneral.paginaWeb"
                    lazy-rules
                    :rules="[val => !!val || 'Campo requerido']"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Facebook *</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-input
                    dense
                    v-model="infoGeneral.paginaDeFacebook"
                    lazy-rules
                    :rules="[val => !!val || 'Campo requerido']"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <p class="text-h6 q-mt-md q-mb-sm">7.1. Datos del Alcalde</p>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Nombre completo *</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-input
                    dense
                    v-model="infoGeneral.alcalde"
                    lazy-rules
                    :rules="[val => !!val || 'Campo requerido']"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Partido Político *</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-input
                    dense
                    v-model="infoGeneral.partidoPolitico"
                    lazy-rules
                    :rules="[val => !!val || 'Campo requerido']"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Teléfono *</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-input
                    dense
                    v-model="infoGeneral.telefonoAlcalde"
                    lazy-rules
                    :rules="[val => !!val || 'Campo requerido']"
                  />
                </div>
              </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
              <div class="text-h6 q-mb-none">Correo electrónico *</div>
            </q-card-section>

            <q-card-section>
              <div class="row">
                <div class="col-xs-12 col-sm-6">
                  <q-input
                    dense
                    v-model="infoGeneral.correoAlcalde"
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
      infoGeneral: {}
    };
  },

  created() {
    this.encuestaID = this.$route.params.id;
    this.infoGeneral = {
      id: 0,
      alcalde: "",
      numeroFuncionarios: "",
      partidoPolitico: "",
      telefonoAlcalde: "",
      correoAlcalde: "",
      direccionAlcaldia: "",
      telefono: "",
      horarioDeAtencion: "",
      correo: "",
      paginaDeFacebook: "",
      paginaWeb: "",
      fechaActualizacion: this.getFecha,
      usuarioActualizacion: this.getUser,
      fechaCreacion: this.getFecha,
      usuarioCreacion: this.getUser
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
      this.$refs.administracionForm.validate().then(success => {
        if (success) {
          this.actualizarInformacionGeneralAction({
            ...this.infoGeneral,
            fechaActualizacion: this.getFecha,
            usuarioActualizacion: this.getUser
          }).then(data => {
            this.$router.push({
              name: "secretarias",
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
    ...mapGetters("informacionGeneral", ["getInformacionGeneralState"]),
    ...mapGetters("auth", ["getUser"]),
    getFecha() {
      return date.formatDate(new Date(), "YYYY-MM-DDTHH:mm:ss.SSSZ");
    }
  }
};
</script>

<style></style>
