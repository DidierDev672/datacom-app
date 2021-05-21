<template>
<div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2"> 

        <vivienda-card
          v-for="vivienda in getViviendaState.lista"
          class="q-mb-sm"
          :vivienda="vivienda"
          @editar="editarInfo"
          :key="vivienda.id"></vivienda-card>             
  
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showViviendaForm = true">
          <q-tooltip>
              Agregar nuevo registro
          </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <vivienda-form v-if="showViviendaForm" @close="closeModal"></vivienda-form>

  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import ViviendaCard from 'src/components/mod-municipios/ViviendaCard.vue'
import ViviendaForm from 'src/components/mod-municipios/ViviendaForm.vue'
export default {
  components: { ViviendaCard, ViviendaForm },
  data(){
    return {
      municipioID: 0,
      showViviendaForm: false
    }
  },
  created(){
    this.municipioID = this.$route.params.id
    if(this.municipioID > 0){
        this.cargarListaViviendasAction(this.municipioID)
    }
  },
  methods: {
    ...mapActions('viviendas', ['cargarListaViviendasAction']),
    ...mapMutations('viviendas', ['setViviendaSuccess']),
    closeModal(){
        this.showViviendaForm = false
    },
    editarInfo(value){
        this.setViviendaSuccess(value)
        this.showViviendaForm = true
    }
  },
  computed: {
    ...mapGetters('viviendas', ['getViviendaState'])
  }

}
</script>

<style>

</style>
ViviendaCard