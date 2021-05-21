<template>
  <q-dialog
    persistent 
    transition-show="scale" 
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">{{ mensajeBoton }} Educación</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >          

          <p>Cobertura Neta</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-3">
              <q-input
                outlined
                v-model="educacion.coberturaNetaTransicion"
                label="Transicion"
              /> 
            </div>
            <div class="col-xs-12 col-sm-3">
              <q-input
                outlined
                v-model="educacion.coberturaNetaBasicaPrimaria"
                label="B. Primaria"
              />  
            </div>
            <div class="col-xs-12 col-sm-3">
              <q-input
                outlined
                v-model="educacion.coberturaNetaBasicaSecundaria"
                label="B. Secundaria"
              />  
            </div>
            <div class="col-xs-12 col-sm-3">
              <q-input
                outlined
                v-model="educacion.coberturaNetaEducacionMedia"
                label="Educación media"
              />  
            </div>
            
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-3">
              <q-input
                outlined
                v-model="educacion.coberturaNetaTotal"
                label="Total"
              /> 
            </div>
          </div>

          <p>Cobertura Bruta</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-3">
              <q-input
                outlined
                v-model="educacion.coberturaBrutaTransicion"
                label="Transicion"
              /> 
            </div>
            <div class="col-xs-12 col-sm-3">
              <q-input
                outlined
                v-model="educacion.coberturaBrutaBasicaPrimaria"
                label="B. Primaria"
              />  
            </div>
            <div class="col-xs-12 col-sm-3">
              <q-input
                outlined
                v-model="educacion.coberturaBrutaBasicaSecundaria"
                label="B. Secundaria"
              />  
            </div>
            <div class="col-xs-12 col-sm-3">
              <q-input
                outlined
                v-model="educacion.coberturaBrutaEducacionMedia"
                label="Educación media"
              />  
            </div>
            
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-3">
              <q-input
                outlined
                v-model="educacion.coberturaBrutaTotal"
                label="Total"
              /> 
            </div>
          </div>          

          <p>Analfabetismo</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-3">
              <q-input
                outlined
                v-model="educacion.tasaDeAnalfabestismoUrbano"
                label="Urbano"
              /> 
            </div>
            <div class="col-xs-12 col-sm-3">
              <q-input
                outlined
                v-model="educacion.tasaDeAnalfabestismoRural"
                label="Rural"
              /> 
            </div>
            <div class="col-xs-12 col-sm-3">
              <q-input
                outlined
                v-model="educacion.tasaDeAnalfabestismo"
                label="Total"
              /> 
            </div>
          </div>

          <p>Pruebas Saber 11</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-3">
              <q-input
                outlined
                v-model="educacion.puntajePromedioSaberMatematica"
                label="Matemáticas"
              /> 
            </div>
            <div class="col-xs-12 col-sm-3">
              <q-input
                outlined
                v-model="educacion.puntajePromedioSaberLectura"
                label="Lectura"
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
            :disable="getEducacionState.loading"
            @click="close" />
          <q-btn
            :label="mensajeBoton"
            color="primary"
            :loading="getEducacionState.loading"
            :disable="getEducacionState.loading"
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
      educacion: {},
      municipioID: 0
    }
  },
  created(){
    this.municipioID = this.$route.params.id
    this.educacion = {
      id: 0,
      coberturaNetaTransicion:'',
      coberturaNetaBasicaPrimaria:'',
      coberturaNetaBasicaSecundaria:'',
      coberturaNetaEducacionMedia:'',
      coberturaNetaTotal:'',
      coberturaBrutaTransicion:'',
      coberturaBrutaBasicaPrimaria:'',
      coberturaBrutaBasicaSecundaria:'',
      coberturaBrutaEducacionMedia:'',
      tasaDeAnalfabestismo:'',
      tasaDeAnalfabestismoUrbano:'',
      tasaDeAnalfabestismoRural:'',
      puntajePromedioSaberMatematica:'',
      puntajePromedioSaberLectura:'',
    }
    if(Object.keys(this.getEducacionState.objEducacion).length > 0){      

      this.educacion.id = this.getEducacionState.objEducacion.id;

      this.educacion.coberturaNetaTransicion = this.getEducacionState.objEducacion.coberturaNetaTransicion;
      this.educacion.coberturaNetaBasicaPrimaria = this.getEducacionState.objEducacion.coberturaNetaBasicaPrimaria;
      this.educacion.coberturaNetaBasicaSecundaria = this.getEducacionState.objEducacion.coberturaNetaBasicaSecundaria;
      this.educacion.coberturaNetaEducacionMedia = this.getEducacionState.objEducacion.coberturaNetaEducacionMedia;
      this.educacion.coberturaNetaTotal = this.getEducacionState.objEducacion.coberturaNetaTotal;

      this.educacion.coberturaBrutaTransicion = this.getEducacionState.objEducacion.coberturaBrutaTransicion;
      this.educacion.coberturaBrutaBasicaPrimaria = this.getEducacionState.objEducacion.coberturaBrutaBasicaPrimaria;
      this.educacion.coberturaBrutaBasicaSecundaria = this.getEducacionState.objEducacion.coberturaBrutaBasicaSecundaria;
      this.educacion.coberturaBrutaEducacionMedia = this.getEducacionState.objEducacion.coberturaBrutaEducacionMedia;
      this.educacion.coberturaBrutaTotal = this.getEducacionState.objEducacion.coberturaBrutaTotal;

      this.educacion.tasaDeAnalfabestismo = this.getEducacionState.objEducacion.tasaDeAnalfabestismo;
      this.educacion.tasaDeAnalfabestismoUrbano = this.getEducacionState.objEducacion.tasaDeAnalfabestismoUrbano;
      this.educacion.tasaDeAnalfabestismoRural = this.getEducacionState.objEducacion.tasaDeAnalfabestismoRural;

      this.educacion.puntajePromedioSaberMatematica = this.getEducacionState.objEducacion.puntajePromedioSaberMatematica;
      this.educacion.puntajePromedioSaberLectura = this.getEducacionState.objEducacion.puntajePromedioSaberLectura;
    }
    
  },
  methods: {
    ...mapActions('educacion', ['registrarEducacionAction', 'actualizarEducacionAction','unsetEducacionAction']),
    onSubmit(){
      
      let info = {
        ...this.educacion,
        municipioEducacion: {
          id: this.municipioID
        }
      }      
      if(info.id > 0){
        //Actualizar
        this.actualizarEducacionAction(info).then(() => {          
        })
      }else{
        //Guardar
        this.registrarEducacionAction(info).then( data => {
          this.educacion.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },  
  computed: {
    ...mapGetters('educacion', ['getEducacionState']),
    mensajeBoton(){
      return this.educacion.id > 0 ? 'Actualizar' : 'Guardar'
    } 
  },
  beforeDestroy(){
    this.unsetEducacionAction()
  }
  

}
</script>

<style>

</style>