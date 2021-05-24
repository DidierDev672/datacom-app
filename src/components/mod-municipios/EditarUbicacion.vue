<template>
  <q-dialog
    persistent 
    transition-show="scale" 
    transition-hide="scale"
    v-model="show">
      <q-card>
        <q-card-section>
          <div class="text-h6">Ubicacion del municipio</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >

            <q-input
              filled
              v-model="ubicacion.region"
              label="Ingresar una región"
            />

            <q-input
              filled
              v-model="ubicacion.extension"
              label="Ingresar la extensión territorial"
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
      ubicacion: {}
    }
  },

  methods: {
    ...mapActions('informacionGeneral', ['actualizarInformacionGeneralAction', 'guardarInformacionGeneralAction']),
    actualizar(){
      let infoGeneral = {
        ...this.getInformacionGeneralState.objInformacionGeneral,
        region: this.ubicacion.region,
        extension: this.ubicacion.extension,
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
    this.ubicacion = {
      id: 0,
      region: '',
      extension: ''
    }
    if(this.getInformacionGeneralState.objInformacionGeneral != null && Object.keys(this.getInformacionGeneralState.objInformacionGeneral).length > 0){
      this.ubicacion.id = this.getInformacionGeneralState.objInformacionGeneral.id;
      this.ubicacion.region = this.getInformacionGeneralState.objInformacionGeneral.region;
      this.ubicacion.extension = this.getInformacionGeneralState.objInformacionGeneral.extension;
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