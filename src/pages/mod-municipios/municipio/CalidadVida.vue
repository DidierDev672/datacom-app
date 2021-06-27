<template>
  <div class="q-ma-sm">
      <div class="row">
          <div class="col-xs-12 col-sm-8 offset-sm-2">
              <q-form ref="calidadForm">
                    <p class="text-h6 q-mt-md q-mb-sm">3. Calidad de Vida</p>
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
                                    <q-input
                                      dense
                                      v-model="calidad.ano"
                                      lazy-rules
                                  :rules="[val => !!val || 'Campo requerido']" />
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>

                    <p class="text-h6 q-mt-md q-mb-sm">Índice de Pobreza multidimensional</p>

                    <q-card flat bordered class="my-card q-mb-md">
                        <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">IPM Urbano</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="calidad.ipmUrbana"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]"/> -->
                                        <q-field
                                        v-model="calidad.ipmUrbana"
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
                            <div class="text-h6 q-mb-none">IPM Rural</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="calidad.ipmRural"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->

                                        <q-field
                                        v-model="calidad.ipmRural"
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
                            <div class="text-h6 q-mb-none">IPM Total</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="calidad.ipmTotal"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->

                                        <q-field
                                        v-model="calidad.ipmTotal"
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

                    <p class="text-h6 q-mt-md q-mb-sm">Necesidades Básicas Insatisfechas</p>

                    <q-card flat bordered class="my-card q-mb-md">
                        <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">NBI Urbano</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="calidad.nbi_urbano"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->

                                        <q-field
                                        v-model="calidad.nbi_urbano"
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
                            <div class="text-h6 q-mb-none">NBI Rural</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="calidad.nbi_rural"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]"/> -->

                                        <q-field
                                        v-model="calidad.nbi_rural"
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

                    <p class="text-h6 q-mt-md q-mb-sm">Población en Condiciones de Miseria</p>

                    <q-card flat bordered class="my-card q-mb-md">
                        <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">PCM Urbano</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="calidad.pcmUrbano"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->

                                        <q-field
                                        v-model="calidad.pcmUrbano"
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
                            <div class="text-h6 q-mb-none">PCM Rural</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="calidad.pcmRural"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->
                                        <q-field
                                        v-model="calidad.pcmRural"
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
                            <div class="text-h6 q-mb-none">PCM Total</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="calidad.pcm"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->

                                        <q-field
                                        v-model="calidad.pcm"
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
                      :disable="getCalidadDeVidaState.loading"
                      :loading="getCalidadDeVidaState.loading"
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
import { mapActions, mapGetters } from 'vuex'
export default {
    data(){
        return {
            calidad: {},
            encuestaID: 0,
            decimales: {
                decimal: '.',
                thousands: ',',
                suffix: ' %',
                precision: 2,
                masked: false /* doesn't work with directive */
            },
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
        this.buscarCalidadDeVidaAction(this.encuestaID).then(data => {
            if(data.id > 0){
                this.calidad = {...data}
            }
        })
    },
    methods: {
        ...mapActions('calidadDeVida', ['registrarCalidadDeVidaAction', 'buscarCalidadDeVidaAction']),
        onSubmit(){

            this.$refs.calidadForm.validate().then(success => {
                if (success) {
                    console.log('Form valido', this.calidad);
                    this.registrarCalidadDeVidaAction({
                        ...this.calidad,
                        encuesta: {
                            id: this.encuestaID
                        }
                    }).then(data => {
                        this.calidad.id = data
                        this.$router.push({name: 'educacion', params: {id: this.encuestaID}})
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
        ...mapGetters('calidadDeVida', ['getCalidadDeVidaState'])
    }

}
</script>

<style>

</style>
