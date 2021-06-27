<template>
<q-card
  flat
  bordered>

  <q-form ref="afiliadosForm">    

  <q-card-section>

    <q-list class="report-list">

        <q-item>
            <q-item-section>
            <q-item-label>3. Datos de los Afiliados</q-item-label>
            </q-item-section>
        </q-item>      

        <q-item>

            <q-item-section>
                <q-item-label>No. Hombres</q-item-label>
                <q-item-label caption>
                    <q-input
                        outlined
                        v-model="jacInfoDB.noHombres"
                        lazy-rules
                        :rules="[val => !!val || 'Campo requerido']" />
                </q-item-label>
            </q-item-section>

            <q-item-section>
                <q-item-label>No. Mujeres</q-item-label>
                <q-item-label caption>
                    <q-input
                        outlined
                        v-model="jacInfoDB.noMujeres"
                        lazy-rules
                        :rules="[val => !!val || 'Campo requerido']" />
                </q-item-label>
            </q-item-section>

            <q-item-section>
                <q-item-label>No. Afros</q-item-label>
                <q-item-label caption>
                    <q-input
                        outlined
                        v-model="jacInfoDB.noAfros"
                        lazy-rules
                        :rules="[val => !!val || 'Campo requerido']" />
                </q-item-label>
            </q-item-section>

        </q-item>

        <q-item>

            <q-item-section>
                <q-item-label>No. Indígenas</q-item-label>
                <q-item-label caption>
                    <q-input
                        outlined
                        v-model="jacInfoDB.noIndigenas"
                        lazy-rules
                        :rules="[val => !!val || 'Campo requerido']" />
                </q-item-label>
            </q-item-section>

            <q-item-section>
                <q-item-label>No. Población Discapacitada</q-item-label>
                <q-item-label caption>
                    <q-input
                        outlined
                        v-model="jacInfoDB.noPoblacionDiscapacitada"
                        lazy-rules
                        :rules="[val => !!val || 'Campo requerido']" />
                </q-item-label>
            </q-item-section>

            <q-item-section>
                <q-item-label>Pob. Entre 14 y 28 años</q-item-label>
                <q-item-label caption>
                    <q-input
                        outlined
                        v-model="jacInfoDB.noPoblacionEntre14y28"
                        lazy-rules
                        :rules="[val => !!val || 'Campo requerido']" />
                </q-item-label>
            </q-item-section>

        </q-item>

        <q-item>

            <q-item-section>
                <q-item-label>No. Hombres Jóvenes</q-item-label>
                <q-item-label caption>
                    <q-input
                        outlined
                        v-model="jacInfoDB.noHombresJovenes"
                        lazy-rules
                        :rules="[val => !!val || 'Campo requerido']" />
                </q-item-label>
            </q-item-section>

            <q-item-section>
                <q-item-label>No. Mujeres Jóvenes</q-item-label>
                <q-item-label caption>
                    <q-input
                        outlined
                        v-model="jacInfoDB.noMujeresJovenes"
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

export default {
  name: "JacInfo",
  data () {
    return {
      jacInfoDB: {}
    }
  },
  created() {

    this.jacInfoDB = {
      id: this.$route.params.id,
      noHombres: '',
      noMujeres: '',
      noAfros: '',
      noIndigenas: '',
      noPoblacionDiscapacitada: '',
      noPoblacionEntre14y28: '',
      noHombresJovenes: '',
      noMujeresJovenes: ''
    }    

    this.buscarJacInfoAction(this.jacInfoDB.id).then(data => {
      if(data.id > 0){
        this.jacInfoDB = {...data}
      }
    })
  },
  methods: {
    ...mapActions('jacInfo',['buscarJacInfoAction','registrarJacInfoAction']),  
    onSubmit () {

      this.$refs.afiliadosForm.validate().then(success => {
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
