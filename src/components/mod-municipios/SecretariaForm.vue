<template>
  <q-dialog
    persistent 
    transition-show="scale" 
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">{{ mensajeBoton }} Secretaria</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >          

          <p>Datos de la Secretaria</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="secretaria.idGabinete"
                :options="options"
                label="Seleccione la secretaria" />
            </div>            
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="secretaria.telefono"
                label="Teléfono"
              /> 
            </div>            
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="secretaria.correo"
                label="Email"
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
            :disable="getSecretariaState.loading"
            @click="close" />
          <q-btn
            :label="mensajeBoton"
            color="primary"
            :loading="getSecretariaState.loading"
            :disable="getSecretariaState.loading"
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
      secretaria: {},
      encuestaID: 0,
      options: [],
    }
  },
  created(){
    this.encuestaID = this.$route.params.id
    this.secretaria = {
      id: 0,
      telefono:'',
      correo:'',
      idGabinete: ''
    }
    if(Object.keys(this.getSecretariaState.objSecretaria).length > 0){
      this.secretaria.id = this.getSecretariaState.objSecretaria.id;
      this.secretaria.telefono = this.getSecretariaState.objSecretaria.telefono;
      this.secretaria.correo = this.getSecretariaState.objSecretaria.correo;
      this.secretaria.idGabinete = this.getSecretariaState.objSecretaria.idGabinete;
    }

    this.cargarListaParametroAction().then(data => {
      this.options = data
    })
    
  },
  methods: {
    ...mapActions('secretarias', ['registrarSecretariaAction', 'actualizarSecretariaAction','unsetSecretariaAction']),
    ...mapActions('parametros', ['cargarListaParametroAction']),
    onSubmit(){
      
      let info = {
        ...this.secretaria,
        encuesta: {
          id: this.encuestaID
        }
      }
      console.log('Secretaria a guardar: ', info);      
      if(info.id > 0){
        //Actualizar
        this.actualizarSecretariaAction(info).then(() => {          
        })
      }else{
        //Guardar
        this.registrarSecretariaAction(info).then( data => {
          this.secretaria.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },  
  computed: {
    ...mapGetters('secretarias', ['getSecretariaState']),
    mensajeBoton(){
      return this.secretaria.id > 0 ? 'Actualizar' : 'Guardar'
    } 
  },
  beforeDestroy(){
    this.unsetSecretariaAction()
  }
  

}
</script>

<style>

</style>