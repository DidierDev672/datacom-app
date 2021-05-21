<template>
  <q-dialog
    persistent 
    transition-show="scale" 
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">{{ mensajeBoton }} Vivienda</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >          

          <p>Vivienda</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                type="number"
                v-model.number="vivienda.numeroDeViviendasUrbanas"
                label="No. Viviendas Urbanas"
              /> 
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                type="number"
                v-model.number="vivienda.numeroDeViviendasRurales"
                label="No. Viviendas Rurales"
              />  
            </div>
          </div>

          <p>Hogares</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                type="number"
                v-model.number="vivienda.numeroDeHogaresUrbanos"
                label="No. Hogares Urbanos"
              /> 
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                type="number"
                v-model.number="vivienda.numeroDeHogaresRurales"
                label="No. Hogares Rurales"
              />  
            </div>
          </div>

          <p>Deficit</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="vivienda.deficitCuantitativo"
                label="Déficit Cuantitativo"
              /> 
            </div>
            <div class="col-xs-12 col-sm-6">
              <q-input
                outlined
                v-model="vivienda.deficitCualitativo"
                label="Deficit Cualitativo"
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
            :disable="getViviendaState.loading"
            @click="close" />
          <q-btn
            :label="mensajeBoton"
            color="primary"
            :loading="getViviendaState.loading"
            :disable="getViviendaState.loading"
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
      vivienda: {},
      municipioID: 0
    }
  },
  created(){
    this.municipioID = this.$route.params.id
    this.vivienda = {
      id: 0,
      deficitCualitativo:0,
      deficitCuantitativo:0,
      numeroDeHogaresRurales:0,
      numeroDeHogaresUrbanos:0,
      numeroDeViviendasRurales:0,
      numeroDeViviendasUrbanas:0
    }
    if(Object.keys(this.getViviendaState.objVivienda).length > 0){
      this.vivienda.id = this.getViviendaState.objVivienda.id;
      this.vivienda.deficitCualitativo = this.getViviendaState.objVivienda.deficitCualitativo;
      this.vivienda.deficitCuantitativo = this.getViviendaState.objVivienda.deficitCuantitativo;
      this.vivienda.numeroDeHogaresRurales = this.getViviendaState.objVivienda.numeroDeHogaresRurales;
      this.vivienda.numeroDeHogaresUrbanos = this.getViviendaState.objVivienda.numeroDeHogaresUrbanos;
      this.vivienda.numeroDeViviendasRurales = this.getViviendaState.objVivienda.numeroDeViviendasRurales;
      this.vivienda.numeroDeViviendasUrbanas = this.getViviendaState.objVivienda.numeroDeViviendasUrbanas;
    }
    
  },
  methods: {
    ...mapActions('viviendas', ['registrarViviendaAction', 'actualizarViviendaAction','unsetViviendaAction']),
    onSubmit(){
      console.log('Calidad de Vida: ', this.calidad);
      let info = {
        ...this.vivienda,
        municipioVivienda: {
          id: this.municipioID
        }
      }      
      if(info.id > 0){
        //Actualizar
        this.actualizarViviendaAction(info).then(() => {          
        })
      }else{
        //Guardar
        this.registrarViviendaAction(info).then( data => {
          this.vivienda.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },  
  computed: {
    ...mapGetters('viviendas', ['getViviendaState']),
    mensajeBoton(){
      return this.vivienda.id > 0 ? 'Actualizar' : 'Guardar'
    } 
  },
  beforeDestroy(){
    this.unsetViviendaAction()
  }
  

}
</script>

<style>

</style>