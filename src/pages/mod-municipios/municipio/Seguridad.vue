<template>
<div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <q-form ref="ubicacionForm">          
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
                        <q-input dense v-model="seguridad.homicidiosPorAno" />
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
                        <q-input dense v-model="seguridad.tasaHomicidios" />
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
                        <q-input dense v-model="seguridad.poblacionVictimaDelConflicto" />
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
            <q-btn label="Guardar y continuar" no-caps color="primary" @click="onSubmit"/>
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
  },
  methods: {
    ...mapActions('seguridad', ['registrarSeguridadAction']),
    onSubmit(){
        this.registrarSeguridadAction({
            ...this.seguridad,
            encuesta: {
                id: this.encuestaID
            }
        }).then(data => {
            this.$router.push({name: 'administracion', params: {id: this.encuestaID}})
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