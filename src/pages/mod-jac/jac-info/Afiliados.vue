<template>
<div>
  <div class="text-h6 page-title-box" >Afiliados</div>
  <div class="q-ma-md">
    <q-form ref="afiliadosForm" class="bg-white q-pa-md">
      <p class="text-h6">3. Datos de los Afiliados</p>

      <div class="row q-col-gutter-sm">
        <div class="col-xs-12 col-md-3">
          <p class="text-h6">No. Hombres</p>
          <q-input
            outlined
            v-model="jacInfoDB.noHombres"
          />
        </div>
        <div class="col-xs-12 col-md-3">
          <p class="text-h6">No. Mujeres</p>
          <q-input
            outlined
            v-model="jacInfoDB.noMujeres"
          />
        </div>
        <div class="col-xs-12 col-md-3">
          <p class="text-h6">No. Afros</p>
          <q-input
            outlined
            v-model="jacInfoDB.noAfros"
          />
        </div>
        <div class="col-xs-12 col-md-3">
          <p class="text-h6">No. Indígenas</p>
          <q-input
            outlined
            v-model="jacInfoDB.noIndigenas"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm">
        <div class="col-xs-12 col-md-3">
          <p class="text-h6">No. ROOM</p>
          <q-input
            outlined
            v-model="jacInfoDB.noRoom"
          />
        </div>
        <div class="col-xs-12 col-md-4">
          <p class="text-h6">No. Población Discapacitada</p>
          <q-input
            outlined
            v-model="jacInfoDB.noPoblacionDiscapacitada"
          />
        </div>
        <div class="col-xs-12 col-md-5">
          <p class="text-h6">Pob. Entre 14 y 28 años</p>
          <q-input
            outlined
            v-model="jacInfoDB.noPoblacionEntre14y28"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm">
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">No. Hombres Jóvenes</p>
          <q-input
            outlined
            v-model="jacInfoDB.noHombresJovenes"
          />
        </div>
        <div class="col-xs-12 col-md-6">
          <p class="text-h6">No. Mujeres Jóvenes</p>
          <q-input
            outlined
            v-model="jacInfoDB.noMujeresJovenes"
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

export default {
  name: "JacInfo",
  data() {
    return {
      jacInfoDB: {}
    };
  },
  created() {
    this.jacInfoDB = {
      id: this.$route.params.id,
      noHombres: "",
      noMujeres: "",
      noAfros: "",
      noRoom: "",
      noIndigenas: "",
      noPoblacionDiscapacitada: "",
      noPoblacionEntre14y28: "",
      noHombresJovenes: "",
      noMujeresJovenes: ""
    };

    this.buscarJacInfoAction(this.jacInfoDB.id).then(data => {
      if (data.id > 0) {
        this.jacInfoDB = { ...data };
      }
    });
  },
  methods: {
    ...mapActions("jacInfo", ["buscarJacInfoAction", "registrarJacInfoAction"]),
    onSubmit() {
      this.$refs.afiliadosForm.validate().then(success => {
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
