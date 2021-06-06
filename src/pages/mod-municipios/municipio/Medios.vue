<template>
<div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2"> 

        <p class="text-h6 q-mt-md q-mb-sm">14. Medios de Comunicación</p>

        <medio-card
          v-for="medio in getMedioState.lista"
          class="q-mb-sm"
          :medio="medio"
          @editar="editarInfo"
          :key="medio.id"></medio-card> 

          <div v-if="showBtnContinuar" class="flex justify-center">
              <q-btn label="Continuar" no-caps color="primary" @click="onSubmit"/>
          </div>

          <div class="flex flex-center" v-if="!showBtnContinuar">
            No hay registros para mostrar, agregue los que necesite haciendo click en el botón
          </div>
            
  
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showMedioForm = true">
          <q-tooltip>
              Agregar nuevo registro
          </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <medio-form v-if="showMedioForm" @close="closeModal"></medio-form>

  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import MedioCard from 'src/components/mod-municipios/MedioCard.vue'
import MedioForm from 'src/components/mod-municipios/MedioForm.vue'
export default {
  components: { MedioCard, MedioForm },
  data(){
    return {
      encuestaID: 0,
      showMedioForm: false
    }
  },
  created(){
    this.encuestaID = this.$route.params.id
    if(this.encuestaID > 0){
        this.cargarListaMedioAction(this.encuestaID)
    }
  },
  methods: {
    ...mapActions('medio', ['cargarListaMedioAction']),
    ...mapMutations('medio', ['setMedioSuccess']),
    closeModal(){
        this.showMedioForm = false
    },
    editarInfo(value){
        this.setMedioSuccess(value)
        this.showMedioForm = true
    },
    onSubmit(){
      this.$router.push({name: 'economia', params: {id: this.encuestaID}})
    }
  },
  computed: {
    ...mapGetters('medio', ['getMedioState']),
    showBtnContinuar(){
      return this.getMedioState.lista.length > 0 ? true : false
    }
  }

}
</script>

<style>

</style>