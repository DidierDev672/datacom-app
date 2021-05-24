<template>
<div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2"> 

        <q-form ref="ubicacionForm">          
          <p class="text-h6 q-mt-md q-mb-sm">5. Vivienda</p>

          <q-card
            flat
            bordered
            class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No. Viviendas Urbanas</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="vivienda.numeroDeViviendasUrbanas" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No. Viviendas Rurales</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="vivienda.numeroDeViviendasRurales" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No. Hogares Urbanos</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="vivienda.numeroDeHogaresUrbanos" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No. Hogares Rurales</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="vivienda.numeroDeHogaresRurales" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Déficit Cuantitativo</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="vivienda.deficitCuantitativo" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Déficit Cualitativo</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="vivienda.deficitCualitativo" />
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
      vivienda: {}
    }
  },
  created(){
    this.encuestaID = this.$route.params.id
    this.vivienda = {
      id: 0,
      deficitCualitativo:0,
      deficitCuantitativo:0,
      numeroDeHogaresRurales:0,
      numeroDeHogaresUrbanos:0,
      numeroDeViviendasRurales:0,
      numeroDeViviendasUrbanas:0
    }
  },
  methods: {
    ...mapActions('viviendas', ['registrarViviendaAction']),
    onSubmit(){
        this.registrarViviendaAction({
            ...this.vivienda,
            encuesta: {
                id: this.encuestaID
            }
        }).then(data => {
            this.$router.push({name: 'cobertura-servicio', params: {id: this.encuestaID}})
        })
    }
  },
  computed: {
    ...mapGetters('viviendas', ['getViviendaState'])
  }

}
</script>

<style>

</style>