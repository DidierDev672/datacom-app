<template>
  <q-dialog
    persistent 
    transition-show="scale" 
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">{{ mensajeBoton }} Organización</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >          

          <p>Datos de la Organización</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="organizacion.idOrganizacion"
                :options="options"
                label="Seleccione el tipo de organización" />
            </div>            
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="organizacion.nombre"
                label="Nombre de la organización"
              /> 
            </div>            
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="organizacion.tipoActividad"
                label="Tipo de Actividad"
              /> 
            </div>            
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="organizacion.contacto"
                label="Persona de Contacto"
              /> 
            </div>            
          </div>


          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="organizacion.telefono"
                label="Teléfono"
              /> 
            </div>            
          </div>


          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="organizacion.correo"
                label="Email"
              /> 
            </div>            
          </div>   

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="organizacion.direccion"
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
            :disable="getOrganizacionState.loading"
            @click="close" />
          <q-btn
            :label="mensajeBoton"
            color="primary"
            :loading="getOrganizacionState.loading"
            :disable="getOrganizacionState.loading"
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
      organizacion: {},
      encuestaID: 0,
      options: [],
    }
  },
  created(){
    this.encuestaID = this.$route.params.id
    this.organizacion = {
      id: 0,
      telefono:'',
      correo:'',
      nombre:'',
      tipoActividad:'',
      contacto:'',
      direccion: '',
      idOrganizacion: ''
    }
    if(Object.keys(this.getOrganizacionState.objOrganizacion).length > 0){
      this.organizacion.id = this.getOrganizacionState.objOrganizacion.id;
      this.organizacion.telefono = this.getOrganizacionState.objOrganizacion.telefono;
      this.organizacion.correo = this.getOrganizacionState.objOrganizacion.correo;
      this.organizacion.nombre = this.getOrganizacionState.objOrganizacion.nombre;
      this.organizacion.tipoActividad = this.getOrganizacionState.objOrganizacion.tipoActividad;
      this.organizacion.contacto = this.getOrganizacionState.objOrganizacion.contacto;
      this.organizacion.direccion = this.getOrganizacionState.objOrganizacion.direccion;
      this.organizacion.idOrganizacion = this.getOrganizacionState.objOrganizacion.idOrganizacion;
    }

    this.cargarListaParametroAction().then(data => {
      this.options = data
    })
    
  },
  methods: {
    ...mapActions('organizacion', ['registrarOrganizacionAction', 'actualizarOrganizacionAction','unsetOrganizacionAction']),
    ...mapActions('parametros', ['cargarListaParametroAction']),
    onSubmit(){
      
      let info = {
        ...this.organizacion,
        encuesta: {
          id: this.encuestaID
        }
      }
           
      if(info.id > 0){
        //Actualizar
        this.actualizarOrganizacionAction(info).then(() => {          
        })
      }else{
        //Guardar
        this.registrarOrganizacionAction(info).then( data => {
          this.organizacion.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },  
  computed: {
    ...mapGetters('organizacion', ['getOrganizacionState']),
    mensajeBoton(){
      return this.organizacion.id > 0 ? 'Actualizar' : 'Guardar'
    } 
  },
  beforeDestroy(){
    this.unsetOrganizacionAction()
  }
  

}
</script>

<style>

</style>