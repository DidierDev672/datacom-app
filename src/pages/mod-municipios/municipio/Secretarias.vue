<template>
<div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2"> 

        <p class="text-h6 q-mt-md q-mb-sm">7.2. Secretarias de Despacho</p>


        <secretaria-card
          v-for="secretaria in getSecretariaState.lista"
          class="q-mb-sm"
          :secretaria="secretaria"
          @editar="editarInfo"
          :key="secretaria.id"></secretaria-card> 

          <div v-if="showBtnContinuar" class="flex justify-center">
              <q-btn label="Continuar" no-caps color="primary" @click="onSubmit"/>
          </div>

          <div class="flex flex-center" v-if="!showBtnContinuar">
            No hay registros para mostrar, agregue los que necesite haciendo click en el botón
          </div>
            
  
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showSecretariaForm = true">
          <q-tooltip>
              Agregar nuevo registro
          </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <secretaria-form v-if="showSecretariaForm" @close="closeModal"></secretaria-form>

  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import SecretariaCard from 'src/components/mod-municipios/SecretariaCard.vue'
import SecretariaForm from 'src/components/mod-municipios/SecretariaForm.vue'
export default {
  components: { SecretariaCard, SecretariaForm },
  data(){
    return {
      municipioID: 0,
      showSecretariaForm: false
    }
  },
  created(){
    this.municipioID = this.$route.params.id
    if(this.municipioID > 0){
        this.cargarListaSecretariaAction(this.municipioID)
    }
  },
  methods: {
    ...mapActions('secretarias', ['cargarListaSecretariaAction']),
    ...mapMutations('secretarias', ['setSecretariaSuccess']),
    closeModal(){
        this.showSecretariaForm = false
    },
    editarInfo(value){
        this.setSecretariaSuccess(value)
        this.showSecretariaForm = true
    },
    onSubmit(){
      this.$router.push({name: 'calidad-vida', params: {id: this.encuestaID}})
    }
  },
  computed: {
    ...mapGetters('secretarias', ['getSecretariaState']),
    showBtnContinuar(){
      return this.getSecretariaState.lista.length > 0 ? true : false
    }
  }

}
</script>

<style>

</style>
