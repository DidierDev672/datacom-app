<template>
<div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <div>
            <p class="text-h6 q-mt-md q-mb-sm">{{ title }} {{step}}</p>
            <autoevaluacion-form
                v-for="opt in indicadoresSeleccionados"
                :detalleAutoevaluacion="opt"
                @actualizar="editarIndicador"
                :key="opt.id" />      
        </div>

        <div class="flex justify-center">
            <q-btn v-if="step > 1" label="Anterior" no-caps color="primary" flat class="q-mr-sm" @click="anterior"/>
            <q-btn label="Continuar" no-caps color="primary" @click="siguiente"/>            
        </div>

      </div>
    </div>
</div>
</template>

<script>
import AutoevaluacionForm from 'src/components/mod-autoevaluacion/AutoevaluacionForm.vue'
import { mapGetters, mapActions } from 'vuex'
import { TEMAS_SEGUIMIENTO_JAC } from 'src/utils/config'
export default {
	components: { AutoevaluacionForm },

  data () {
    return {
      encuestaID: 0,     
      detalleAutoevaluacion: [],
      indicadoresSeleccionados: [],
      step: TEMAS_SEGUIMIENTO_JAC.JUNTA_ADMINISTRADORA,
      title: 'Junta Administradora o Directiva'
    }
  },
  created() {
    
    this.encuestaID = this.$route.params.id
    this.cargarListaDetalleAutoevaluacionAction(this.encuestaID).then(data =>{
        this.indicadoresSeleccionados = data.filter(opt => opt.indicador.tema.id === this.step)
        this.detalleAutoevaluacion = [...data]
    })

  },
  methods: {    
    ...mapActions('detalleAutoevaluacion',['cargarListaDetalleAutoevaluacionAction', 'actualizarDetalleAutoevaluacionAction']),
    siguiente(){
        this.step++
        if(this.step > TEMAS_SEGUIMIENTO_JAC.PARTICIPACION){
            console.log('Es mayor');
            this.$router.push({name: 'a-fin-encuesta', params: {id: this.encuestaID}})
        }else{
            console.log('es menor');
        }
        this.consultarIndicadores()
    },
    anterior(){
      this.step--
        this.consultarIndicadores()
    },
    editarIndicador(value){
        this.detalleAutoevaluacion = this.detalleAutoevaluacion.map(opt => {
            if(opt.id === value.id){
                return value
            }else{
                return opt
            }
        })
    },
    consultarIndicadores(){
        switch (this.step) {
            case TEMAS_SEGUIMIENTO_JAC.JUNTA_ADMINISTRADORA:
                this.title = 'Junta Administradora o Directiva'                
                break;
            case TEMAS_SEGUIMIENTO_JAC.ASAMBLEA_SOCIOS:
                this.title = 'Asamblea de Socios'                
                break;
            case TEMAS_SEGUIMIENTO_JAC.DIRECCIONAMIENTO_ESTRATEGICO:
                this.title = 'Direccionamiento Estratégico'                
                break;
            case TEMAS_SEGUIMIENTO_JAC.ADMINISTRATIVO:
                this.title = 'Administrativo y Aspectos Legales'                
                break;
            case TEMAS_SEGUIMIENTO_JAC.FINANCIERO:
                this.title = 'Financiero'                
                break;
            case TEMAS_SEGUIMIENTO_JAC.EJECUCION_PROYECTOS:
                this.title = 'Ejecución de proyectos y Contratos'                
                break;
            case TEMAS_SEGUIMIENTO_JAC.CAPACITACION:
                this.title = 'Capacitación'                
                break;
            case TEMAS_SEGUIMIENTO_JAC.PARTICIPACION:
                this.title = 'Espacios de participación ciudadana y comunitaria'                
                break;
        
            default:
                break;
        }
        this.indicadoresSeleccionados = this.detalleAutoevaluacion.filter(opt => opt.indicador.tema.id === this.step)
    }
  },
  computed: {
    ...mapGetters('informacionGeneral', ['getInformacionGeneralState']),

  }

}
</script>

<style>

</style>