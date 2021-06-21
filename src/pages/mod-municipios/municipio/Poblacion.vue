<template>
    <div class="q-ma-sm">
        <div class="row">
            <div class="col-xs-12 col-sm-8 offset-sm-2">

                <q-form ref="poblacionForm">
                    <p class="text-h6 q-mt-md q-mb-sm">2.1. Composición etaria</p>
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
                                  v-model="poblacionPorRangoDeEdad.ano"
                                  lazy-rules
                                  :rules="[val => !!val || 'Campo requerido']" />
                            </div>
                        </div>
                    </q-card-section>

                    </q-card>

                   <q-card
                     flat
                     bordered
                     class="my-card q-mb-md">
                        <q-card-section class="q-pb-none">
                            <div class="text-h6 q-mb-none">Entre los 0 y 4 años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                   <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.de0A4Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]"/> -->
                                        <q-field
                                        v-model="poblacionPorRangoDeEdad.de0A4Anos"
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
                            <div class="text-h6 q-mb-none">Entre los 5 y 9 años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.de5A9Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]"/> -->
                                    <q-field
                                        v-model="poblacionPorRangoDeEdad.de5A9Anos"
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
                            <div class="text-h6 q-mb-none">Entre los 10 y 14 años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.de10A14Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]"/> -->

                                        <q-field
                                        v-model="poblacionPorRangoDeEdad.de10A14Anos"
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
                            <div class="text-h6 q-mb-none">Entre los 15 y 19 años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.de15A19Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->

                                        <q-field
                                        v-model="poblacionPorRangoDeEdad.de15A19Anos"
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
                            <div class="text-h6 q-mb-none">Entre los 20 y 24 años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.de20A24Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->

                                        <q-field
                                        v-model="poblacionPorRangoDeEdad.de20A24Anos"
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
                            <div class="text-h6 q-mb-none">Entre los 25 y 29 años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.de25A29Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->
                                        <q-field
                                        v-model="poblacionPorRangoDeEdad.de25A29Anos"
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
                            <div class="text-h6 q-mb-none">Entre los 30 y 34 años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.de30A34Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->
                                        <q-field
                                        v-model="poblacionPorRangoDeEdad.de30A34Anos"
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
                            <div class="text-h6 q-mb-none">Entre los 35 y 39 años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.de35A39Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]"/> -->

                                        <q-field
                                        v-model="poblacionPorRangoDeEdad.de35A39Anos"
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
                            <div class="text-h6 q-mb-none">Entre los 40 y 44 años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.de40A44Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->

                                        <q-field
                                        v-model="poblacionPorRangoDeEdad.de40A44Anos"
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
                            <div class="text-h6 q-mb-none">Entre los 45 y 49 años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.de45A49Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->

                                        <q-field
                                        v-model="poblacionPorRangoDeEdad.de45A49Anos"
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
                            <div class="text-h6 q-mb-none">Entre los 50 y 54 años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.de50A54Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->

                                        <q-field
                                        v-model="poblacionPorRangoDeEdad.de50A54Anos"
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
                            <div class="text-h6 q-mb-none">Entre los 55 y 59 años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.de55A59Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->

                                        <q-field
                                        v-model="poblacionPorRangoDeEdad.de55A59Anos"
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
                            <div class="text-h6 q-mb-none">Entre los 60 y 64 años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.de60A64Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]"/> -->

                                        <q-field
                                        v-model="poblacionPorRangoDeEdad.de60A64Anos"
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
                            <div class="text-h6 q-mb-none">Entre los 65 y 69 años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.de65A69Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->

                                        <q-field
                                        v-model="poblacionPorRangoDeEdad.de65A69Anos"
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
                            <div class="text-h6 q-mb-none">Entre los 70 y 74 años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.de70A74Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->

                                        <q-field
                                        v-model="poblacionPorRangoDeEdad.de70A74Anos"
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
                            <div class="text-h6 q-mb-none">Entre los 75 y 79 años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.de75A79Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->

                                        <q-field
                                        v-model="poblacionPorRangoDeEdad.de75A79Anos"
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
                            <div class="text-h6 q-mb-none">De 80 o más años</div>
                        </q-card-section>

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12 col-sm-6">
                                    <!-- <q-input
                                      dense
                                      v-model.number="poblacionPorRangoDeEdad.mayorA80Anos"
                                      type="number"
                                        lazy-rules
                                        :rules="[
                                            val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero',
                                            val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                                        ]" /> -->

                                        <q-field
                                        v-model="poblacionPorRangoDeEdad.mayorA80Anos"
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

                </q-form>

                <div class="flex justify-center">
                    <q-btn
                      label="Guardar y continuar"
                      no-caps
                      color="primary"
                      :disable="getPoblacionState.loading"
                      :loading="getPoblacionState.loading"
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
            price: 5824.23,
            numero: {
                decimal: '.',
                thousands: ',',
                precision: 0,
                masked: false /* doesn't work with directive */
            },
            encuestaID: 0,
            poblacionPorRangoDeEdad: {}
        }
    },
    created () {
        this.encuestaID = this.$route.params.id
        this.poblacionPorRangoDeEdad = {
            id: 0,
            estado: true,
            ano: '',
            de0A4Anos: 0,
            de5A9Anos: 0,
            de10A14Anos: 0,
            de15A19Anos: 0,
            de20A24Anos: 0,
            de25A29Anos: 0,
            de30A34Anos: 0,
            de35A39Anos: 0,
            de40A44Anos: 0,
            de45A49Anos: 0,
            de50A54Anos: 0,
            de55A59Anos: 0,
            de60A64Anos: 0,
            de65A69Anos: 0,
            de70A74Anos: 0,
            de75A79Anos: 0,
            mayorA80Anos: 0,
        }

        this.buscarPoblacionAction(this.encuestaID).then(data => {
            if(data.id > 0){
                this.poblacionPorRangoDeEdad = {...data}
            }
        })
    },
    methods: {
        ...mapActions('poblacion', ['guardarPoblacion','agregarPoblacionAction', 'buscarPoblacionAction', 'eliminarPoblacionAction']),
        onSubmit(){
            this.$refs.poblacionForm.validate().then(success => {
                if (success) {
                    this.guardarPoblacion({
                        ...this.poblacionPorRangoDeEdad,
                        encuesta: {
                            id: this.encuestaID
                        }
                    }).then(data => {
                        this.poblacionPorRangoDeEdad.id = data
                        this.$router.push({name: 'calidad-vida', params: {id: this.encuestaID}})
                    })
                }else{
                    this.$q.notify({
                        message: 'Favor completar los campos correctamente',
                        color: 'red'
                    })
                }
            })
        },


    },
    computed: {
        ...mapGetters('poblacion', ['getPoblacionState'])
    }
}
</script>

<style>

</style>
