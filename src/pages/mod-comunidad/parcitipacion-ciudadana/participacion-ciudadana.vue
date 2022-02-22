<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <p class="text-h6 q-mt-md q-mb-sm">Participación Ciudadana</p>

        <participacion-ciudadana-card
          v-for="participacionC in getParticipacionCiudadanaState.lista"
          class="q-mb-sm"
          :participacionC="participacionC"
          @editar="editarInfo"
          :key="participacionC.id"
        ></participacion-ciudadana-card>

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
      <q-btn
        fab
        icon="add"
        color="primary"
        @click="showParticipacionCiudadanaForm = true"
      >
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <participacion-ciudadana-form
      v-if="showParticipacionCiudadanaForm"
      @close="closeModal"
    ></participacion-ciudadana-form>
  </div>
</template>

<script>
import ParticipacionCiudadanaForm from "components/mod-comunidad/participacion-ciudadana/ParticipacionCiudadanaForm";
import ParticipacionCiudadanaCard from "components/mod-comunidad/participacion-ciudadana/ParticipacionCiudadanaCard";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "participacion-ciudadana",
  components: { ParticipacionCiudadanaForm, ParticipacionCiudadanaCard },
  data() {
    return {
      encuestaID: 0,
      showParticipacionCiudadanaForm: false
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;

    if (this.encuestaID > 0) {
      this.cargarListaParticipacionAction(this.encuestaID);
    }
  },
  methods: {
    ...mapActions("participacionCiudadana", ["cargarListaParticipacionAction"]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    ...mapMutations("participacionCiudadana", [
      "setParticipacionCiudadanaSuccess"
    ]),
    closeModal() {
      this.showParticipacionCiudadanaForm = false;
    },
    editarInfo(value) {
      console.log(value);
      this.setParticipacionCiudadanaSuccess(value);
      this.showParticipacionCiudadanaForm = true;
    },
    onSubmit() {
      this.$router.push({
        name: "c-fiestas-tradicionales",
        params: { id: this.encuestaID }
      });
    }
  },
  computed: {
    ...mapGetters("participacionCiudadana", ["getParticipacionCiudadanaState"]),
    showBtnContinuar() {
      return this.getParticipacionCiudadanaState.lista.length > 0
        ? true
        : false;
    }
  }
};
</script>

<style scoped></style>
