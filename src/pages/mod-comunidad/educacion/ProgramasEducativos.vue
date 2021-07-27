<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <p class="text-h6 q-mt-md q-mb-sm">Instituciones Educativas</p>

        <programas-educativos-card
          v-for="programasEducativos in getProgramasEducativosState.lista"
          class="q-mb-sm"
          :programasEducativos="programasEducativos"
          @editar="editarInfo"
          :key="programasEducativos.id"
        ></programas-educativos-card>

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
        @click="showProgramasEducativosForm = true"
      >
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <programas-educativos-form
      v-if="showProgramasEducativosForm"
      @close="closeModal"
    ></programas-educativos-form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import ProgramasEducativosCard from "src/components/mod-comunidad/ProgramasEducativosCard.vue";
import ProgramasEducativosForm from "src/components/mod-comunidad/ProgramasEducativosForm.vue";
export default {
  components: { ProgramasEducativosCard, ProgramasEducativosForm },
  data() {
    return {
      encuestaID: 0,
      showProgramasEducativosForm: false
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    if (this.encuestaID > 0) {
      this.cargarListaProgramasEducativosAction(this.encuestaID);
    }
  },
  methods: {
    ...mapActions("programasEducativos", [
      "cargarListaProgramasEducativosAction"
    ]),
    ...mapMutations("programasEducativos", ["setProgramasEducativosSuccess"]),
    closeModal() {
      this.showProgramasEducativosForm = false;
    },
    editarInfo(value) {
      this.setProgramasEducativosSuccess(value);
      this.showProgramasEducativosForm = true;
    },
    onSubmit() {
      this.$router.push({
        name: "c-fiestas-tradicionales",
        params: { id: this.encuestaID }
      });
    }
  },
  computed: {
    ...mapGetters("programasEducativos", ["getProgramasEducativosState"]),
    showBtnContinuar() {
      return this.getProgramasEducativosState.lista.length > 0 ? true : false;
    }
  }
};
</script>

<style></style>
