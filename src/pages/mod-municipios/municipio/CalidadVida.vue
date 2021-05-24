<template>
  <div class="q-ma-sm">
      <div class="row">
          <div class="col-xs-12 col-sm-8 offset-sm-2">                
              <q-form ref="ubicacionForm">          
                    <p class="text-h6 q-mt-md q-mb-sm">Calidad de Vida</p>
                    <q-card
                        flat
                        bordered
                        class="my-card q-mb-md">
                        <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">Año de medición</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="calidad.ano" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <p class="text-h6 q-mt-md q-mb-sm">Índice de Pobresa multidimensional</p>

                    <q-card flat bordered class="my-card q-mb-md">
                        <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">IPM Urbano</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="calidad.ipmUrbana" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <q-card flat bordered class="my-card q-mb-md">
                        <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">IPM Rural</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="calidad.ipmRural" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <q-card flat bordered class="my-card q-mb-md">
                        <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">IPM Total</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="calidad.ipmTotal" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <p class="text-h6 q-mt-md q-mb-sm">Necesidades Básicas Insatisfechas</p>

                    <q-card flat bordered class="my-card q-mb-md">
                        <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">NBI Urbano</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="calidad.nbi_urbano" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <q-card flat bordered class="my-card q-mb-md">
                        <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">NBI Rural</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="calidad.nbi_rural" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <p class="text-h6 q-mt-md q-mb-sm">Población en Condiciones de Miseria</p>

                    <q-card flat bordered class="my-card q-mb-md">
                        <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">PCM Urbano</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="calidad.pcmUrbano" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <q-card flat bordered class="my-card q-mb-md">
                        <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">PCM Rural</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="calidad.pcmRural" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <q-card flat bordered class="my-card q-mb-md">
                        <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">PCM Total</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <q-input dense v-model="calidad.pcm" />
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
            calidad: {},
            encuestaID: 0
        }
    },
    created(){
        this.encuestaID = this.$route.params.id
        this.calidad = {
            id: 0,
            ano: '',
            ipmRural:0,
            ipmTotal:0,
            ipmUrbana:0,
            nbi_rural:0,
            nbi_urbano:0,
            pcm:0,
            pcmRural:0,
            pcmUrbano:0,
        }
    },
    methods: {
        ...mapActions('calidadDeVida', ['registrarCalidadDeVidaAction']),
        onSubmit(){
            this.registrarCalidadDeVidaAction({
                ...this.calidad,
                encuesta: {
                    id: this.encuestaID
                }
            }).then(data => {
                this.$router.push({name: 'educacion', params: {id: this.encuestaID}})
            })
        }
        
    },
    computed: {
        ...mapGetters('calidadDeVida', ['getCalidadDeVidaState'])
    }

}
</script>

<style>

</style>