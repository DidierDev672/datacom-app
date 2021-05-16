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
            :disable="getMunicipioState.loading"
            @click="close" />
          <q-btn
            label="Guardar"
            color="primary"
            :loading="getMunicipioState.loading"
            :disable="getMunicipioState.loading"
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
    ...mapActions('municipios', ['actualizarInformacionGeneralAction', 'guardarInformacionGeneralAction']),
    actualizar(){
      let infoGeneral = {
        ...this.getMunicipioState.municipio.informacionGeneral,
        limiteNorte: this.limites.limiteNorte,
        limiteSur: this.limites.limiteSur,
        limiteOriente: this.limites.limiteOriente,
        limiteOccidente: this.limites.limiteOccidente,
        municipio: {
          id: this.municipio.id
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
    if(this.getMunicipioState.municipio.informacionGeneral != null && Object.keys(this.getMunicipioState.municipio.informacionGeneral).length > 0){
      this.limites.id = this.getMunicipioState.municipio.informacionGeneral.id;
      this.limites.limiteNorte = this.getMunicipioState.municipio.informacionGeneral.limiteNorte;
      this.limites.limiteSur = this.getMunicipioState.municipio.informacionGeneral.limiteSur;
      this.limites.limiteOriente = this.getMunicipioState.municipio.informacionGeneral.limiteOriente;
      this.limites.limiteOccidente = this.getMunicipioState.municipio.informacionGeneral.limiteOccidente;
    }
  },
  computed: {
    ...mapGetters('municipios', ['getMunicipioState']),
    municipio(){
      return this.getMunicipioState.municipio
    }
  }

}
</script>

<style>

</style>