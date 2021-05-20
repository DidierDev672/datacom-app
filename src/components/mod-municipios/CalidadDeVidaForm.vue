<template>
  <q-dialog
    persistent 
    transition-show="scale" 
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">Calidad de Vida</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >

          <p>Año de medición</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="calidad.ano"
                label="Ingresar el año de medición"
              />
            </div>
          </div>

          <p>Indice de Pobresa Multidimensional</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="calidad.ipmUrbana"
                label="Urbano"
              /> 
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="calidad.ipmRural"
                label="Rural"
              />  
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-input 
                outlined               
                v-model="calidad.ipmTotal"
                label="Total"
              /> 
            </div>
          </div>

          <p>Necesidades B&aacute;sicas Insatisfechas</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="calidad.nbi_urbano"
                label="Urbano"
              /> 
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="calidad.nbi_rural"
                label="Rural"
              />  
            </div>
          </div>

          <p>Poblaci&oacute;n en Condici&oacute;n de Miseria</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="calidad.pcmUrbano"
                label="Urbano"
              /> 
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="calidad.pcmRural"
                label="Rural"
              />  
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="calidad.pcm"
                label="Total"
              />  
            </div>
          </div>

            

               

            

            

          </q-form>      
          
        </q-card-section>

        <q-separator />

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancelar"
            color="primary"
            :disable="getCalidadDeVidaState.loading"
            @click="close" />
          <q-btn
            :label="mensajeBoton"
            color="primary"
            :loading="getCalidadDeVidaState.loading"
            :disable="getCalidadDeVidaState.loading"
            @click="onSubmit">
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
      calidad: {},
      municipioID: 0
    }
  },

  methods: {
    ...mapActions('municipios', ['actualizarInformacionGeneralAction', 'guardarInformacionGeneralAction']),
    ...mapActions('calidadDeVida', ['registrarCalidadDeVidaAction', 'actualizarCalidadDeVidaAction','unsetCalidadDeVidaAction']),
    onSubmit(){
      console.log('Calidad de Vida: ', this.calidad);
      let info = {
        ...this.calidad,
        municipio: {
          id: this.municipioID
        }
      }      
      if(info.id > 0){
        //Actualizar
        this.actualizarCalidadDeVidaAction(info).then(() => {          
        })
      }else{
        //Guardar
        this.registrarCalidadDeVidaAction(info).then( data => {
          this.calidad.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },
  created(){
    this.municipioID = this.$route.params.id
    this.calidad = {
      id: 0,
      ano: '',
      ipmRural:0,
      ipmTotal:0,
      ipmUrbana:0,
      nbi_rural:0,
      nbi_urbano:0,
      pcm:0,
      pcmRural:0,
      pcmUrbano:0,
    }
    if(Object.keys(this.getCalidadDeVidaState.objCalidadDeVida).length > 0){
      this.calidad.id = this.getCalidadDeVidaState.objCalidadDeVida.id;
      this.calidad.ano = this.getCalidadDeVidaState.objCalidadDeVida.ano;
      this.calidad.ipmRural = this.getCalidadDeVidaState.objCalidadDeVida.ipmRural;
      this.calidad.ipmUrbana = this.getCalidadDeVidaState.objCalidadDeVida.ipmUrbana;
      this.calidad.ipmTotal = this.getCalidadDeVidaState.objCalidadDeVida.ipmTotal;
      this.calidad.nbi_rural = this.getCalidadDeVidaState.objCalidadDeVida.nbi_rural;
      this.calidad.nbi_urbano = this.getCalidadDeVidaState.objCalidadDeVida.nbi_urbano;
      this.calidad.pcm = this.getCalidadDeVidaState.objCalidadDeVida.pcm;
      this.calidad.pcmRural = this.getCalidadDeVidaState.objCalidadDeVida.pcmRural;
      this.calidad.pcmUrbano = this.getCalidadDeVidaState.objCalidadDeVida.pcmUrbano;
    }
    
  },
  computed: {
    ...mapGetters('calidadDeVida', ['getCalidadDeVidaState']),
    mensajeBoton(){
      return this.calidad.id > 0 ? 'Actualizar' : 'Guardar'
    } 
  },
  beforeDestroy(){
    this.unsetCalidadDeVidaAction()
  }
  

}
</script>

<style>

</style>