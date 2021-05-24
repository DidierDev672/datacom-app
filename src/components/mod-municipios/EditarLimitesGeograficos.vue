<template>
  <q-dialog
    persistent 
    transition-show="scale" 
    transition-hide="scale"
    v-model="show">
      <q-card>
        <q-card-section>
          <div class="text-h6">Límites geográficos del municipio</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >

            <q-input
              filled
              v-model="limites.limiteNorte"
              label="Límite Norte"
            />

            <q-input
              filled
              v-model="limites.limiteSur"
              label="Límite Sur"
            />     

            <q-input
              filled
              v-model="limites.limiteOriente"
              label="Límite Oriente"
            />

            <q-input
              filled
              v-model="limites.limiteOccidente"
              label="Límite Occidente"
            />   

          </q-form>    
          
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="primary"
            :disable="getInformacionGeneralState.loading"
            @click="close" />
          <q-btn
            label="Guardar"
            color="primary"
            :loading="getInformacionGeneralState.loading"
            :disable="getInformacionGeneralState.loading"
            @click="actualizar">
            <template v-slot:loading>
              <q-spinner-facebook />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data(){
    return {
      show: true,
      limites: {}
    }
  },

  methods: {
    ...mapActions('informacionGeneral', ['actualizarInformacionGeneralAction', 'guardarInformacionGeneralAction']),
    actualizar(){
      let infoGeneral = {
        ...this.getInformacionGeneralState.objInformacionGeneral ,
        limiteNorte: this.limites.limiteNorte,
        limiteSur: this.limites.limiteSur,
        limiteOriente: this.limites.limiteOriente,
        limiteOccidente: this.limites.limiteOccidente,
        encuesta: {
          id: this.getEncuestaState.objEncuesta.id
        }
      }

      if(infoGeneral.id > 0){
        //Actualizar
        this.actualizarInformacionGeneralAction(infoGeneral).then(() => {
          this.close();
        })
      }else{
        //Guardar
        this.guardarInformacionGeneralAction(infoGeneral).then( () => {
          this.close();
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },
  created(){
    this.limites = {
      id: 0,
      limiteNorte: '',
      limiteSur: '',
      limiteOriente: '',
      limiteOccidente: ''
    }
    if(this.getInformacionGeneralState.objInformacionGeneral  != null && Object.keys(this.getInformacionGeneralState.objInformacionGeneral ).length > 0){
      this.limites.id = this.getInformacionGeneralState.objInformacionGeneral .id;
      this.limites.limiteNorte = this.getInformacionGeneralState.objInformacionGeneral .limiteNorte;
      this.limites.limiteSur = this.getInformacionGeneralState.objInformacionGeneral .limiteSur;
      this.limites.limiteOriente = this.getInformacionGeneralState.objInformacionGeneral .limiteOriente;
      this.limites.limiteOccidente = this.getInformacionGeneralState.objInformacionGeneral .limiteOccidente;
    }
  },
  computed: {
    ...mapGetters('informacionGeneral', ['getInformacionGeneralState']),
    ...mapGetters('encuesta', ['getEncuestaState']),
  }

}
</script>

<style>

</style>