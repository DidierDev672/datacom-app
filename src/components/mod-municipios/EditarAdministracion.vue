<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">Administración Pública</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-form class="q-gutter-md">
          <p>Datos de contacto</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-7">
              <q-input
                outlined
                v-model="administracion.direccionAlcaldia"
                label="Dirección alcaldia"
              />
            </div>
            <div class="col-xs-12 col-sm-5">
              <q-input
                outlined
                v-model="administracion.telefono"
                label="Teléfono fijo alcaldia"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="administracion.horarioDeAtencion"
                label="Horario de Atención"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="administracion.correo"
                label="Correo electrónico de la alcaldia"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="administracion.paginaWeb"
                label="Página web"
              />
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="administracion.paginaDeFacebook"
                label="Facebook"
              />
            </div>
          </div>

          <p>Datos del alcalde</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="administracion.alcalde"
                label="Nombre completo del alcalde"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="administracion.partidoPolitico"
                label="Partido político del alcalde"
              />
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-7">
              <q-input
                outlined
                v-model="administracion.correoAlcalde"
                label="Email del alcalde"
              />
            </div>
            <div class="col-xs-12 col-sm-5">
              <q-input
                outlined
                v-model="administracion.telefonoAlcalde"
                label="Teléfono del alcalde"
              />
            </div>
          </div>

        </q-form>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right">
        <q-btn
          flat
          label="Cancelar"
          color="primary"
          :disable="getMunicipioState.loading"
          @click="close"
        />
        <q-btn
          label="Guardar"
          color="primary"
          :loading="getMunicipioState.loading"
          :disable="getMunicipioState.loading"
          @click="actualizar"
        >
          <template v-slot:loading>
            <q-spinner-facebook />
          </template>
        </q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data() {
    return {
      show: true,
      administracion: {}
    };
  },

  methods: {
    ...mapActions("municipios", [
      "actualizarInformacionGeneralAction",
      "guardarInformacionGeneralAction"
    ]),
    actualizar() {
      let infoGeneral = {
        ...this.getMunicipioState.municipio.informacionGeneral,
        alcalde: this.administracion.alcalde,
        partidoPolitico: this.administracion.partidoPolitico,
        telefonoAlcalde: this.administracion.telefonoAlcalde,
        correoAlcalde: this.administracion.correoAlcalde,
        direccionAlcaldia: this.administracion.direccionAlcaldia,
        telefono: this.administracion.telefono,
        horarioDeAtencion: this.administracion.horarioDeAtencion,
        correo: this.administracion.correo,
        paginaDeFacebook: this.administracion.paginaDeFacebook,
        paginaWeb: this.administracion.paginaWeb,
        municipio: {
          id: this.municipio.id
        }
      };

      if (infoGeneral.id > 0) {
          console.log('>0: ', infoGeneral);
        //Actualizar
        this.actualizarInformacionGeneralAction(infoGeneral).then(() => {
          this.close();
        });
      } else {
          console.log('<0: ', infoGeneral);
        //Guardar
        this.guardarInformacionGeneralAction(infoGeneral).then(() => {
          this.close();
        });
      }
    },
    close() {
      this.$emit("close");
    }
  },
  created() {
    this.administracion = {
      id: 0,
      alcalde: "",
      partidoPolitico: "",
      telefonoAlcalde: "",
      correoAlcalde: "",
      direccionAlcaldia: "",
      telefono: "",
      horarioDeAtencion: "",
      correo: "",
      paginaDeFacebook: "",
      paginaWeb: ""
    };

    if (
      this.getMunicipioState.municipio.informacionGeneral != null &&
      Object.keys(this.getMunicipioState.municipio.informacionGeneral).length > 0
    ) {
      this.administracion.id = this.getMunicipioState.municipio.informacionGeneral.id;
      this.administracion.alcalde = this.getMunicipioState.municipio.informacionGeneral.alcalde;
      this.administracion.partidoPolitico = this.getMunicipioState.municipio.informacionGeneral.partidoPolitico;
      this.administracion.telefonoAlcalde = this.getMunicipioState.municipio.informacionGeneral.telefonoAlcalde;
      this.administracion.correoAlcalde = this.getMunicipioState.municipio.informacionGeneral.correoAlcalde;
      this.administracion.direccionAlcaldia = this.getMunicipioState.municipio.informacionGeneral.direccionAlcaldia;
      this.administracion.telefono = this.getMunicipioState.municipio.informacionGeneral.telefono;
      this.administracion.horarioDeAtencion = this.getMunicipioState.municipio.informacionGeneral.horarioDeAtencion;
      this.administracion.correo = this.getMunicipioState.municipio.informacionGeneral.correo;
      this.administracion.paginaDeFacebook = this.getMunicipioState.municipio.informacionGeneral.paginaDeFacebook;
      this.administracion.paginaWeb = this.getMunicipioState.municipio.informacionGeneral.paginaWeb;
    }
  },
  computed: {
    ...mapGetters("municipios", ["getMunicipioState"]),
    municipio() {
      return this.getMunicipioState.municipio;
    }
  }
};
</script>

<style></style>
