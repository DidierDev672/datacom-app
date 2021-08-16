<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <p class="text-h6 q-mt-md q-mb-sm">9. Infraestructura Pública</p>

        <infraestructura-card
          v-for="infraestructura in getInfraestructuraState.lista"
          class="q-mb-sm"
          :infraestructura="infraestructura"
          @editar="editarInfo"
          :key="infraestructura.id"
        ></infraestructura-card>

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
        @click="showInfraestructuraForm = true"
      >
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <infraestructura-form
      v-if="showInfraestructuraForm"
      @close="closeModal"
    ></infraestructura-form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import InfraestructuraCard from "src/components/mod-municipios/InfraestructuraCard.vue";
import InfraestructuraForm from "src/components/mod-municipios/InfraestructuraForm.vue";
export default {
  components: { InfraestructuraCard, InfraestructuraForm },
  data() {
    return {
      encuestaID: 0,
      showInfraestructuraForm: false
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    if (this.encuestaID > 0) {
      this.cargarListaInfraestructuraAction(this.encuestaID);
    }
  },
  methods: {
    ...mapActions("infraestructura", ["cargarListaInfraestructuraAction"]),
    ...mapMutations("infraestructura", ["setInfraestructuraSuccess"]),
    closeModal() {
      this.showInfraestructuraForm = false;
    },
    editarInfo(value) {
      this.setInfraestructuraSuccess(value);
      this.showInfraestructuraForm = true;
    },
    onSubmit() {
      this.$router.push({ name: "finanza", params: { id: this.encuestaID } });
    }
  },
  computed: {
    ...mapGetters("infraestructura", ["getInfraestructuraState"]),
    showBtnContinuar() {
      return this.getInfraestructuraState.lista.length > 0 ? true : false;
    }
  }
};
</script>

<style></style>
