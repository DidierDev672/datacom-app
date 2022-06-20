<template>
<div>
  <div class="text-h6 page-title-box" >Nivel gerencial</div>
  <div class="q-ma-md">
    <q-form ref="fiscalForm" class="bg-white q-pa-md">
      <p class="text-h6">7. Nivel gerencial</p>

      <div class="row q-col-gutter-sm">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Frecuencia reunión junta directiva</p>
          <q-input
            outlined
            v-model="jacInfoDB.frecuenciaReunionDirectiva"
          />
        </div>
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">Fecha de última reunión</p>
          <!-- <q-input
            outlined
            v-model="jacInfoDB.fechaReuniondirectiva"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']"
          /> -->

          <q-input
                outlined
                v-model="jacInfoDB.fechaReuniondirectiva"
                mask="date"
              >
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy
                      ref="qDateProxy"
                      transition-show="scale"
                      transition-hide="scale"
                    >
                      <q-date v-model="jacInfoDB.fechaReuniondirectiva">
                        <div class="row items-center justify-end">
                          <q-btn
                            v-close-popup
                            label="Close"
                            color="primary"
                            flat
                          />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>

        </div>
      </div>

      <div class="row q-col-gutter-sm q-mb-md">
<div class="col-xs-12">
          <p class="text-h6">Es acorde frecuencia Reunión Junta Directiva Real con lo planeado</p>
          <q-option-group
                inline
                :options="options"
                type="radio"
                v-model="jacInfoDB.esAcordeLaReunionDirectiva"
              />
        </div>
      </div>

      <div class="row q-col-gutter-sm q-mb-md">
        <!-- <div class="col-xs-12 col-md-4">
          <p class="text-h6">Años de permanencia</p>
          <q-input
            outlined
            v-model="jacInfoDB.aniosPermanenciaDirectiva"
            hint="Hace referencia a los años que tiene nombrado el presidente actual de la Jac."
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']"
          />
        </div> -->
        <div class="col-xs-12 col-md-4">
          <p class="text-h6">No. dignatarios que asistieron</p>
          <q-input
            outlined
            v-model="jacInfoDB.noDignatariosAsistentes"
          />
        </div>


        <!-- <div class="col-xs-12 col-md-4">
          <p class="text-h6">Frecuencia reunión socios</p>
          <q-input
            outlined
            v-model="jacInfoDB.frecuenciaReunionSocios"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']"
          />
        </div> -->
        <div class="col-xs-12 col-md-4">
          <p class="text-h6">Fecha última asamblea</p>
          <q-input
            outlined
            v-model="jacInfoDB.fechaUltimaAsamblea"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm">
        <div class="col-xs-12 col-sm-4">
          <p class="text-h6">No. afiliados que asistieron</p>
          <q-input
            outlined
            v-model="jacInfoDB.noSociosAsistentes"
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
          />
        </div>
      </div>

      <!-- <div class="row q-col-gutter-sm">
        <div class="col-xs-12">
          <p class="text-h6">¿Tiene plan veredal?</p>
          <q-option-group
            inline
            :options="options"
            type="radio"
            v-model="jacInfoDB.tienePlanVeredal"
          />
        </div>
      </div> -->

      <div class="row q-col-gutter-sm q-mt-md">
        <div class="col-xs-12">
          <p class="text-h6">¿La organización cuenta con plan de acción anual?</p>
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
      tienePlanAccion: true,
      fechaReuniondirectiva: "",
  noDignatariosAsistentes: "",
  esAcordeLaReunionDirectiva: false
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
