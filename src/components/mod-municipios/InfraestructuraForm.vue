<template>
  <q-dialog
    persistent 
    transition-show="scale" 
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">{{ mensajeBoton }} Infraestructura Pública</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >          

          <p>Datos de la Infraestrructura</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="infraestructura.tipoInfraestructura"
                :options="options"
                label="Seleccione el tipo de infraestructura" />
            </div>            
          </div>          

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="infraestructura.contacto"
                label="Persona de Contacto"
              /> 
            </div>            
          </div>


          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="infraestructura.telefono"
                label="Teléfono"
              /> 
            </div>            
          </div>


          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="infraestructura.correo"
                label="Email"
              /> 
            </div>            
          </div>   

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="infraestructura.direccion"
                label="Dirección"
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
            :disable="getInfraestructuraState.loading"
            @click="close" />
          <q-btn
            :label="mensajeBoton"
            color="primary"
            :loading="getInfraestructuraState.loading"
            :disable="getInfraestructuraState.loading"
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
      infraestructura: {},
      encuestaID: 0,
      options: [],
    }
  },
  created(){
    let categorias = [CATEGORIAS.INFRAESTRUCTURA_PUBLICA]
    this.encuestaID = this.$route.params.id
    this.infraestructura = {
      id: 0,
      telefono:'',
      correo:'',
      contacto:'',
      direccion: '',
      tipoInfraestructura: ''
    }
    if(Object.keys(this.getInfraestructuraState.objInfraestructura).length > 0){
      this.infraestructura.id = this.getInfraestructuraState.objInfraestructura.id;
      this.infraestructura.telefono = this.getInfraestructuraState.objInfraestructura.telefono;
      this.infraestructura.correo = this.getInfraestructuraState.objInfraestructura.correo;
      this.infraestructura.tipoInfraestructura = this.getInfraestructuraState.objInfraestructura.tipoInfraestructura;
      this.infraestructura.contacto = this.getInfraestructuraState.objInfraestructura.contacto;
      this.infraestructura.direccion = this.getInfraestructuraState.objInfraestructura.direccion;
    }

    // this.cargarListaParametroAction().then(data => {
    //   this.options = data
    // })

    this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
            this.options = data
        })
    
  },
  methods: {
    ...mapActions('infraestructura', ['registrarInfraestructuraAction', 'actualizarInfraestructuraAction','unsetInfraestructuraAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
    onSubmit(){
      
      let info = {
        ...this.infraestructura,
        encuesta: {
          id: this.encuestaID
        }
      }
           
      if(info.id > 0){
        //Actualizar
        this.actualizarInfraestructuraAction(info).then(() => {          
        })
      }else{
        //Guardar
        this.registrarInfraestructuraAction(info).then( data => {
          this.infraestructura.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },  
  computed: {
    ...mapGetters('infraestructura', ['getInfraestructuraState']),
    mensajeBoton(){
      return this.infraestructura.id > 0 ? 'Actualizar' : 'Guardar'
    } 
  },
  beforeDestroy(){
    this.unsetInfraestructuraAction()
  }
  

}
</script>

<style>

</style>