<template>
<q-card
  flat
  bordered>

  <q-form ref="fiscalForm">    

  <q-card-section>

    <q-list class="report-list">

      <q-item>
        <q-item-section>
          <q-item-label>Nivel gerencial</q-item-label>
        </q-item-section>
      </q-item>
      

    <q-item>

      <q-item-section>
        <q-item-label>Frecuencia reunión directiva</q-item-label>
        <q-item-label caption>
          <q-input
            outlined
            v-model="jacInfoDB.frecuenciaReunionDirectiva"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']" />
        </q-item-label>
      </q-item-section>

      <q-item-section>
        <q-item-label>¿Hace cuánto está nombrada la directiva?</q-item-label>
        <q-item-label caption>
          <q-input
            outlined
            v-model="jacInfoDB.tiempoJuntaDirectiva"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']" />
        </q-item-label>
      </q-item-section>      

    </q-item>
    
    <q-item>

      <q-item-section>
        <q-item-label>Años de permanencia en directiva</q-item-label>
        <q-item-label caption>
          <q-input
            outlined
            v-model="jacInfoDB.aniosPermanenciaDirectiva"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']" />
        </q-item-label>
      </q-item-section>

        <q-item-section>
            <q-item-label>Frecuencia reunión socios</q-item-label>
            <q-item-label caption>
            <q-input
                outlined
                v-model="jacInfoDB.frecuenciaReunionSocios"
                lazy-rules
                :rules="[val => !!val || 'Campo requerido']" />
            </q-item-label>
        </q-item-section>        

        <q-item-section>
            <q-item-label>Fecha última asamblea</q-item-label>
            <q-item-label caption>
            <q-input
                outlined
                v-model="jacInfoDB.fechaUltimaAsamblea"
                lazy-rules
                :rules="[val => !!val || 'Campo requerido']" />
            </q-item-label>
        </q-item-section>

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>No. Socios que asistieron</q-item-label>
        <q-item-label caption>
          <q-input
            outlined
            v-model="jacInfoDB.noSociosAsistentes"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']" />
        </q-item-label>
      </q-item-section>

        <q-item-section>
            <q-item-label>No. dignatarios que manejan programas de computador</q-item-label>
            <q-item-label caption>
            <q-input
                outlined
                type="number"
                v-model.number="jacInfoDB.noDignatariosComputacion"
                lazy-rules
                :rules="[val => !!val || 'Campo requerido']" />
            </q-item-label>
        </q-item-section> 

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿Tiene plan veredal?</q-item-label>
        <q-item-label caption>
           <q-option-group
             inline
             :options="options"
             type="radio"
             v-model="jacInfoDB.tienePlanVeredal" />
        </q-item-label>
      </q-item-section>

    </q-item>

    <q-item>

      <q-item-section>
        <q-item-label>¿La organización cuenta con plan de acción?</q-item-label>
        <q-item-label caption>
           <q-option-group
             inline
             :options="options"
             type="radio"
             v-model="jacInfoDB.tienePlanAccion" />
        </q-item-label>
      </q-item-section>

    </q-item>


    </q-list>
    
  </q-card-section>

   <q-separator />

  <q-card-actions align="right">
    <q-btn @click="onSubmit" color="primary">Actualizar</q-btn>
  </q-card-actions>

  </q-form>

</q-card>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import {CATEGORIAS} from "src/utils/config";

export default {
  name: "JacInfo",
  data () {
    return {
      jacID: 0,
      jacInfoDB: {},
      options: [
        { label: 'Si', value: true },
        { label: 'No', value: false }
      ]
    }
  },
  created() {

    this.jacID = this.$route.params.id

    this.jacInfoDB = {
      id: this.$route.params.id,
      frecuenciaReunionDirectiva: '',
      tiempoJuntaDirectiva: '',
      aniosPermanenciaDirectiva: '',
      frecuenciaReunionSocios: '',
      fechaUltimaAsamblea: '',
      noSociosAsistentes: '',
      noDignatariosComputacion: '',
      tienePlanVeredal: true,
      tienePlanAccion: true
    }
    this.buscarJacInfoAction(this.jacID).then(data => {
      if(data.id > 0){
        this.jacInfoDB = {...data}
      }
    })

  },
  methods: {
    ...mapActions('jacInfo',['buscarJacInfoAction','registrarJacInfoAction']),  
    onSubmit () {

      this.$refs.fiscalForm.validate().then(success => {
        if (success) {
          this.registrarJacInfoAction(this.jacInfoDB).then(data => {
            this.$q.notify({
              message: 'Información actualizada correctamente',
              color: 'positive'
            })
          })
        }else{
          this.$q.notify({
            message: 'Favor completar los campos correctamente',
            color: 'red'
          })
        }
      })
    }
  },
  computed: {
    ...mapGetters('jacInfo', ['getJacInfoState']),

  }
}
</script>

<style lang="sass">

</style>
