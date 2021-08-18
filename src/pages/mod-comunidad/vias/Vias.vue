<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <p class="text-h6 q-mt-md q-mb-sm">4. Vías de Acceso</p>

        <vias-card
          v-for="vias in getViasState.lista"
          class="q-mb-sm"
          :vias="vias"
          @editar="editarInfo"
          :key="vias.id"
        ></vias-card>

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
      <q-btn fab icon="add" color="primary" @click="showViasForm = true">
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <vias-form v-if="showViasForm" @close="closeModal"></vias-form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import ViasCard from "src/components/mod-comunidad/ViasCard.vue";
import ViasForm from "src/components/mod-comunidad/ViasForm.vue";
export default {
  components: { ViasCard, ViasForm },
  data() {
    return {
      encuestaID: 0,
      showViasForm: false
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    if (this.encuestaID > 0) {
      this.cargarListaViasAction(this.encuestaID);
    }
  },
  methods: {
    ...mapActions("vias", ["cargarListaViasAction"]),
    ...mapMutations("vias", ["setViasSuccess"]),
    closeModal() {
      this.showViasForm = false;
    },
    editarInfo(value) {
      this.setViasSuccess(value);
      this.showViasForm = true;
    },
    onSubmit() {
      this.$router.push({
        name: "c-infraestructura",
        params: { id: this.encuestaID }
      });
    }
  },
  computed: {
    ...mapGetters("vias", ["getViasState"]),
    showBtnContinuar() {
      return this.getViasState.lista.length > 0 ? true : false;
    }
  }
};
</script>

<style></style>
