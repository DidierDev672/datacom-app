<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">

        <q-form ref="ubicacionForm">    

          <p class="text-h6 q-mt-md q-mb-sm">5.1. Cobertura Servicios Público</p>
          
          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Energía Eléctrica Urbana</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="cobertura.energiaElectricaUrbana" />
                    </div>
                </div>
            </q-card-section>
          </q-card> 

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Energía Eléctrica Rural</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="cobertura.energiaElectricaRural" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Acueducto Urbano</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="cobertura.acueductoUrbano" />
                    </div>
                </div>
            </q-card-section>
          </q-card> 

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Acueducto Rural</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="cobertura.acueductoRural" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Alcantarillado Urbano</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="cobertura.alcantarilladoUrbana" />
                    </div>
                </div>
            </q-card-section>
          </q-card> 

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Alcantarillado Rural</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="cobertura.alcantarilladoRural" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Gas Natural Urbano</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="cobertura.gasNaturalUrbana" />
                    </div>
                </div>
            </q-card-section>
          </q-card> 

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Gas Natural Rural</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="cobertura.gasNaturalRural" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Internet Urbano</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="cobertura.internetUrbana" />
                    </div>
                </div>
            </q-card-section>
          </q-card> 

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Internet Rural</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="cobertura.internetRural" />
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
      cobertura: {}
    }
  },
  created(){
    this.encuestaID = this.$route.params.id
    this.cobertura = {
      id: 0,
      energiaElectricaUrbana:'',
      energiaElectricaRural:'',
      acueductoUrbano:'',
      acueductoRural:'',
      alcantarilladoUrbana:'',
      alcantarilladoRural:'',
      gasNaturalUrbana:'',
      gasNaturalRural:'',
      internetUrbana:'',
      internetRural:'',
    }
  },
  methods: {
    ...mapActions('coberturaServicios', ['registrarCoberturaAction']),
    onSubmit(){
        this.registrarCoberturaAction({
            ...this.cobertura,
            encuesta: {
                id: this.encuestaID
            }
        }).then(data => {
            this.$router.push({name: 'seguridad', params: {id: this.encuestaID}})
        })
    }
  },
  computed: {
    ...mapGetters('coberturaServicios', ['getCoberturaState'])
  }

}
</script>

<style>

</style>
ViviendaCard