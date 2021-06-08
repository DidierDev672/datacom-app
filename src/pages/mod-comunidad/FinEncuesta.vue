<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">

         <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Felicitaciones!!</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12">
                        <p>Ha completado la encuesta para comunidades del Sistema de Información Datacom, haga click en el boton finalizar para regresar al menu principal</p>
                        <p class="text-caption">Marque la casilla para indicar que la encuesta ha sido completada en su totalidad</p>
                        <q-checkbox v-model="encuesta.encuestaCerrada" label="¿Encuesta completa?" />

                    </div>
                </div>
            </q-card-section>
          </q-card>

          <div class="flex justify-center">
            <q-btn
              label="Finalizar"
              no-caps
              color="primary"
              :loading="getEncuestaState.loading"
              :disable="getEncuestaState.loading"
              @click="onSubmit" >
              <template v-slot:loading>
                <q-spinner-facebook />
              </template>
            </q-btn>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
    data(){
        return {
            encuestaID: 0,
            encuesta: {}
        }
    },

    created () {
        this.encuestaID = this.$route.params.id
        this.buscarEncuestaAction(this.encuestaID).then(data => {
          if(data.id > 0){
            this.encuesta = {...data}
          }
        })
              
    },

    methods: {
        ...mapActions('encuesta',['buscarEncuestaAction','actualizarEncuestaAction']),
        onSubmit(){
            this.actualizarEncuestaAction(this.encuesta).then(data => {
                this.$router.push('/')
            })
        }
    },
    computed: {
     ...mapGetters('encuesta', ['getEncuestaState'])
  }

}
</script>

<style>

</style>