<template>
<div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2"> 

        <p class="text-h6 q-mt-md q-mb-sm">10. Finanzas Públicas</p>

        <finanza-card
          v-for="finanza in getFinanzaState.lista"
          class="q-mb-sm"
          :finanza="finanza"
          @editar="editarInfo"
          :key="finanza.id"></finanza-card> 

          <div v-if="showBtnContinuar" class="flex justify-center">
              <q-btn label="Continuar" no-caps color="primary" @click="onSubmit"/>
          </div>

          <div class="flex flex-center" v-if="!showBtnContinuar">
            No hay registros para mostrar, agregue los que necesite haciendo click en el botón
          </div>
            
  
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showFinanzaForm = true">
          <q-tooltip>
              Agregar nuevo registro
          </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <finanza-form v-if="showFinanzaForm" @close="closeModal"></finanza-form>

  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import FinanzaCard from 'src/components/mod-municipios/FinanzaCard.vue'
import FinanzaForm from 'src/components/mod-municipios/FinanzaForm.vue'
export default {
  components: { FinanzaCard, FinanzaForm },
  data(){
    return {
      encuestaID: 0,
      showFinanzaForm: false
    }
  },
  created(){
    this.encuestaID = this.$route.params.id
    if(this.encuestaID > 0){
        this.cargarListaFinanzaAction(this.encuestaID)
    }
  },
  methods: {
    ...mapActions('finanza', ['cargarListaFinanzaAction']),
    ...mapMutations('finanza', ['setFinanzaSuccess']),
    closeModal(){
        this.showFinanzaForm = false
    },
    editarInfo(value){
        this.setFinanzaSuccess(value)
        this.showFinanzaForm = true
    },
    onSubmit(){
      this.$router.push({name: 'indicador', params: {id: this.encuestaID}})
    }
  },
  computed: {
    ...mapGetters('finanza', ['getFinanzaState']),
    showBtnContinuar(){
      return this.getFinanzaState.lista.length > 0 ? true : false
    }
  }

}
</script>

<style>

</style>