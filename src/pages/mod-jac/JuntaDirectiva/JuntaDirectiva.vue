<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">

        <p class="text-h6 q-mt-md q-mb-sm">Junta directiva  Jac</p>
        <junta-directiva-card
          v-for="juntaDirectiva in getJuntaDirectivaState.lista"
          class="q-mb-sm"
          :juntaDirectivaP="juntaDirectiva"
          @editar="editarInfo"
          :key="juntaDirectiva.id"></junta-directiva-card>
        <div v-if="showBtnContinuar" class="flex justify-center">
          <q-btn label="Continuar" no-caps color="primary" @click="onSubmit"/>
        </div>

        <div class="flex flex-center" v-if="!showBtnContinuar">
          No hay registros para mostrar, agregue los que necesite haciendo click en el botón
        </div>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showJuntaDirectivaForm = true">
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <junta-directiva-form v-if="showJuntaDirectivaForm" @close="closeModal"></junta-directiva-form>

  </div>
</template>

<script>
import {mapActions, mapGetters, mapMutations} from "vuex";
import JuntaDirectivaForm from "components/mod-jac/JuntaDirectiva/JuntaDirectivaForm";
import JuntaDirectivaCard from "components/mod-jac/JuntaDirectiva/JuntaDirectivaCard";

export default {
  name: "JuntaDirectiva",
  components: {JuntaDirectivaCard, JuntaDirectivaForm},
  data() {
    return {
      jacID: 0,
      showJuntaDirectivaForm: false
    }
  }, created() {
    this.jacID = this.$route.params.id

    if(this.jacID > 0){
      this.cargarListaJuntaDirectivaAction(this.jacID)
    }
  },methods: {
    ...mapActions('juntaDirectiva', ['cargarListaJuntaDirectivaAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
    ...mapMutations('juntaDirectiva', ['setJuntaDirectivaSuccess']),
    closeModal(){
      this.showJuntaDirectivaForm = false
    },
    editarInfo(value){
      this.setJuntaDirectivaSuccess(value)
      this.showJuntaDirectivaForm = true
    },
    onSubmit(){
      this.$router.push({name: 'c-salud', params: {id: this.jacID}})
    }
  },
  computed: {
    ...mapGetters('juntaDirectiva', ['getJuntaDirectivaState']),
    showBtnContinuar(){
      return this.getJuntaDirectivaState.lista.length > 0 ? true : false
    }
  }

}
</script>

<style scoped>

</style>
