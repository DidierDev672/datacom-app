<template>
<div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <q-form ref="ubicacionForm">          
          <p class="text-h6 q-mt-md q-mb-sm">4. Educación</p>
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
                        <q-input dense v-model="educacion.ano" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <p class="text-h6 q-mt-md q-mb-sm">Cobertura Neta</p>

          <q-card
            flat
            bordered
            class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Transición</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="educacion.coberturaNetaTransicion" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Básica Primaria</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="educacion.coberturaNetaBasicaPrimaria" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Básica Secundaria</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="educacion.coberturaNetaBasicaSecundaria" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Educación Media</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="educacion.coberturaNetaEducacionMedia" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Total Cobertura Neta</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="educacion.coberturaNetaTotal" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <p class="text-h6 q-mt-md q-mb-sm">Cobertura Bruta</p>

          <q-card
            flat
            bordered
            class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Transición</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="educacion.coberturaBrutaTransicion" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Básica Primaria</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="educacion.coberturaBrutaBasicaPrimaria" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Básica Secundaria</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="educacion.coberturaBrutaBasicaSecundaria" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Educación Media</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="educacion.coberturaBrutaEducacionMedia" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Total Cobertura Bruta</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="educacion.coberturaBrutaTotal" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <p class="text-h6 q-mt-md q-mb-sm">Analfabetismo</p>

          <q-card
            flat
            bordered
            class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Urbano</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="educacion.tasaDeAnalfabestismoUrbano" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Rural</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="educacion.tasaDeAnalfabestismoRural" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <p class="text-h6 q-mt-md q-mb-sm">Pruebas Saber 11</p>

          <q-card
            flat
            bordered
            class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Promedio Prueba Matemáticas</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="educacion.puntajePromedioSaberMatematica" />
                    </div>
                </div>
            </q-card-section>
          </q-card>

          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Promedio Prueba Lectura</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <q-input dense v-model="educacion.puntajePromedioSaberLectura" />
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
      educacion: {}
    }
  },
  created(){
    this.encuestaID = this.$route.params.id
    this.educacion = {
      id: 0,
      ano:'',
      coberturaNetaTransicion:'',
      coberturaNetaBasicaPrimaria:'',
      coberturaNetaBasicaSecundaria:'',
      coberturaNetaEducacionMedia:'',
      coberturaNetaTotal:'',
      coberturaBrutaTransicion:'',
      coberturaBrutaBasicaPrimaria:'',
      coberturaBrutaBasicaSecundaria:'',
      coberturaBrutaEducacionMedia:'',
      tasaDeAnalfabestismo:'',
      tasaDeAnalfabestismoUrbano:'',
      tasaDeAnalfabestismoRural:'',
      puntajePromedioSaberMatematica:'',
      puntajePromedioSaberLectura:'',
    }
    
  },
  methods: {
    ...mapActions('educacion', ['registrarEducacionAction']),
    onSubmit(){
        this.registrarEducacionAction({
            ...this.educacion,
            encuesta: {
                id: this.encuestaID
            }
        }).then(data => {
            this.$router.push({name: 'viviendas-municipio', params: {id: this.encuestaID}})
        })
    }
  },
  computed: {
    ...mapGetters('educacion', ['getEducacionState'])
  }

}
</script>

<style>

</style>
ViviendaCard