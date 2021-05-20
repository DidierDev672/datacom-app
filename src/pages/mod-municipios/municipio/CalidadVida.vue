<template>
  <div class="q-ma-sm">
      <div class="row">
          <div class="col-xs-12 col-sm-8 offset-sm-2">                
              <CalidadDeVida
                class="q-mb-sm"
                v-for="calidad in getCalidadDeVidaState.lista"
                @editar="editarInfo"
                :calidad="calidad"
                :key="calidad.id"></CalidadDeVida>
          </div>
      </div>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
          <q-btn fab icon="add" color="primary" @click="showCalidadForm = true">
              <q-tooltip>
                  Agregar nuevo registro
              </q-tooltip>
          </q-btn>
      </q-page-sticky>
      <CalidadDeVidaForm
        v-if="showCalidadForm"
        @close="closeModal"></CalidadDeVidaForm>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapGetters } from 'vuex'
import CalidadDeVida from 'components/mod-municipios/CalidadDeVida'
import CalidadDeVidaForm from 'components/mod-municipios/CalidadDeVidaForm'
export default {
    components: { CalidadDeVida, CalidadDeVidaForm },
    data(){
        return {
            showCalidadForm: false,
            municipioID: 0,
            calidadDeVida: []
        }
    },
    created(){
        this.municipioID = this.$route.params.id
        if(this.municipioID > 0){
            this.cargarListaCalidadDeVidaAction(this.municipioID)
        }
    },
    methods: {
        ...mapActions('calidadDeVida', ['cargarListaCalidadDeVidaAction']),
        ...mapMutations('calidadDeVida', ['setCalidadDeVidaSuccess']),
        closeModal(){
            this.showCalidadForm = false
        },
        editarInfo(value){
            this.setCalidadDeVidaSuccess(value)
            this.showCalidadForm = true
        }
    },
    computed: {
        ...mapGetters('calidadDeVida', ['getCalidadDeVidaState'])
    }

}
</script>

<style>

</style>