<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">

        <q-form ref="coberturaForm">    

          <p class="text-h6 q-mt-md q-mb-sm">5.1. Cobertura Servicios Público</p>
          
          <q-card flat bordered class="my-card q-mb-md">
            <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Energía Eléctrica Urbana</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <!-- <q-input
                          dense
                          v-model.number="cobertura.energiaElectricaUrbana" 
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]"/> -->

                            <q-field                    
                            v-model="cobertura.energiaElectricaUrbana"
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
                <div class="text-h6 q-mb-none">Energía Eléctrica Rural</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <!-- <q-input
                          dense
                          v-model.number="cobertura.energiaElectricaRural" 
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]"/> -->

                             <q-field                    
                            v-model="cobertura.energiaElectricaRural"
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
                <div class="text-h6 q-mb-none">Acueducto Urbano</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <!-- <q-input
                          dense
                          v-model.number="cobertura.acueductoUrbano" 
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]"/> -->

                             <q-field                    
                            v-model="cobertura.acueductoUrbano"
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
                <div class="text-h6 q-mb-none">Acueducto Rural</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <!-- <q-input
                          dense
                          v-model.number="cobertura.acueductoRural" 
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]"/> -->

                             <q-field                    
                            v-model="cobertura.acueductoRural"
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
                <div class="text-h6 q-mb-none">Alcantarillado Urbano</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <!-- <q-input
                          dense
                          v-model.number="cobertura.alcantarilladoUrbana" 
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]"/> -->

                             <q-field                    
                            v-model="cobertura.alcantarilladoUrbana"
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
                <div class="text-h6 q-mb-none">Alcantarillado Rural</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <!-- <q-input
                          dense
                          v-model.number="cobertura.alcantarilladoRural"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                             <q-field                    
                            v-model="cobertura.alcantarilladoRural"
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
                <div class="text-h6 q-mb-none">Gas Natural Urbano</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <!-- <q-input
                          dense
                          v-model.number="cobertura.gasNaturalUrbana" 
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]"/> -->

                             <q-field                    
                            v-model="cobertura.gasNaturalUrbana"
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
                <div class="text-h6 q-mb-none">Gas Natural Rural</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <!-- <q-input
                          dense
                          v-model.number="cobertura.gasNaturalRural"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                             <q-field                    
                            v-model="cobertura.gasNaturalRural"
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
                <div class="text-h6 q-mb-none">Internet Urbano</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <!-- <q-input
                          dense
                          v-model.number="cobertura.internetUrbana"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->
                             <q-field                    
                            v-model="cobertura.internetUrbana"
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
                <div class="text-h6 q-mb-none">Internet Rural</div>
            </q-card-section>

            <q-card-section>
                <div class="row">
                    <div class="col-xs-12 col-sm-6">
                        <!-- <q-input
                          dense
                          v-model.number="cobertura.internetRural"
                          type="number"
                            lazy-rules 
                            :rules="[
                                val => val !== null && val !== '' || 'Debe ingresar un valor ',
                                val => val > -1 || 'El valor ingresado debe ser mayor a cero '
                            ]" /> -->

                             <q-field                    
                            v-model="cobertura.internetRural"
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
              :disable="getCoberturaState.loading"
              :loading="getCoberturaState.loading"
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
      cobertura: {},
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
    this.buscarCoberturaAction(this.encuestaID).then(data => {
        this.cobertura = {...data}
    })
  },
  methods: {
    ...mapActions('coberturaServicios', ['registrarCoberturaAction', 'buscarCoberturaAction']),
    onSubmit(){
        this.$refs.coberturaForm.validate().then(success => {
            if (success) {                    
                console.log('Form valido', this.cobertura);
                this.registrarCoberturaAction({
                    ...this.cobertura,
                    encuesta: {
                        id: this.encuestaID
                    }
                }).then(data => {
                    this.cobertura.id = data
                    this.$router.push({name: 'seguridad', params: {id: this.encuestaID}})
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
    ...mapGetters('coberturaServicios', ['getCoberturaState'])
  }

}
</script>

<style>

</style>
ViviendaCard