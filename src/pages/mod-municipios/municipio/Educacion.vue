<template>
<div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2"> 

        <educacion-card
          v-for="educacion in getEducacionState.lista"
          class="q-mb-sm"
          :educacion="educacion"
          @editar="editarInfo"
          :key="educacion.id"></educacion-card>             
  
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showEducacionForm = true">
          <q-tooltip>
              Agregar nuevo registro
          </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <educacion-form v-if="showEducacionForm" @close="closeModal"></educacion-form>

  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import EducacionCard from 'src/components/mod-municipios/EducacionCard.vue'
import EducacionForm from 'src/components/mod-municipios/EducacionForm.vue'
export default {
  components: { EducacionCard, EducacionForm },
  data(){
    return {
      municipioID: 0,
      showEducacionForm: false
    }
  },
  created(){
    this.municipioID = this.$route.params.id
    if(this.municipioID > 0){
        this.cargarListaEducacionAction(this.municipioID)
    }
  },
  methods: {
    ...mapActions('educacion', ['cargarListaEducacionAction']),
    ...mapMutations('educacion', ['setEducacionSuccess']),
    closeModal(){
        this.showEducacionForm = false
    },
    editarInfo(value){
        this.setEducacionSuccess(value)
        this.showEducacionForm = true
    }
  },
  computed: {
    ...mapGetters('educacion', ['getEducacionState'])
  }

}
</script>

<style>

</style>
ViviendaCard