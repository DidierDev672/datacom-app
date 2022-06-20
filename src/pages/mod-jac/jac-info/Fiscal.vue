<template>
<div>
  <div class="text-h6 page-title-box" >Fiscal</div>
  <div class="q-ma-md">
    <q-form ref="fiscalForm" class="bg-white q-pa-md">
      <p class="text-h">5. Datos del Fiscal</p>
      <div class="row q-col-gutter-sm">
        <div class="col-xs-12 col-md-8">
          <p class="text-h6">Nombre completo</p>
          <q-input
            outlined
            v-model="jacInfoDB.fiscal"
          />
        </div>
      </div>
      <div class="row q-col-gutter-sm">
        <div class="col-xs-12 col-md-4">
          <p class="text-h6">Número de Documento</p>
          <q-input
            outlined
            v-model="jacInfoDB.noIdentificacionFiscal"
          />
        </div>
        <div class="col-xs-12 col-md-4">
          <p class="text-h6">Celular</p>
          <q-input
            outlined
            v-model="jacInfoDB.celularFiscal"
          />
        </div>
        <div class="col-xs-12 col-md-4">
          <p class="text-h6">Email</p>
          <q-input
            outlined
            v-model="jacInfoDB.emailFiscal"
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
      jacInfoDB: {}
    };
  },
  created() {
    this.jacID = this.$route.params.id;

    this.jacInfoDB = {
      id: this.$route.params.id,
      fiscal: "",
      noIdentificacionFiscal: "",
      celularFiscal: "",
      emailFiscal: ""
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
