<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">

        <p class="text-h6 q-mt-md q-mb-sm">Proyectos Productivos</p>

        <proyectos-productivos-card
          v-for="proyectosProductivosv in getProyectosProductivosState.lista"
          class="q-mb-sm"
          :proyectoProductivos="proyectosProductivosv"
          @editar="editarInfo"
          :key="proyectosProductivosv.id"></proyectos-productivos-card>

        <div v-if="showBtnContinuar" class="flex justify-center">
          <q-btn label="Continuar" no-caps color="primary" @click="onSubmit"/>
        </div>

        <div class="flex flex-center" v-if="!showProyectoProductivoForm">
          No hay registros para mostrar, agregue los que necesite haciendo click en el botón
        </div>


      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showProyectoProductivoForm = true">
        <q-tooltip>
          Agregar nuevo registro
        </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <proyectos-productivos-form v-if="showProyectoProductivoForm" @close="closeModal"></proyectos-productivos-form>

  </div>
</template>

<script>
import ProyectosProductivosCard from "components/mod-jac/ProyectosProductivos/ProyectosProductivosCard";
import ProyectosProductivosForm from "components/mod-jac/ProyectosProductivos/ProyectosProductivosForm";
import {mapActions, mapGetters, mapMutations} from "vuex";
export default {
  name: "ProyectosProductivos",
  components: {ProyectosProductivosForm, ProyectosProductivosCard},
  data() {
    return {
      jacID: 0,
      showProyectoProductivoForm: false
    }
  }, created() {
    this.jacID = this.$route.params.id

    if(this.jacID > 0){
      this.cargarListaProyectosProductivosAction(this.jacID)
    }
  },methods: {
    ...mapActions('proyectosProductivos', ['cargarListaProyectosProductivosAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
    ...mapMutations('proyectosProductivos', ['setProyectosProductosSuccess']),
    closeModal(){
      this.showProyectoProductivoForm = false
    },
    editarInfo(value){
      console.log(value)
      this.setProyectosProductosSuccess(value)
      this.showProyectoProductivoForm = true
    },
    onSubmit(){
      this.$router.push({name: 'c-salud', params: {id: this.jacID}})
    }
  },
  computed: {
    ...mapGetters('proyectosProductivos', ['getProyectosProductivosState']),
    showBtnContinuar(){
      return this.getProyectosProductivosState.lista.length > 0 ? true : false
    }
  }
}
</script>

<style scoped>

</style>
