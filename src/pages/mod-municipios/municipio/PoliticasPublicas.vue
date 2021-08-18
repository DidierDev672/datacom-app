<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <p class="text-h6 q-mt-md q-mb-sm">7.3. Políticas Públicas</p>

        <politicas-publicas-card
          v-for="politica in getPoliticasPublicasState.lista"
          class="q-mb-sm"
          :politica="politica"
          @editar="editarInfo"
          :key="politica.id"
        ></politicas-publicas-card>

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
        @click="showPoliticasPublicasForm = true"
      >
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <politicas-publicas-form
      v-if="showPoliticasPublicasForm"
      @close="closeModal"
    ></politicas-publicas-form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import PoliticasPublicasCard from "src/components/mod-municipios/PoliticasPublicasCard.vue";
import PoliticasPublicasForm from "src/components/mod-municipios/PoliticasPublicasForm.vue";
export default {
  components: { PoliticasPublicasCard, PoliticasPublicasForm },
  data() {
    return {
      encuestaID: 0,
      showPoliticasPublicasForm: false
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    if (this.encuestaID > 0) {
      this.cargarListaPoliticasPublicasAction(this.encuestaID);
    }
  },
  methods: {
    ...mapActions("politicasPublicas", ["cargarListaPoliticasPublicasAction"]),
    ...mapMutations("politicasPublicas", ["setPoliticasPublicasSuccess"]),
    closeModal() {
      this.showPoliticasPublicasForm = false;
    },
    editarInfo(value) {
      this.setPoliticasPublicasSuccess(value);
      this.showPoliticasPublicasForm = true;
    },
    onSubmit() {
      this.$router.push({
        name: "organizaciones",
        params: { id: this.encuestaID }
      });
    }
  },
  computed: {
    ...mapGetters("politicasPublicas", ["getPoliticasPublicasState"]),
    showBtnContinuar() {
      return this.getPoliticasPublicasState.lista.length > 0 ? true : false;
    }
  }
};
</script>

<style></style>
ViviendaCard
