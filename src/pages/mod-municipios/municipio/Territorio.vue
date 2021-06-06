<template>
<div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <q-form ref="ubicacionForm">          
          <p class="text-h6 q-mt-md q-mb-sm">12. Territorio</p>
          <q-card
            flat
            bordered
            class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">¿Cuenta con plan de ordenamiento territorial?</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-option-group :options="optionsCumple" type="radio" v-model="territorio.planDeOrdenamiento" />
                    </div>
                </div>
            </q-card-section>
          </q-card>          

          <q-card
            flat
            bordered
            class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">¿Cuenta con plan de Gestión Ambiental?</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-option-group :options="optionsCumple" type="radio" v-model="territorio.planDeGestionAmbiental" />
                    </div>
                </div>
            </q-card-section>
          </q-card>  

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">¿Cuenta con delimitación de áreas protegidas?</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-option-group :options="optionsCumple" type="radio" v-model="territorio.delimitacionDeAreasProtegidas" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">¿Cuenta con plan de ordenamiento de cuencas hidrográficas?</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-option-group :options="optionsCumple" type="radio" v-model="territorio.planDeOrdenamientoDeCuentasHidricas" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">¿Cuenta con zonas forestales protectoras?</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-option-group :options="optionsCumple" type="radio" v-model="territorio.zonasForestalesProtectoras" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">¿Está el municipio en zona de parques nacionales naturales?</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-option-group :options="optionsCumple" type="radio" v-model="territorio.enZonaDeParquesNaturales" />
                    </div>
                </div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12">
                        <q-input v-if="territorio.enZonaDeParquesNaturales" label="Ingrese el nombre de la zona / parque natural" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">¿Cuenta con el catastro actualizado?</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-option-group :options="optionsCumple" type="radio" v-model="territorio.catastroActualizado" />
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
              :loading="getTerritorioState.loading"
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
      territorio: {},
      optionsCumple: [
        { label: 'Si', value: true },
        { label: 'No', value: false }
      ]
    }
  },
  created(){
    this.encuestaID = this.$route.params.id
    this.territorio = {
      id: 0,
      planDeOrdenamiento:false,
      planDeGestionAmbiental:false,
      delimitacionDeAreasProtegidas:false,
      planDeOrdenamientoDeCuentasHidricas:false,
      zonasForestalesProtectoras:false,
      enZonaDeParquesNaturales:false,
      catastroActualizado:false
    }

    this.buscarTerritorioAction(this.encuestaID).then(data => {
      if(data.id > 0){
        this.territorio = {...data}
      }
    })
    
  },
  methods: {
    ...mapActions('territorio', ['registrarTerritorioAction', 'buscarTerritorioAction']),
    onSubmit(){
        
        this.registrarTerritorioAction({
            ...this.territorio,
            nombreParque: this.territorio.enZonaDeParquesNaturales ? this.territorio.nombreParque : '',
            encuesta: {
                id: this.encuestaID
            }
        }).then(data => {
            this.territorio.id = data
            this.$router.push({name: 'participacion', params: {id: this.encuestaID}})
        })
    }
  },
  computed: {
    ...mapGetters('territorio', ['getTerritorioState'])
  }

}
</script>

<style>

</style>
ViviendaCard