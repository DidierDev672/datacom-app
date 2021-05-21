<template>
  <q-dialog
    persistent
    transition-show="scale"
    transition-hide="scale"
    v-model="show"
  >
    <q-card>
      <q-card-section>
        <div class="text-h6">Demografía</div>
      </q-card-section>

      <q-separator />

      <q-card-section style="max-height: 50vh" class="scroll">
        <q-form class="q-gutter-md">

          <p>Población</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="demografia.poblacionUrbana"
                label="Población Urbana"
              /> 
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="demografia.poblacionRural"
                label="Población Rural"
              /> 
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="demografia.noHombres"
                label="Hombres"
              /> 
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="demografia.noMujeres"
                label="Mujeres"
              /> 
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="demografia.noIndigenas"
                label="Indígenas"
              /> 
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="demografia.noAfro"
                label="Afro"
              /> 
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="demografia.tasaFecundidad"
                label="Tasa de Fecundidad"
              /> 
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="demografia.tasaNatalidad"
                label="Tasa de Natalidad"
              /> 
            </div>
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="demografia.densidad"
                label="Densidad poblacional"
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
      demografia: {}
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
        poblacionUrbana: this.demografia.poblacionUrbana,
        poblacionRural: this.demografia.poblacionRural,
        noHombres: this.demografia.noHombres,
        noMujeres: this.demografia.noMujeres,
        noIndigenas: this.demografia.noIndigenas,
        noAfro: this.demografia.noAfro,
        tasaFecundidad: this.demografia.tasaFecundidad,
        tasaNatalidad: this.demografia.tasaNatalidad,
        densidad: this.demografia.densidad,
        municipio: {
          id: this.municipio.id
        }
      };

      if (infoGeneral.id > 0) {
        //Actualizar
        this.actualizarInformacionGeneralAction(infoGeneral).then(() => {
          this.close();
        });
      } else {
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
    this.demografia = {
      id: 0,
      poblacionUrbana: "",
      poblacionRural: "",
      noHombres: "",
      noMujeres: "",
      noIndigenas: "",
      noAfro: "",
      tasaFecundidad: "",
      tasaNatalidad: "",
      densidad: "",
    }

    if (this.getMunicipioState.municipio.informacionGeneral != null &&
      Object.keys(this.getMunicipioState.municipio.informacionGeneral).length > 0 ) {
        this.demografia.id = this.getMunicipioState.municipio.informacionGeneral.id;
        this.demografia.poblacionUrbana = this.getMunicipioState.municipio.informacionGeneral.poblacionUrbana;
        this.demografia.poblacionRural = this.getMunicipioState.municipio.informacionGeneral.poblacionRural;
        this.demografia.noHombres = this.getMunicipioState.municipio.informacionGeneral.noHombres;
        this.demografia.noMujeres = this.getMunicipioState.municipio.informacionGeneral.noMujeres;
        this.demografia.noIndigenas = this.getMunicipioState.municipio.informacionGeneral.noIndigenas;
        this.demografia.noAfro = this.getMunicipioState.municipio.informacionGeneral.noAfro;
        this.demografia.tasaFecundidad = this.getMunicipioState.municipio.informacionGeneral.tasaFecundidad;
        this.demografia.tasaNatalidad = this.getMunicipioState.municipio.informacionGeneral.tasaNatalidad;
        this.demografia.densidad = this.getMunicipioState.municipio.informacionGeneral.densidad;
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
