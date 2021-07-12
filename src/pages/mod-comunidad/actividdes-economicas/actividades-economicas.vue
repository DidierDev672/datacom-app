<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <p class="text-h6 q-mt-md q-mb-sm">Actividades Economicas</p>

        <actividad-economica-card
          v-for="actividadp in getActividadEconomicaState.listaActividadEconomica"
          class="q-mb-sm"
          :actividadE="actividadp"
          @editar="editarInfo"
          :key="actividadp.id"
        ></actividad-economica-card>

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
        @click="showActividadEconomicaForm = true"
      >
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <actividad-economica-form
      v-if="showActividadEconomicaForm"
      @close="closeModal"
    ></actividad-economica-form>
  </div>
</template>

<script>
import ActividadEconomicaCard from "components/mod-comunidad/ActividadEconomicaCard";
import ActividadEconomicaForm from "components/mod-comunidad/ActividadEconomicaForm";
import { mapActions, mapGetters, mapMutations } from "vuex";
export default {
  name: "actividades-economicas",
  components: { ActividadEconomicaForm, ActividadEconomicaCard },
  data() {
    return {
      encuestaID: 0,
      showActividadEconomicaForm: false
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;

    if (this.encuestaID > 0) {
      this.cargarListaActividadEconomicaAction(this.encuestaID);
    }
  },
  methods: {
    ...mapActions("actividadEconomica", [
      "cargarListaActividadEconomicaAction"
    ]),
    ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    ...mapMutations("actividadEconomica", ["setActividadEconomicaSuccess"]),
    closeModal() {
      this.showActividadEconomicaForm = false;
    },
    editarInfo(value) {
      console.log(value);
      this.setActividadEconomicaSuccess(value);
      this.showActividadEconomicaForm = true;
    },
    onSubmit() {
      this.$router.push({
        name: "c-participacion-ciudadana",
        params: { id: this.encuestaID }
      });
    }
  },
  computed: {
    ...mapGetters("actividadEconomica", ["getActividadEconomicaState"]),
    showBtnContinuar() {
      return this.getActividadEconomicaState.listaActividadEconomica.length > 0
        ? true
        : false;
    }
  }
};
</script>

<style scoped></style>
