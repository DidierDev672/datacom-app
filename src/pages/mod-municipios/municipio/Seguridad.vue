<template>
<div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <q-form ref="seguridadForm">          
          <p class="text-h6 q-mt-md q-mb-sm">6. Seguridad</p>
          <q-card
            flat
            bordered
            class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Homicidos año</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input
                          dense
                          v-model.number="seguridad.homicidiosPorAno"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card
            flat
            bordered
            class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Tasa de Homicidios</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input
                          dense
                          v-model.number="seguridad.tasaHomicidios"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Población Víctima del conflicto</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input
                          dense
                          v-model.number="seguridad.poblacionVictimaDelConflicto" 
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]"/>
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Otros delitos</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12">
                        <q-input type="textarea" dense v-model="seguridad.otrosDelitos" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

         
        </q-form>

        <div class="flex justify-center">
            <q-btn
              label="Guardar y continuar"
              no-caps
              color="primary"
              :disable="getSeguridadState.loading"
              :loading="getSeguridadState.loading"
              @click="onSubmit">
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
import { mapActions, mapGetters } from 'vuex'
export default {
  data(){
    return {
      encuestaID: 0,
      seguridad: {}
    }
  },
  created(){
    this.encuestaID = this.$route.params.id
    this.seguridad = {
      id: 0,
      homicidiosPorAno:'',
      tasaHomicidios:'',
      poblacionVictimaDelConflicto:'',
      otrosDelitos:''
    }
    this.buscarSeguridadAction(this.encuestaID).then(data => {
      if(data.id > 0){
        this.seguridad = {...data}
      }
    })    
  },
  methods: {
    ...mapActions('seguridad', ['registrarSeguridadAction', 'buscarSeguridadAction']),
    onSubmit(){
      this.$refs.seguridadForm.validate().then(success => {
            if (success) {                    
                console.log('Form valido', this.seguridad);
              this.registrarSeguridadAction({
                  ...this.seguridad,
                  encuesta: {
                      id: this.encuestaID
                  }
              }).then(data => {
                this.seguridad.id = data
                  this.$router.push({name: 'administracion', params: {id: this.encuestaID}})
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
    ...mapGetters('seguridad', ['getSeguridadState'])
  }

}
</script>

<style>

</style>
ViviendaCard