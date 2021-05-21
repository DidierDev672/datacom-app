<template>
  <q-dialog
    persistent 
    transition-show="scale" 
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">{{ mensajeBoton }} Cobertura en Servicio</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >          

          <p>Energía eléctrica</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="cobertura.energiaElectricaUrbana"
                label="Urbana"
              /> 
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="cobertura.energiaElectricaRural"
                label="Rural"
              />  
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="cobertura.coberturaEnergiaElectrica"
                label="Total"
              />  
            </div>            
          </div>

          <p>Acueducto</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="cobertura.acueductoUrbano"
                label="Urbana"
              /> 
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="cobertura.acueductoRural"
                label="Rural"
              />  
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="cobertura.coberturaAcueducto"
                label="Total"
              />  
            </div>            
          </div>

          <p>Alcantarillado</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="cobertura.alcantarilladoUrbana"
                label="Urbana"
              /> 
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="cobertura.alcantarilladoRural"
                label="Rural"
              />  
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="cobertura.coberturaAlcantarillado"
                label="Total"
              />  
            </div>            
          </div>

          <p>Gas Natural</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="cobertura.gasNaturalUrbana"
                label="Urbana"
              /> 
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="cobertura.gasNaturalRural"
                label="Rural"
              />  
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="cobertura.coberturaGasNatural"
                label="Total"
              />  
            </div>            
          </div>

          <p>Internet</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="cobertura.internetUrbana"
                label="Urbana"
              /> 
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="cobertura.internetRural"
                label="Rural"
              />  
            </div>
            <div class="col-xs-12 col-sm-4">
              <q-input
                outlined
                v-model="cobertura.coberturaInternet"
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
            :disable="getCoberturaState.loading"
            @click="close" />
          <q-btn
            :label="mensajeBoton"
            color="primary"
            :loading="getCoberturaState.loading"
            :disable="getCoberturaState.loading"
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
      cobertura: {},
      municipioID: 0
    }
  },
  created(){
    this.municipioID = this.$route.params.id
    this.cobertura = {
      id: 0,
      coberturaEnergiaElectrica:'',
      energiaElectricaUrbana:'',
      energiaElectricaRural:'',
      coberturaAcueducto:'',
      acueductoUrbano:'',
      acueductoRural:'',
      coberturaAlcantarillado:'',
      alcantarilladoUrbana:'',
      alcantarilladoRural:'',
      coberturaGasNatural:'',
      gasNaturalUrbana:'',
      gasNaturalRural:'',
      coberturaInternet:'',
      internetUrbana:'',
      internetRural:'',
    }
    if(Object.keys(this.getCoberturaState.objCobertura).length > 0){      

      this.cobertura.id = this.getCoberturaState.objCobertura.id;

      this.cobertura.coberturaEnergiaElectrica = this.getCoberturaState.objCobertura.coberturaEnergiaElectrica;
      this.cobertura.energiaElectricaUrbana = this.getCoberturaState.objCobertura.energiaElectricaUrbana;
      this.cobertura.energiaElectricaRural = this.getCoberturaState.objCobertura.energiaElectricaRural;

      this.cobertura.coberturaAcueducto = this.getCoberturaState.objCobertura.coberturaAcueducto;
      this.cobertura.acueductoUrbano = this.getCoberturaState.objCobertura.acueductoUrbano;
      this.cobertura.acueductoRural = this.getCoberturaState.objCobertura.acueductoRural;

      this.cobertura.coberturaAlcantarillado = this.getCoberturaState.objCobertura.coberturaAlcantarillado;
      this.cobertura.alcantarilladoUrbana = this.getCoberturaState.objCobertura.alcantarilladoUrbana;
      this.cobertura.alcantarilladoRural = this.getCoberturaState.objCobertura.alcantarilladoRural;

      this.cobertura.coberturaGasNatural = this.getCoberturaState.objCobertura.coberturaGasNatural;
      this.cobertura.gasNaturalUrbana = this.getCoberturaState.objCobertura.gasNaturalUrbana;
      this.cobertura.gasNaturalRural = this.getCoberturaState.objCobertura.gasNaturalRural;

      this.cobertura.coberturaInternet = this.getCoberturaState.objCobertura.coberturaInternet;
      this.cobertura.internetUrbana = this.getCoberturaState.objCobertura.internetUrbana;
      this.cobertura.internetRural = this.getCoberturaState.objCobertura.internetRural;
      
    }
    
  },
  methods: {
    ...mapActions('coberturaServicios', ['registrarCoberturaAction', 'actualizarCoberturaAction','unsetCoberturaAction']),
    onSubmit(){      
      let info = {
        ...this.cobertura,
        municipioCoberturaServicio: {
          id: this.municipioID
        }
      }      
      if(info.id > 0){
        //Actualizar
        this.actualizarCoberturaAction(info)
      }else{
        //Guardar
        this.registrarCoberturaAction(info).then( data => {
          this.cobertura.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },  
  computed: {
    ...mapGetters('coberturaServicios', ['getCoberturaState']),
    mensajeBoton(){
      return this.cobertura.id > 0 ? 'Actualizar' : 'Guardar'
    } 
  },
  beforeDestroy(){
    this.unsetCoberturaAction()
  }
  

}
</script>

<style>

</style>