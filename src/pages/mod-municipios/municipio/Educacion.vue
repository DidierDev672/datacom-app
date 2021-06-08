<template>
<div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <q-form ref="educacionForm">          
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
                        <!-- <q-input
                          dense
                          v-model.number="educacion.coberturaNetaTransicion" 
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]"/> -->
                            <q-field                    
                            v-model="educacion.coberturaNetaTransicion"
                            hint="#,###"
                            >
                            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                <money :id="id" class="q-field__input" :value="value" @input="emitValue" v-bind="numero" v-show="floatingLabel" />
                            </template>
                            </q-field>
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
                        <!-- <q-input
                          dense
                          v-model.number="educacion.coberturaNetaBasicaPrimaria"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->
                            <q-field                    
                            v-model="educacion.coberturaNetaBasicaPrimaria"
                            hint="#,###"
                            >
                            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                <money :id="id" class="q-field__input" :value="value" @input="emitValue" v-bind="numero" v-show="floatingLabel" />
                            </template>
                            </q-field>
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
                        <!-- <q-input
                          dense
                          v-model.number="educacion.coberturaNetaBasicaSecundaria"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                            <q-field                    
                            v-model="educacion.coberturaNetaBasicaSecundaria"
                            hint="#,###"
                            >
                            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                <money :id="id" class="q-field__input" :value="value" @input="emitValue" v-bind="numero" v-show="floatingLabel" />
                            </template>
                            </q-field>
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
                        <!-- <q-input
                          dense
                          v-model.number="educacion.coberturaNetaEducacionMedia"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->
                            <q-field                    
                            v-model="educacion.coberturaNetaEducacionMedia"
                            hint="#,###"
                            >
                            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                <money :id="id" class="q-field__input" :value="value" @input="emitValue" v-bind="numero" v-show="floatingLabel" />
                            </template>
                            </q-field>
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
                        <!-- <q-input
                          dense
                          v-model.number="educacion.coberturaNetaTotal"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                            <q-field                    
                            v-model="educacion.coberturaNetaTotal"
                            hint="#,###"
                            >
                            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                <money :id="id" class="q-field__input" :value="value" @input="emitValue" v-bind="numero" v-show="floatingLabel" />
                            </template>
                            </q-field>
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
                        <!-- <q-input
                          dense
                          v-model.number="educacion.coberturaBrutaTransicion"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                            <q-field                    
                            v-model="educacion.coberturaBrutaTransicion"
                            hint="#,###"
                            >
                            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                <money :id="id" class="q-field__input" :value="value" @input="emitValue" v-bind="numero" v-show="floatingLabel" />
                            </template>
                            </q-field>
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
                        <!-- <q-input
                          dense
                          v-model.number="educacion.coberturaBrutaBasicaPrimaria"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                            <q-field                    
                            v-model="educacion.coberturaBrutaBasicaPrimaria"
                            hint="#,###"
                            >
                            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                <money :id="id" class="q-field__input" :value="value" @input="emitValue" v-bind="numero" v-show="floatingLabel" />
                            </template>
                            </q-field>
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
                        <!-- <q-input
                          dense
                          v-model.number="educacion.coberturaBrutaBasicaSecundaria"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                            <q-field                    
                            v-model="educacion.coberturaBrutaBasicaSecundaria"
                            hint="#,###"
                            >
                            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                <money :id="id" class="q-field__input" :value="value" @input="emitValue" v-bind="numero" v-show="floatingLabel" />
                            </template>
                            </q-field>
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
                        <!-- <q-input
                          dense
                          v-model.number="educacion.coberturaBrutaEducacionMedia"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                            <q-field                    
                            v-model="educacion.coberturaBrutaEducacionMedia"
                            hint="#,###"
                            >
                            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                <money :id="id" class="q-field__input" :value="value" @input="emitValue" v-bind="numero" v-show="floatingLabel" />
                            </template>
                            </q-field>
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
                        <!-- <q-input
                          dense
                          v-model.number="educacion.coberturaBrutaTotal"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                            <q-field                    
                            v-model="educacion.coberturaBrutaTotal"
                            hint="#,###"
                            >
                            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                <money :id="id" class="q-field__input" :value="value" @input="emitValue" v-bind="numero" v-show="floatingLabel" />
                            </template>
                            </q-field>
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
                        <!-- <q-input
                          dense
                          v-model.number="educacion.tasaDeAnalfabestismoUrbano"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                            <q-field                    
                            v-model="educacion.tasaDeAnalfabestismoUrbano"
                            hint="#,###"
                            >
                            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                <money :id="id" class="q-field__input" :value="value" @input="emitValue" v-bind="numero" v-show="floatingLabel" />
                            </template>
                            </q-field>
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
                        <!-- <q-input
                          dense
                          v-model.number="educacion.tasaDeAnalfabestismoRural"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                            <q-field                    
                            v-model="educacion.tasaDeAnalfabestismoRural"
                            hint="#,###"
                            >
                            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                <money :id="id" class="q-field__input" :value="value" @input="emitValue" v-bind="numero" v-show="floatingLabel" />
                            </template>
                            </q-field>
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
                        <!-- <q-input
                          dense
                          v-model.number="educacion.puntajePromedioSaberMatematica"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                            <q-field                    
                            v-model="educacion.puntajePromedioSaberMatematica"
                            hint="#,###"
                            >
                            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                <money :id="id" class="q-field__input" :value="value" @input="emitValue" v-bind="decimales" v-show="floatingLabel" />
                            </template>
                            </q-field>
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
                        <!-- <q-input
                          dense
                          v-model.number="educacion.puntajePromedioSaberLectura"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->
                            <q-field                    
                            v-model="educacion.puntajePromedioSaberLectura"
                            hint="#,###"
                            >
                            <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                                <money :id="id" class="q-field__input" :value="value" @input="emitValue" v-bind="decimales" v-show="floatingLabel" />
                            </template>
                            </q-field>
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
              :disable="getEducacionState.loading"
              :loading="getEducacionState.loading"
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
      educacion: {},
      numero: {
          decimal: '.',
          thousands: ',',
          precision: 0,
          masked: false /* doesn't work with directive */
      },
      decimales: {
          decimal: '.',
          thousands: ',',
          precision: 2,
          masked: false /* doesn't work with directive */
      },
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

    this.buscarEducacionAction(this.encuestaID).then(data => {
        if(data.id > 0){
            this.educacion = {...data}
        }
    })
    
  },
  methods: {
    ...mapActions('educacion', ['registrarEducacionAction', 'buscarEducacionAction']),
    onSubmit(){
        this.$refs.educacionForm.validate().then(success => {
            if (success) {                    
                console.log('Form valido', this.educacion);
                this.registrarEducacionAction({
                    ...this.educacion,
                    encuesta: {
                        id: this.encuestaID
                    }
                }).then(data => {
                    this.educacion.id = data
                    this.$router.push({name: 'viviendas-municipio', params: {id: this.encuestaID}})
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
    ...mapGetters('educacion', ['getEducacionState'])
  }

}
</script>

<style>

</style>
ViviendaCard