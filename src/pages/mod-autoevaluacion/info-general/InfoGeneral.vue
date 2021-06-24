<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <div v-if="step==1">
          <q-form ref="organizacionForm">
            <p class="text-h6 q-mt-md q-mb-sm">1. Datos de la Organización</p>

            <q-card
              flat
              bordered
              class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Nombre *</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      use-input
                      v-model="infoGeneral.jac"
                      option-label="nombre"
                      option-value="id"
                      hint="Seleccione la organización"
                      :options="jacOptions"
                      @input="completarDatos"
                      lazy-rules
                      :rules="[ val => val != null && val.id > 0 || 'Debe elegir una organizacion']" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card
              flat
              bordered
              class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Nit</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      outlined
                      v-model="nit"
                      readonly
                      label="Nit de la organización"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card
              flat
              bordered
              class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Representante Legal</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input
                      outlined
                      readonly
                      v-model="repLegal"
                      label="Nombre del representante legal de la organización"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>

          </q-form>
        </div>


        <div class="flex justify-center">
            <!-- <q-btn v-if="step > 1" label="Anterior" no-caps color="primary" flat class="q-mr-sm" @click="anterior"/>
            <q-btn v-if="step < 3" label="Guardar y continuar" no-caps color="primary" @click="siguiente"/> -->
            <q-btn
              label="Guardar y continuar"
              no-caps
              color="primary"
              :disable="getInformacionGeneralState.loading"
              :loading="getInformacionGeneralState.loading"
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
  data () {
    return {
      encuestaID: 0,
      infoGeneral: {},
      jacOptions: [],
      nit: '',
      repLegal: '',
      step: 1
    }
  },
  created() {
    this.infoGeneral = {
      id: 0,
      jac: {
        id: 0,
        nombre: ''
      },
      comunidad: '',
      municipio: ''
    }
    this.encuestaID = this.$route.params.id
    this.buscarInformacionGeneralAction(this.encuestaID).then(data => {
      if(data.id > 0){
        //this.step = 5
        this.infoGeneral = {...data}
        this.nit = data.jac.nit
        this.repLegal = data.jac.representanteLegal
      }
    })

    this.cargarListaJacAction().then(data => {
      this.jacOptions = data
    })
  },
  methods: {
    ...mapActions('informacionGeneral',['buscarInformacionGeneralAction','guardarInformacionGeneralAction']),
    ...mapActions('jac',['cargarListaJacAction']),
    siguiente(){

      // this.validarForm()

    },
    anterior(){
      if(this.step < 1){
        this.step = 1
        console.log('No se puede regresar mas')
      }else{
        this.step--
      }
    },
    onSubmit () {
      this.$refs.organizacionForm.validate().then(success => {
            if (success) {
              this.guardarInformacionGeneralAction({
                ...this.infoGeneral,
                encuesta: {
                  id: this.encuestaID
                }
              }).then(data => {
                this.infoGeneral.id = data
                this.$router.push({name: 'a-indicadores', params: {id: this.encuestaID}})
              })
            }else{
              this.$q.notify({
                  message: 'Favor completar los campos correctamente',
                  color: 'red'
              })
            }
          })
    },
    completarDatos(value){
      this.nit = value.nit
      this.repLegal = value.representanteLegal
      this.infoGeneral.comunidad = value.comunidad
      this.infoGeneral.municipio = value.comunidad.municipio
    }
  },
  computed: {
    ...mapGetters('informacionGeneral', ['getInformacionGeneralState']),
  }
}
</script>

<style>

</style>
