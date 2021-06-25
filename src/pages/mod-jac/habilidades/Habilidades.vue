<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">

        <p class="text-h6 q-mt-md q-mb-sm">Habilidades JAC</p>

        <habilidades-card
          v-for="habilidades in getHabilidadesState.lista"
          class="q-mb-sm"
          :habilidadesP="habilidades"
          @editar="editarInfo"
          :key="habilidades.id"></habilidades-card>

        <div v-if="showBtnContinuar" class="flex justify-center">
          <q-btn label="Continuar" no-caps color="primary" @click="onSubmit"/>
        </div>

        <div class="flex flex-center" v-if="!showBtnContinuar">
          No hay registros para mostrar, agregue los que necesite haciendo click en el botón
        </div>


      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showHabilidadesForm = true">
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <habilidades-form v-if="showHabilidadesForm" @close="closeModal"></habilidades-form>

  </div>
</template>

<script>
import HabilidadesForm from "components/mod-jac/Habilidades/HabilidadesForm";
import HabilidadesCard from "components/mod-jac/Habilidades/HabilidadesCard";
import {mapActions, mapGetters, mapMutations} from "vuex";
export default {
  name: "Habilidades",
  components: {HabilidadesCard, HabilidadesForm},
  data() {
    return {
      jacID: 0,
      showHabilidadesForm: false
    }
  }, created() {
    this.jacID = this.$route.params.id

    if(this.jacID > 0){
      this.cargarListaHabilidadesAction(this.jacID)
    }
  },methods: {
    ...mapActions('habilidades', ['cargarListaHabilidadesAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
    ...mapMutations('habilidades', ['setHabilidadesSuccess']),
    closeModal(){
      this.showHabilidadesForm = false
    },
    editarInfo(value){
      console.log(value)
      this.setHabilidadesSuccess(value)
      this.showHabilidadesForm = true
    },
    onSubmit(){
      this.$router.push({name: 'c-salud', params: {id: this.jacID}})
    }
  },
  computed: {
    ...mapGetters('habilidades', ['getHabilidadesState']),
    showBtnContinuar(){
      return this.getHabilidadesState.lista.length > 0 ? true : false
    }
  }
}
</script>

<style scoped>

</style>
