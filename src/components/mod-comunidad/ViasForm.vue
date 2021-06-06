<template>
  <q-dialog
    persistent 
    transition-show="scale" 
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">{{ mensajeBoton }} Vias de Acceso</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >          

          <p>Datos de la Vía</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="via.tipoVia"
                :options="tipoViasOptions"
                label="Seleccione el tipo de via" />
            </div>            
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                v-model="via.estadoVia"
                :options="estadoViaOptions"
                label="Seleccione el estado de la via" />
            </div>            
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <p class="text-caption">¿La vía es transitable todo el año?</p>
              <q-option-group
                :options="transitableOptions"
                type="radio"
                v-model="via.transitable" />
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
            :disable="getViasState.loading"
            @click="close" />
          <q-btn
            :label="mensajeBoton"
            color="primary"
            :loading="getViasState.loading"
            :disable="getViasState.loading"
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
import { CATEGORIAS } from '../../utils/config'
export default {
  data(){
    return {
      show: true,
      via: {},
      encuestaID: 0,
      tipoViasOptions: [],
      estadoViaOptions: ['Bueno', 'Regular', 'Malo'],
      transitableOptions: [
        { label: 'Si, la vía es transitable todo el año', value: true },
        { label: 'No, la vía no es transitable todo el año', value: false },
      ]
    }
  },
  created(){
    let categorias = [CATEGORIAS.VIAS_ACCESO]
    this.encuestaID = this.$route.params.id
    this.via = {
      id: 0,
      tipoVia: '',
      estadoVia:'Bueno',
      transitable:true
    }
    if(Object.keys(this.getViasState.objVias).length > 0){
      this.via.id = this.getViasState.objVias.id;
      this.via.tipoVia = this.getViasState.objVias.tipoVia;
      this.via.estadoVia = this.getViasState.objVias.estadoVia;
      this.via.transitable = this.getViasState.objVias.transitable;
    }

    // this.cargarListaParametroAction().then(data => {
    //   this.options = data
    // })

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
            this.tipoViasOptions = data
        })
    
  },
  methods: {
    ...mapActions('vias', ['registrarViasAction', 'actualizarViasAction','unsetViasAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
    onSubmit(){
      
      let info = {
        ...this.via,
        encuesta: {
          id: this.encuestaID
        }
      }
           
      if(info.id > 0){
        //Actualizar
        this.actualizarViasAction(info).then(() => {          
        })
      }else{
        //Guardar
        this.registrarViasAction(info).then( data => {
          this.via.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },  
  computed: {
    ...mapGetters('vias', ['getViasState']),
    mensajeBoton(){
      return this.via.id > 0 ? 'Actualizar' : 'Guardar'
    } 
  },
  beforeDestroy(){
    this.unsetViasAction()
  }
  

}
</script>

<style>

</style>