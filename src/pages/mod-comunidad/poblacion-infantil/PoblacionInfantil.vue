<template>
<div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2"> 

        <p class="text-h6 q-mt-md q-mb-sm">Atención a la Población Infantil</p>

        <poblacion-infantil-card
          v-for="poblacionInfantil in getPoblacionInfantilState.lista"
          class="q-mb-sm"
          :poblacionInfantil="poblacionInfantil"
          @editar="editarInfo"
          :key="poblacionInfantil.id"></poblacion-infantil-card> 

          <div v-if="showBtnContinuar" class="flex justify-center">
              <q-btn label="Continuar" no-caps color="primary" @click="onSubmit"/>
          </div>

          <div class="flex flex-center" v-if="!showBtnContinuar">
            No hay registros para mostrar, agregue los que necesite haciendo click en el botón
          </div>
            
  
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showPoblacionInfantilForm = true">
          <q-tooltip>
              Agregar nuevo registro
          </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <poblacion-infantil-form v-if="showPoblacionInfantilForm" @close="closeModal"></poblacion-infantil-form>

  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import PoblacionInfantilCard from 'src/components/mod-comunidad/PoblacionInfantilCard.vue'
import PoblacionInfantilForm from 'src/components/mod-comunidad/PoblacionInfantilForm.vue'
export default {
  components: { PoblacionInfantilCard, PoblacionInfantilForm },
  data(){
    return {
      encuestaID: 0,
      showPoblacionInfantilForm: false
    }
  },
  created(){
    this.encuestaID = this.$route.params.id
    if(this.encuestaID > 0){
        this.cargarListaPoblacionInfantilAction(this.encuestaID)
    }
  },
  methods: {
    ...mapActions('poblacionInfantil', ['cargarListaPoblacionInfantilAction']),
    ...mapMutations('poblacionInfantil', ['setPoblacionInfantilSuccess']),
    closeModal(){
        this.showPoblacionInfantilForm = false
    },
    editarInfo(value){
        this.setPoblacionInfantilSuccess(value)
        this.showPoblacionInfantilForm = true
    },
    onSubmit(){
      this.$router.push({name: 'c-vivienda', params: {id: this.encuestaID}})
    }
  },
  computed: {
    ...mapGetters('poblacionInfantil', ['getPoblacionInfantilState']),
    showBtnContinuar(){
      return this.getPoblacionInfantilState.lista.length > 0 ? true : false
    }
  }

}
</script>

<style>

</style>