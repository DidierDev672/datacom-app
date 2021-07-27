<template>
  <div class="q-ma-sm">
    <q-form ref="fiscalForm">
      <p class="text-h6">7. Nivel gerencial</p>

      <div class="row q-col-gutter-sm">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Frecuencia reunión directiva</p>
          <q-input
            outlined
            v-model="jacInfoDB.frecuenciaReunionDirectiva"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']"
          />
        </div>
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">¿Hace cuánto está nombrada la directiva?</p>
          <q-input
            outlined
            v-model="jacInfoDB.tiempoJuntaDirectiva"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mb-md">
        <div class="col-xs-12 col-md-4">
          <p class="text-h6">Años de permanencia</p>
          <q-input
            outlined
            v-model="jacInfoDB.aniosPermanenciaDirectiva"
            hint="Hace referencia a los años que tiene nombrado el presidente actual de la Jac."
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']"
          />
        </div>
        <div class="col-xs-12 col-md-4">
          <p class="text-h6">Frecuencia reunión socios</p>
          <q-input
            outlined
            v-model="jacInfoDB.frecuenciaReunionSocios"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']"
          />
        </div>
        <div class="col-xs-12 col-md-4">
          <p class="text-h6">Fecha última asamblea</p>
          <q-input
            outlined
            v-model="jacInfoDB.fechaUltimaAsamblea"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm">
        <div class="col-xs-12 col-sm-4">
          <p class="text-h6">No. Socios que asistieron</p>
          <q-input
            outlined
            v-model="jacInfoDB.noSociosAsistentes"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']"
          />
        </div>
        <div class="col-xs-12 col-sm-8">
          <p class="text-h6">
            No. dignatarios que manejan programas de computador
          </p>
          <q-input
            outlined
            type="number"
            v-model.number="jacInfoDB.noDignatariosComputacion"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm">
        <div class="col-xs-12">
          <p class="text-h6">¿Tiene plan veredal?</p>
          <q-option-group
            inline
            :options="options"
            type="radio"
            v-model="jacInfoDB.tienePlanVeredal"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12">
          <p class="text-h6">¿La organización cuenta con plan de acción?</p>
          <q-option-group
            inline
            :options="options"
            type="radio"
            v-model="jacInfoDB.tienePlanAccion"
          />
        </div>
      </div>

      <div align="right">
        <q-btn @click="onSubmit" color="primary">Actualizar</q-btn>
      </div>
    </q-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { CATEGORIAS } from "src/utils/config";

export default {
  name: "JacInfo",
  data() {
    return {
      jacID: 0,
      jacInfoDB: {},
      options: [
        { label: "Si", value: true },
        { label: "No", value: false }
      ]
    };
  },
  created() {
    this.jacID = this.$route.params.id;

    this.jacInfoDB = {
      id: this.$route.params.id,
      frecuenciaReunionDirectiva: "",
      tiempoJuntaDirectiva: "",
      aniosPermanenciaDirectiva: "",
      frecuenciaReunionSocios: "",
      fechaUltimaAsamblea: "",
      noSociosAsistentes: "",
      noDignatariosComputacion: "",
      tienePlanVeredal: true,
      tienePlanAccion: true
    };
    this.buscarJacInfoAction(this.jacID).then(data => {
      if (data.id > 0) {
        this.jacInfoDB = { ...data };
      }
    });
  },
  methods: {
    ...mapActions("jacInfo", ["buscarJacInfoAction", "registrarJacInfoAction"]),
    onSubmit() {
      this.$refs.fiscalForm.validate().then(success => {
        if (success) {
          this.registrarJacInfoAction(this.jacInfoDB).then(data => {
            this.$q.notify({
              message: "Información actualizada correctamente",
              color: "positive"
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
    ...mapGetters("jacInfo", ["getJacInfoState"])
  }
};
</script>

<style lang="sass"></style>
