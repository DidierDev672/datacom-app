<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">

        <cobertura-card
          v-for="cobertura in getCoberturaState.lista"
          class="q-mb-sm"
          :cobertura="cobertura"
          @editar="editarInfo"
          :key="cobertura.id"></cobertura-card>             
  
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="showCoberturaForm = true">
          <q-tooltip>
              Agregar nuevo registro
          </q-tooltip>
      </q-btn>
    </q-page-sticky>

    <cobertura-form v-if="showCoberturaForm" @close="closeModal"></cobertura-form>

  </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
import CoberturaForm from 'src/components/mod-municipios/CoberturaForm.vue'
import CoberturaCard from 'src/components/mod-municipios/CoberturaCard.vue'
export default {
  components: { CoberturaForm, CoberturaCard },
  data(){
    return {
      municipioID: 0,
      showCoberturaForm: false
    }
  },
  created(){
    this.municipioID = this.$route.params.id
    if(this.municipioID > 0){
        this.cargarListaCoberturaAction(this.municipioID)
    }
  },
  methods: {
    ...mapActions('coberturaServicios', ['cargarListaCoberturaAction']),
    ...mapMutations('coberturaServicios', ['setCoberturaSuccess']),
    closeModal(){
        this.showCoberturaForm = false
    },
    editarInfo(value){
        this.setCoberturaSuccess(value)
        this.showCoberturaForm = true
    }
  },
  computed: {
    ...mapGetters('coberturaServicios', ['getCoberturaState'])
  }

}
</script>

<style>

</style>
ViviendaCard