<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">

        <div v-if="step==1">
          <q-form ref="ubicacionForm">
            <p class="text-h6 q-mt-md q-mb-sm">1. Datos JAC</p>
            <q-card flat bordered class="my-card q-mb-md">


              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-12">
                    <q-select
                      outlined
                      option-value="id"
                      option-label="nombre"
                      v-model="jacInfoDB.tipo"
                      :options="tipoOptions"
                      label="Seleccione el tipo "
                    />
                  </div>
                </div>
                </q-card-section>
              </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-12">
                    <q-input
                      outlined
                      v-model="jacInfoDB.email"
                      label="Email"
                    />
                  </div>
                </div>
                </q-card-section>
              </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-12">
                    <q-checkbox v-model="jacInfoDB.tienePersoneriaJuridica" label="Tiene Personeria Juridica" />
                  </div>
                </div>
                </q-card-section>
              </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-12">
                    <q-input
                      outlined
                      v-model="jacInfoDB.noPersoneriaJuridica"
                      label="No Personeria Juridica"
                    />
                  </div>
                </div>
                </q-card-section>
              </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-12">
                    <q-input
                      outlined
                      v-model="jacInfoDB.personeriaJuridicaOtorgadaPor"
                      label="Personeria Juridica Otorgada Por"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-12">
                    <q-checkbox v-model="jacInfoDB.necesidadCapacitacion" label="Necesidad Capacitacion" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Fecha Actualizacion</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input filled v-model="jacInfoDB.fechaActualizacionJac" mask="date" :rules="['date']">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="jacInfoDB.fechaActualizacionJac">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div v-if="step==2">
          <q-form ref="limitesForm">
            <p class="text-h6 q-mt-md q-mb-sm">1. Datos JAC</p>
            <q-card
              flat
              bordered
              class="my-card q-mb-md">

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-input filled v-model="jacInfoDB.fechaExpedicionPersoneria" mask="date" :rules="['date']">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="jacInfoDB.fechaExpedicionPersoneria">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-12">
                    <q-checkbox v-model="jacInfoDB.tieneRut" label="Tiene Rut" />
                  </div>
                </div>
              </q-card-section>
              </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No Rut</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="jacInfoDB.noRut" label="No Rut" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Fecha Expedicion Rut</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-input filled v-model="jacInfoDB.fechaExpedicionRut" mask="date" :rules="['date']">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="jacInfoDB.fechaExpedicionRut">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-checkbox v-model="jacInfoDB.tieneRuc" label="Tiene Ruc" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No Ruc</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-input dense v-model="jacInfoDB.noRuc" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Fecha Expedicion Ruc</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-input filled v-model="jacInfoDB.fechaExpedicionRuc" mask="date" :rules="['date']">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="jacInfoDB.fechaExpedicionRuc">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div v-if="step == 3">
          <q-form ref="otroForm">
            <q-card
              flat
              bordered
              class="my-card q-mb-md">
              <q-card-section>
                <div class="row q-col-gutter-sm">
                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox v-model="jacInfoDB.tieneRuc" label="Tiene AutoRecocimento" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Autorecocimiento Expedido Por</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="jacInfoDB.autorecocimientoExpedidoPor"/>
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Fecha Expedicion Autoreconocimiento</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="jacInfoDB.fechaExpedicionAutoreconocimiento" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Tipo Identificacion Rep Legal</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 ">
                    <q-select
                      outlined
                      option-value="id"
                      option-label="nombre"
                      v-model="jacInfoDB.tipoIdentificacionRepresentanteLegal"
                      :options="tipoOptions"
                      label="Seleccione el tipo de Identificacion"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No Idetificacion Rep Legal</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="jacInfoDB.noIdentificacionRepresentanteLegal" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Fecha Nacimiento</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input filled v-model="jacInfoDB.fechaNacimiento" mask="date" :rules="['date']">
                      <template v-slot:append>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date v-model="jacInfoDB.fechaNacimiento">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="Close" color="primary" flat></q-btn>
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Genero</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="jacInfoDB.genero" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Nivel Educativo</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <q-select
                      outlined
                      option-value="id"
                      option-label="nombre"
                      v-model="jacInfoDB.nivelEducativa"
                      :options="nivelEducativa"
                      label="Seleccione el Nivel"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Celular</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="jacInfoDB.celular" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>

        </div>
        <div v-if="step == 4">
          <q-form ref="otroFormd">
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Direccion</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="jacInfoDB.direccion"/>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Email</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="jacInfoDB.email"/>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No Hombres</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="jacInfoDB.noHombres"/>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No Afros</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="jacInfoDB.noAfros"/>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No Indigenas</div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="jacInfoDB.noIndigenas"/>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No Poblacion Discapacitada </div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="jacInfoDB.noPoblacionDiscapacitada"/>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No Poblacion Entre 14 y 28 años </div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="jacInfoDB.noPoblacionEntre14y28"/>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No Hombres Jovenes </div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="jacInfoDB.noHombresJovenes"/>
                  </div>
                </div>
              </q-card-section>
            </q-card>
            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">No Mujeres Jovenes </div>
              </q-card-section>
              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="jacInfoDB.noMujeresJovenes"/>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div class="flex justify-center">
          <q-btn v-if="step > 1" label="Anterior" no-caps color="primary" flat class="q-mr-sm" @click="anterior"/>
          <q-btn v-if="step < 4" label="Guardar y continuar" no-caps color="primary" @click="siguiente"/>
          <q-btn
            v-else
            label="Guardar y continuar"
            no-caps
            color="primary"
            :disable="getJacInfoState.loading"
            :loading="getJacInfoState.loading"
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
import {mapActions, mapGetters} from "vuex";
import {CATEGORIAS} from "src/utils/config";

