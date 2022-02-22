<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <p class="text-h6 q-mt-md q-mb-sm">Infraestructura de Salud</p>

        <infrasalud-card
          v-for="infrasalud in getInfrasaludState.lista"
          class="q-mb-sm"
          :infrasalud="infrasalud"
          @editar="editarInfo"
          :key="infrasalud.id"
        ></infrasalud-card>

        <div v-if="showBtnContinuar" class="flex justify-center">
          <q-btn label="Continuar" no-caps color="primary" @click="onSubmit" />
        </div>

        <div class="flex flex-center" v-if="!showBtnContinuar">
          No hay registros para mostrar, agregue los que necesite haciendo click
          en el botón
        </div>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showInfrasaludForm = true">
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <infrasalud-form
      v-if="showInfrasaludForm"
      @close="closeModal"
    ></infrasalud-form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import InfrasaludCard from "src/components/mod-comunidad/InfrasaludCard.vue";
import InfrasaludForm from "src/components/mod-comunidad/InfrasaludForm.vue";
export default {
  components: { InfrasaludCard, InfrasaludForm },
  data() {
    return {
      encuestaID: 0,
      showInfrasaludForm: false
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    if (this.encuestaID > 0) {
      this.cargarListaInfrasaludAction(this.encuestaID);
    }
  },
  methods: {
    ...mapActions("infrasalud", ["cargarListaInfrasaludAction"]),
    ...mapMutations("infrasalud", ["setInfrasaludSuccess"]),
    closeModal() {
      this.showInfrasaludForm = false;
    },
    editarInfo(value) {
      this.setInfrasaludSuccess(value);
      this.showInfrasaludForm = true;
    },
    onSubmit() {
      this.$router.push({
        name: "c-vivienda",
        params: { id: this.encuestaID }
      });
    }
  },
  computed: {
    ...mapGetters("infrasalud", ["getInfrasaludState"]),
    showBtnContinuar() {
      return this.getInfrasaludState.lista.length > 0 ? true : false;
    }
  }
};
</script>

<style></style>
