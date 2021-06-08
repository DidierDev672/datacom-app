<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <p class="text-h6 q-mt-md q-mb-sm">Comite Emergencia</p>

        <comite-emergencia-card
          v-for="comiteEmergencia in getComiteEmergenciaState.lista"
          class="q-mb-sm"
          :comite-emergencia="comiteEmergencia"
          @editar="editarInfo"
          :key="comiteEmergencia.id"
        ></comite-emergencia-card>

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
      <q-btn fab icon="add" color="primary" @click="showComiteEmergenciaForm = true">
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <ComiteEmergenciaForm
      v-if="showComiteEmergenciaForm"
      @close="closeModal"
    ></ComiteEmergenciaForm>
  </div>
</template>

<script>
import ComiteEmergenciaCard from "src/components/mod-comunidad/ComiteEmergenciaCard.vue";
import ComiteEmergenciaForm from "src/components/mod-comunidad/ComiteEmergenciaForm.vue";
import {mapActions, mapGetters, mapMutations} from "vuex";
export default {
  name: "ComiteEmergencia" ,
  components: { ComiteEmergenciaCard, ComiteEmergenciaForm },
  data() {
    return {
      encuestaID: 0,
      showComiteEmergenciaForm: false
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    if (this.encuestaID > 0) {
      this.cargarListaComiteEmergenciaAction(this.encuestaID);
    }
  },
  methods: {
    ...mapActions("comiteEmergencia", ["cargarListaComiteEmergenciaAction", "cargarListaComiteEmergencia"]),
    ...mapMutations("comiteEmergencia", ["setComiteEmergenciaSuccess", "unsetListaComiteEmergencia", "unsetEcosistema"]),
    closeModal() {
      this.showComiteEmergenciaForm = false;
    },
    editarInfo(value) {
      this.setComiteEmergenciaSuccess(value);
      this.showComiteEmergenciaForm = true;
    },
    onSubmit() {
      this.$router.push({ name: "c-salud", params: { id: this.encuestaID } });
    }
  },
  computed: {
    ...mapGetters("comiteEmergencia", ["getComiteEmergenciaState"]),
    showBtnContinuar() {
      return this.getComiteEmergenciaState.lista.length > 0 ? true : false;
    }
  }

}
</script>

<style scoped>

</style>
