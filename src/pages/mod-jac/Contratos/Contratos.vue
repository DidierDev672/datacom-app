<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">

        <p class="text-h6 q-mt-md q-mb-sm">Contratos</p>

        <contratos-card
          v-for="contratosv in getContratosState.lista"
          class="q-mb-sm"
          :contratos="contratosv"
          @editar="editarInfo"
          :key="contratosv.id"></contratos-card>

        <div v-if="showBtnContinuar" class="flex justify-center">
          <q-btn label="Continuar" no-caps color="primary" @click="onSubmit"/>
        </div>

        <div class="flex flex-center" v-if="!showBtnContinuar">
          No hay registros para mostrar, agregue los que necesite haciendo click en el botón
        </div>


      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showContratoForm = true">
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <contratos-form v-if="showContratoForm" @close="closeModal"></contratos-form>

  </div>
</template>

<script>
import ContratosCard from "components/mod-jac/contratos/ContratosCard";
import ContratosForm from "components/mod-jac/contratos/ContratosForm";
import {mapActions, mapGetters, mapMutations} from "vuex";
export default {
  name: "Contratos",
  components: {ContratosForm, ContratosCard},
  data() {
    return {
      jacID: 0,
      showContratoForm: false
    }
  }, created() {
    this.jacID = this.$route.params.id

    if(this.jacID > 0){
      this.cargarListaContratosAction(this.jacID)
    }
  },methods: {
    ...mapActions('contratos', ['cargarListaContratosAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
    ...mapMutations('contratos', ['setContratosSuccess']),
    closeModal(){
      this.showContratoForm = false
    },
    editarInfo(value){
      console.log(value)
      this.setContratosSuccess(value)
      this.showContratoForm = true
    },
    onSubmit(){
      this.$router.push({name: 'c-salud', params: {id: this.jacID}})
    }
  },
  computed: {
    ...mapGetters('contratos', ['getContratosState']),
    showBtnContinuar(){
      return this.getContratosState.lista.length > 0 ? true : false
    }
  }
}
</script>

<style scoped>

</style>
