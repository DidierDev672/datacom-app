<template>
<q-card
  flat
  bordered>

  <q-form ref="fiscalForm">    

  <q-card-section>

    <q-list class="report-list">

      <q-item>
        <q-item-section>
          <q-item-label>Datos del Fiscal</q-item-label>
        </q-item-section>
      </q-item>
      

    <q-item>

      <q-item-section>
        <q-item-label>Nombre completo</q-item-label>
        <q-item-label caption>
          <q-input
            outlined
            v-model="jacInfoDB.fiscal"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']" />
        </q-item-label>
      </q-item-section>

    </q-item>
    
    <q-item>

      <q-item-section>
        <q-item-label>Número de Documento</q-item-label>
        <q-item-label caption>
          <q-input
            outlined
            v-model="jacInfoDB.noIdentificacionFiscal"
            lazy-rules
            :rules="[val => !!val || 'Campo requerido']" />
        </q-item-label>
      </q-item-section>

        <q-item-section>
            <q-item-label>Celular</q-item-label>
            <q-item-label caption>
            <q-input
                outlined
                v-model="jacInfoDB.celularFiscal"
                lazy-rules
                :rules="[val => !!val || 'Campo requerido']" />
            </q-item-label>
        </q-item-section>        

        <q-item-section>
            <q-item-label>Email</q-item-label>
            <q-item-label caption>
            <q-input
                outlined
                v-model="jacInfoDB.emailFiscal"
                lazy-rules
                :rules="[val => !!val || 'Campo requerido']" />
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
    }
  },
  created() {

    this.jacID = this.$route.params.id

    this.jacInfoDB = {
      id: this.$route.params.id,
      fiscal: '',
      noIdentificacionFiscal: '',
      celularFiscal: '',
      emailFiscal: ''
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
