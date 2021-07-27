<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <p class="text-h6 q-mt-md q-mb-sm">
          12. Espacios de participación ciudadana y comunitaria a los que está
          vinculada la organización.
        </p>
        <participacion-card
          v-for="participacion in getParticipacionState.lista"
          class="q-mb-sm"
          :participacioP="participacion"
          @editar="editarInfo"
          :key="participacion.id"
        ></participacion-card>

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
        @click="showParticipacionForm = true"
      >
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <participacion-form
      v-if="showParticipacionForm"
      @close="closeModal"
    ></participacion-form>
  </div>
</template>

<script>
import ParticipacionCard from "components/mod-jac/Participacion/ParticipacionCard";
import ParticipacionForm from "components/mod-jac/Participacion/ParticipacionForm";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "Participacion",
  components: { ParticipacionForm, ParticipacionCard },
  data() {
    return {
      jacID: 0,
      showParticipacionForm: false
    };
  },
  created() {
    this.jacID = this.$route.params.id;

    if (this.jacID > 0) {
      this.cargarListaParticipacionAction(this.jacID);
    }
  },
  methods: {
    ...mapActions("participacion", ["cargarListaParticipacionAction"]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    ...mapMutations("participacion", ["setParticipacionSuccess"]),
    closeModal() {
      this.showParticipacionForm = false;
    },
    editarInfo(value) {
      this.setParticipacionSuccess(value);
      this.showParticipacionForm = true;
    },
    onSubmit() {
      this.$router.push({ name: "c-salud", params: { id: this.jacID } });
    }
  },
  computed: {
    ...mapGetters("participacion", ["getParticipacionState"]),
    showBtnContinuar() {
      return this.getParticipacionState.lista.length > 0 ? true : false;
    }
  }
};
</script>

<style scoped></style>