export default {
  name: "JacInfo",
  data () {
    return {
      jacID: 0,
      jacInfoDB: {},
      tipoOptions: [],
      nivelEducativa: [],
      comunidades: [],
      tipoIdentificacionRepresentante:[],
      step: 1
    }
  },
  created() {
    let categoriasTipoJunta = [CATEGORIAS.TIPO_JUNTA]
    let categoriasNivelEducativa = [CATEGORIAS.NIVEL_INSTITUCION_EDUCATIVA]
    let categoriasTipoIdentificacion = [CATEGORIAS.TIPO_DOCUMENTO_IDENTIDAD]
    this.cargarListaParametroPorCategoriaAction(categoriasTipoJunta).then(data => {
     console.log(data)
      this.tipoOptions = data
    })
    this.cargarListaParametroPorCategoriaAction(categoriasNivelEducativa).then(data => {
      console.log(data)
      this.nivelEducativa = data
    })
    this.cargarListaParametroPorCategoriaAction(categoriasTipoIdentificacion).then(data => {
      console.log(data)
      this.tipoIdentificacionRepresentante = data
    })

    this.jacInfoDB = {
      id: 0,
      tipo: '',
      comunidad: '',
      tipoIdentificacionRepresentanteLegal: '',
      noIdentificacionRepresentanteLegal: '',
      nivelEducativa: '',
      email: '',
      tienePersoneriaJuridica: '',
      noPersoneriaJuridica: '',
      personeriaJuridicaOtorgadaPor: '',
      fechaExpedicionPersoneria: '',
      tieneRut: '',
      noRut: '',
      fechaExpedicionRut: '',
      tieneRuc: '',
      noRuc: '',
      fechaExpedicionRuc: '',
      tieneAutoreconocimiento: '',
      autorecocimientoExpedidoPor: '',
      fechaExpedicionAutoreconocimiento: '',
      fechaNacimiento: '',
      genero: '',
      celular: '',
      direccion: '',
      emailRepresentanteLegal: '',
      noHombres: '',
      noMujeres: '',
      noAfros: '',
      noIndigenas: '',
      noPoblacionDiscapacitada: '',
      noPoblacionEntre14y28: '',
      noHombresJovenes: '',
      noMujeresJovenes: '',
      nit: '',
      nombre: '',
      representanteLegal: '',
      necesidadCapacitacion: '',
      areaInfluencia: '',
      fechaActualizacionJac: ''
    }
    this.jacID = this.$route.params.id

    this.buscarJacInfoAction(this.jacID).then(data => {
      if(data.id > 0){
        //this.step = 5
        this.jacInfoDB = {...data}

      }
    })
  },
  methods: {
    ...mapActions('jacInfo',['buscarJacInfoAction','registrarJacInfoAction']),
    ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
    ...mapActions('comunidad', ['cargarListaComunidadAction']),
    siguiente(){
      this.validarForm()
    },
    anterior(){
      if(this.step < 1){
        this.step = 1
        console.log('No se puede regresar mas')
      }else{
        this.step--
      }
    },
    buscarComunidades(municipioID){
      this.jacInfoDB.comunidad = null
      this.$refs.comunidad.resetValidation()
      if(municipioID != null){
        this.cargarListaComunidadesDelMunicipioAction(municipioID.id).then(data => {
          this.comunidades = data
        })
      }
    },
    onSubmit () {

      this.$refs.otroForm.validate().then(success => {
        if (success) {
          this.guardarInformacionGeneralAction({
            ...this.jacInfoDB,
            encuesta: {
              id: this.encuestaID
            }
          }).then(data => {
            this.$router.push({name: 'c-poblacion', params: {id: this.encuestaID}})
          })
        }else{
          this.$q.notify({
            message: 'Favor completar los campos correctamente',
            color: 'red'
          })
        }
      })
    },
    validarForm(){
      let stepValue = this.step
      switch (stepValue) {
        case 1:
          //validar FormUbicacion
          this.$refs.ubicacionForm.validate().then(success => {
            if (success) {
              this.registrarJacInfoAction({
                ...this.jacInfoDB,
              }).then(data => {
                this.jacInfoDB.id = data
                this.step++
              })
            }else{
              this.$q.notify({
                message: 'Favor completar los campos correctamente',
                color: 'red'
              })
            }
          })
          break;
        case 2:
          console.log(this.jacInfoDB)
          //validar FormLimites
          this.$refs.limitesForm.validate().then(success => {
            if (success) {

              this.registrarJacInfoAction({
                ...this.jacInfoDB,

              }).then(data => {
                this.step++
              })
            }else{
              this.$q.notify({
                message: 'Favor completar los campos correctamente',
                color: 'red'
              })
            }
          })
          break
        case 3:
          console.log(this.jacInfoDB)
          //validar FormLimites
          this.$refs.otroForm.validate().then(success => {
            if (success) {

              this.registrarJacInfoAction({
                ...this.jacInfoDB,

              }).then(data => {
                this.step++
              })
            }else{
              this.$q.notify({
                message: 'Favor completar los campos correctamente',
                color: 'red'
              })
            }
          })
          break
        default:
          this.step++
          break;
      }
    },

  },
  computed: {
    ...mapGetters('jacInfo', ['getJacInfoState']),

  }
}
</script>

<style scoped>

</style>
