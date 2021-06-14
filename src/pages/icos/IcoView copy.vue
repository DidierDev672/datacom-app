<template>
  <div>
    <h6>Ico View</h6>
     <q-markup-table wrap-cells >
      <tr>
        <td>Area</td>
        <td>Subarea</td>
        <td>Tema</td>
        <td>Indicador</td>
        <td>Calificación</td>
      </tr>

      <tr>
        <td rowspan="32">Ambito Interno</td>
        <td rowspan="12">1. Nivel Gerencial</td>
        <td rowspan="4">Junta Administradora o Directiva</td>
        <td>Conformacion completa</td>
        <td>3</td>
      </tr>

      <tr>
        <td>Frecuencia reuniones</td>
        <td>2</td>
      </tr>

      <tr>
        <td>Comités de trabajo</td>
        <td>2</td>
      </tr>

      <tr>
        <td>Realizan rendición de cuenta</td>
        <td>1</td>
      </tr>

      <tr>
        <td colspan="2">Calificación Junta Administrativa</td>
        <td>1</td>
      </tr>

      <tr>
        <td rowspan="2">Asamblea de Socios</td>
        <td>Frecuencia reuniones de acuerdo a los estatutos</td>
        <td>1</td>
      </tr>
      <tr>
        <td>Asistencia de socios a las reuiones</td>
        <td>1</td>
      </tr>
      <tr>
        <td colspan="2">Calificación Asamblea de socios</td>
        <td>1</td>
      </tr>
      <tr>
        <td rowspan="3">Direccionamiento Estratégico</td>
        <td>Cuentan con plan de gestión Veredal actualizado</td>
        <td>1</td>
      </tr>
      <tr>
        <td>Cuentan con programa de ejecución del PGV</td>
        <td>2</td>
      </tr>
      <tr>
        <td>Han ejecutado proyectos del PGV</td>
        <td>2</td>
      </tr>
      <tr>
        <td colspan="2">Calificación Direccionamiento Estratégico</td>
        <td>1</td>
      </tr>











      <!-- <tr v-for="registro in encuesta.detalleAutoevaluacion" :key="registro.ir">

        <td>{{ registro.indicador.descripcion}}</td>
        <td>{{ registro.calificacion }}</td>
      </tr> -->
     </q-markup-table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  data(){
    return {
      encuestaID: 0,
      infoGeneral: {},
      encuesta: {}
    }
  },
  created(){
    this.encuestaID = this.$route.params.id
    this.buscarInformacionGeneralAction(this.encuestaID).then(data => {
      if(data.id > 0){
        this.infoGeneral = {...data}
      }
    })

    this.buscarEncuestaAction(this.encuestaID).then(data => {
      this.encuesta = data
    })
  },

  methods: {
    ...mapActions('informacionGeneral',['buscarInformacionGeneralAction']),
    ...mapActions('encuesta',['buscarEncuestaAction']),
  },
  computed: {
    ...mapGetters('informacionGeneral', ['getInformacionGeneralState']),
  }

}
</script>

<style>

</style>
