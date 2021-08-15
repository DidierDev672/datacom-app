<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-6 offset-sm-3">
        <p class="text-h6 q-mt-md q-mb-sm">3. Organizaciones</p>

        <organizacion-card
          v-for="organizacion in getOrganizacionState.lista"
          class="q-mb-sm"
          :organizacion="organizacion"
          @editar="editarInfo"
          :key="organizacion.id"
        ></organizacion-card>

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
        @click="showOrganizacionForm = true"
      >
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <organizacion-form
      v-if="showOrganizacionForm"
      @close="closeModal"
    ></organizacion-form>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from "vuex";
import OrganizacionCard from "src/components/mod-municipios/OrganizacionCard.vue";
import OrganizacionForm from "src/components/mod-municipios/OrganizacionForm.vue";
export default {
  components: { OrganizacionCard, OrganizacionForm },
  data() {
    return {
      encuestaID: 0,
      showOrganizacionForm: false
    };
  },
  created() {
    this.encuestaID = this.$route.params.id;
    if (this.encuestaID > 0) {
      this.cargarListaOrganizacionAction(this.encuestaID);
    }
  },
  methods: {
    ...mapActions("organizacion", ["cargarListaOrganizacionAction"]),
    ...mapMutations("organizacion", ["setOrganizacionSuccess"]),
    closeModal() {
      this.showOrganizacionForm = false;
    },
    editarInfo(value) {
      this.setOrganizacionSuccess(value);
      this.showOrganizacionForm = true;
    },
    onSubmit() {
      this.$router.push({
        name: "c-vias-acceso",
        params: { id: this.encuestaID }
      });
    }
  },
  computed: {
    ...mapGetters("organizacion", ["getOrganizacionState"]),
    showBtnContinuar() {
      return this.getOrganizacionState.lista.length > 0 ? true : false;
    }
  }
};
</script>

<style></style>
