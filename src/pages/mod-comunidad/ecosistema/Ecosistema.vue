<template>
<div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2"> 

        <p class="text-h6 q-mt-md q-mb-sm">Ecosistemas</p>

        <ecosistema-card
          v-for="ecosistema in getEcosistemaState.lista"
          class="q-mb-sm"
          :ecosistema="ecosistema"
          @editar="editarInfo"
          :key="ecosistema.id"></ecosistema-card> 

          <div v-if="showBtnContinuar" class="flex justify-center">
              <q-btn label="Continuar" no-caps color="primary" @click="onSubmit"/>
          </div>

          <div class="flex flex-center" v-if="!showBtnContinuar">
            No hay registros para mostrar, agregue los que necesite haciendo click en el botón
          </div>
            
  
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showEcosistemaForm = true">
          <q-tooltip>
              Agregar nuevo registro
          </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <ecosistema-form v-if="showEcosistemaForm" @close="closeModal"></ecosistema-form>

  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import EcosistemaCard from 'src/components/mod-comunidad/EcosistemaCard.vue'
import EcosistemaForm from 'src/components/mod-comunidad/EcosistemaForm.vue'
export default {
  components: { EcosistemaCard, EcosistemaForm },
  data(){
    return {
      encuestaID: 0,
      showEcosistemaForm: false
    }
  },
  created(){
    this.encuestaID = this.$route.params.id
    if(this.encuestaID > 0){
        this.cargarListaEcosistemaAction(this.encuestaID)
    }
  },
  methods: {
    ...mapActions('ecosistema', ['cargarListaEcosistemaAction']),
    ...mapMutations('ecosistema', ['setEcosistemaSuccess']),
    closeModal(){
        this.showEcosistemaForm = false
    },
    editarInfo(value){
        this.setEcosistemaSuccess(value)
        this.showEcosistemaForm = true
    },
    onSubmit(){
      this.$router.push({name: 'c-salud', params: {id: this.encuestaID}})
    }
  },
  computed: {
    ...mapGetters('ecosistema', ['getEcosistemaState']),
    showBtnContinuar(){
      return this.getEcosistemaState.lista.length > 0 ? true : false
    }
  }

}
</script>

<style>

</style>