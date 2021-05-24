<template>
  <q-dialog
    persistent 
    transition-show="scale" 
    transition-hide="scale"
    v-model="show">
      <q-card style="width: 700px;">
        <q-card-section>
          <div class="text-h6">{{ mensajeBoton }} Política Pública</div>
        </q-card-section>

        <q-separator />

        <q-card-section style="max-height: 50vh" class="scroll">

          <q-form
            class="q-gutter-md"
          >          

          <p>Seleccione un tipo de política</p>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-select
                outlined
                option-value="id"
                option-label="nombre"
                v-model="politica.tipoPolitica"
                :options="options"
                label="Seleccione una política" />
            </div>            
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="politica.numero"
                label="No. Acuerdo municipal"
              /> 
            </div>            
          </div>

          <div class="row q-col-gutter-sm">
            <div class="col-xs-12">
              <q-input
                outlined
                v-model="politica.ano"
                label="Año"
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
            :disable="getPoliticasPublicasState.loading"
            @click="close" />
          <q-btn
            :label="mensajeBoton"
            color="primary"
            :loading="getPoliticasPublicasState.loading"
            :disable="getPoliticasPublicasState.loading"
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
      politica: {},
      encuestaID: 0,
      options: [],
    }
  },
  created(){
    this.encuestaID = this.$route.params.id
    this.politica = {
      id: 0,
      tipoPolitica:'',
      numero:'',
      ano: ''
    }
    if(Object.keys(this.getPoliticasPublicasState.objPoliticasPublicas).length > 0){
      this.politica.id = this.getPoliticasPublicasState.objPoliticasPublicas.id;
      this.politica.tipoPolitica = this.getPoliticasPublicasState.objPoliticasPublicas.tipoPolitica;
      this.politica.ano = this.getPoliticasPublicasState.objPoliticasPublicas.ano;
      this.politica.numero = this.getPoliticasPublicasState.objPoliticasPublicas.numero;
    }

    this.cargarListaParametroAction().then(data => {
      this.options = data
    })
    
  },
  methods: {
    ...mapActions('politicasPublicas', ['registrarPoliticasPublicasAction', 'actualizarPoliticasPublicasAction','unsetPoliticasPublicasAction']),
    ...mapActions('parametros', ['cargarListaParametroAction']),
    onSubmit(){
      
      let info = {
        ...this.politica,
        encuesta: {
          id: this.encuestaID
        }
      }
      console.log('Secretaria a guardar: ', info);      
      if(info.id > 0){
        //Actualizar
        this.actualizarPoliticasPublicasAction(info).then(() => {          
        })
      }else{
        //Guardar
        this.registrarPoliticasPublicasAction(info).then( data => {
          this.politica.id = data
        })
      }
    },
    close(){
      this.$emit("close");
    }
  },  
  computed: {
    ...mapGetters('politicasPublicas', ['getPoliticasPublicasState']),
    mensajeBoton(){
      return this.politica.id > 0 ? 'Actualizar' : 'Guardar'
    } 
  },
  beforeDestroy(){
    this.unsetPoliticasPublicasAction()
  }
  

}
</script>

<style>

</style>