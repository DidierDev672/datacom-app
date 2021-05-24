<template>  
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">        

        <div v-if="step==1">
          <q-form ref="ubicacionForm">          
            <p class="text-h6 q-mt-md q-mb-sm">Ubicación del Municipio</p>
            <q-card
              flat
              bordered
              class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Departamento</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      v-model="departamento"
                      option-label="nombreDepartamento"
                      option-value="id"
                      @input="buscarMunicipios"
                      :options="departamentos" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card
              flat
              bordered
              class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Muncipio *</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      v-model="infoGeneral.municipio"
                      option-label="nombreMunicipio"
                      option-value="id"
                      :options="municipios"
                      lazy-rules
                      :rules="[ val => val.id > 0 || 'Debe seleccionar un municipio']" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card
              flat
              bordered
              class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Región</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="infoGeneral.region" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Extensión en Km</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-input dense v-model="infoGeneral.extension" />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </q-form>
        </div>

        <div v-if="step==2">
          <q-form ref="limitesForm"> 
            <p class="text-h6 q-mt-md q-mb-sm">Límites Geográficos</p>
              <q-card
                flat
                bordered
                class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Límite Norte *</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input
                        dense
                        v-model="infoGeneral.limiteNorte"
                        lazy-rules 
                        :rules="[ val => val.length > 0 || 'Ingrese el límite Norte ']" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Límite Sur</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input dense v-model="infoGeneral.limiteSur" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Límite Oriente</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input dense v-model="infoGeneral.limiteOriente" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Límite Occidente</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input dense v-model="infoGeneral.limiteOccidente" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>
          </q-form>
        </div>

        <div v-if="step == 3">
          <q-form ref="otroForm">  
            <p class="text-h6 q-mt-md q-mb-sm">Otros datos</p>
              <q-card
                flat
                bordered
                class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Composición</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input hint="No. de veredas" dense v-model="infoGeneral.composicion"/>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Altitud</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input dense v-model="infoGeneral.altitud"/>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Gentilicio *</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input dense v-model="infoGeneral.gentilicio" 
                        lazy-rules 
                        :rules="[ val => val.length > 0 || 'Ingrese el Gentilicio ']"/>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Fecha de fundación *</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input
                        type="date"
                        dense
                        v-model="infoGeneral.fechaFundacion"
                        lazy-rules 
                        :rules="[ val => val.length > 0 || 'Ingrese la fecha de Fundación ']" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Categoria *</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input
                        dense
                        v-model="infoGeneral.categoria" 
                        lazy-rules 
                        :rules="[ val => val.length > 0 || 'Ingrese la categoria del municipio ']"/>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Emblema</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input type="textarea" dense v-model="infoGeneral.emblema"/>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Personajes representativo</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input type="textarea" dense v-model="infoGeneral.personajeRepresentativo"/>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
          </q-form>

        </div>

        <div v-if="step == 4">
          <q-form ref="demografiaForm">
            <p class="text-h6 q-mt-md q-mb-sm">Demografía</p>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Población urbana *</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input
                        dense
                        v-model="infoGeneral.poblacionUrbana"
                        lazy-rules 
                        :rules="[ val => val.length > 0 || 'Ingrese la cantidad de población urbana ']" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Población rural *</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input
                        dense
                        v-model="infoGeneral.poblacionRural"
                        lazy-rules 
                        :rules="[ val => val.length > 0 || 'Ingrese la catecantidad de población rural ']" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">No. Hombres</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input dense v-model="infoGeneral.noHombres"/>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">No. Mujeres</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input dense v-model="infoGeneral.noMujeres"/>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">No. Indígenas</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input dense v-model="infoGeneral.noIndigenas"/>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">No. Afro</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input dense v-model="infoGeneral.noAfro"/>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Tasa de Fecundidad</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input dense v-model="infoGeneral.tasaFecundidad"/>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Tasa de Natalidad</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input dense v-model="infoGeneral.tasaNatalidad"/>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Densidad</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input dense v-model="infoGeneral.densidad"/>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
          </q-form>

        </div>

        <div v-if="step == 5">
           <p class="text-h6 q-mt-md q-mb-sm">Resumen</p>
            <q-card
              flat
              bordered
              class="my-card q-mb-md">
              <q-card-section>
                <div v-if="infoGeneral.id > 0" class="text-h6">Los datos registrados en esta sección son los siguientes</div>
                <div v-else class="text-h6">¿Está seguro que los datos suministrados a continuación está correctos?</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12">
                    <p><strong>Departamento: </strong>{{ departamento.codigo }} - {{ departamento.nombreDepartamento }}</p>
                    <p><strong>Municipio: </strong>{{ infoGeneral.municipio.codigoDane }} - {{ infoGeneral.municipio.nombreMunicipio }}</p>
                    <p><strong>Región: </strong>{{ infoGeneral.region}}</p>
                    <p><strong>Extensión: </strong>{{ infoGeneral.extension}}</p>
                    <p><strong>Limite Norte: </strong>{{ infoGeneral.limiteNorte}}</p>
                    <p><strong>Limite Sur: </strong>{{ infoGeneral.limiteSur}}</p>
                    <p><strong>Limite Oriente: </strong>{{ infoGeneral.limiteOriente}}</p>
                    <p><strong>Limite Occidente: </strong>{{ infoGeneral.limiteOccidente}}</p>
                    <p><strong>Composición: </strong>{{ infoGeneral.composicion}}</p>
                    <p><strong>Altitud: </strong>{{ infoGeneral.altitud}}</p>
                    <p><strong>Gentilicio: </strong>{{ infoGeneral.gentilicio}}</p>
                    <p><strong>Fecha de Fundación: </strong>{{ infoGeneral.fechaFundacion}}</p>
                    <p><strong>Categoria: </strong>{{ infoGeneral.categoria}}</p>
                    <p><strong>Emblema: </strong>{{ infoGeneral.emblema}}</p>
                    <p><strong>Personaje Representativo: </strong>{{ infoGeneral.personajeRepresentativo}}</p>
                    <p><strong>Población Urbana: </strong>{{ infoGeneral.poblacionUrbana}}</p>
                    <p><strong>Población Rural: </strong>{{ infoGeneral.poblacionRural}}</p>
                    <p><strong>No. Hombres: </strong>{{ infoGeneral.noHombres}}</p>
                    <p><strong>No. Mujeres: </strong>{{ infoGeneral.noMujeres}}</p>
                    <p><strong>No. Indígenas: </strong>{{ infoGeneral.noIndigenas}}</p>
                    <p><strong>No. Afros: </strong>{{ infoGeneral.noAfro}}</p>
                    <p><strong>Tasa de Fecundidad: </strong>{{ infoGeneral.tasaFecundidad}}</p>
                    <p><strong>Tasa de natalidad: </strong>{{ infoGeneral.tasaNatalidad}}</p>
                    <p><strong>Densidad: </strong>{{ infoGeneral.densidad}}</p>
                  </div>
                </div>
              </q-card-section>
            </q-card>
        </div>

        
        <div class="flex justify-center">
            <q-btn v-if="step > 1" label="Anterior" no-caps color="primary" flat class="q-mr-sm" @click="anterior"/>
            <q-btn v-if="step < 5" label="Siguiente" no-caps color="primary" @click="siguiente"/>
            <q-btn v-else label="Guardar y continuar" no-caps color="primary" @click="onSubmit"/>
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
      departamentos: [],
      municipios: [],
      departamento: '',
      step: 1
    }
  },
  created() {
    this.infoGeneral = {
      id: 0,
      alcalde: '',
      altitud: '',
      categoria: '',
      composicion: '',
      correo: '',
      correoAlcalde: '',
      densidad: '',
      direccionAlcaldia: '',
      emblema: '',
      estado: '',
      extension: '',
      fechaActualizacion: '',
      fechaCreacion: '',
      fechaFundacion: '',
      gentilicio: '',
      horarioDeAtencion: '',
      limiteNorte: '',
      limiteOccidente: '',
      limiteOriente: '',
      limiteSur: '',
      noAfro: '',
      noHombres: '',
      noIndigenas: '',
      noMujeres: '',
      paginaDeFacebook: '',
      paginaWeb: '',
      partidoPolitico: '',
      personajeRepresentativo: '',
      poblacionRural: '',
      poblacionUrbana: '',
      region: '',
      tasaFecundidad: '',
      tasaNatalidad: '',
      telefono: '',
      telefonoAlcalde: '',
      usuarioActualizacion: '',
      usuarioCreacion: '',
      municipio: {
        codigoDane: '',
        nombreMunicipio: '',
        departamento: {
          codigo: '',
          nombreDepartamento: ''
        }
      }
    }
    this.encuestaID = this.$route.params.id
    this.cargarListaDepartamentoAction().then(data => {
      this.departamentos = data
    })
    this.buscarInformacionGeneralAction(this.encuestaID).then(data => {
      if(data.id > 0){
        this.step = 5
        this.infoGeneral = data
      }
    })
  },
  methods: {
    ...mapActions('informacionGeneral',['buscarInformacionGeneralAction','guardarInformacionGeneralAction']),
    ...mapActions('departamento', ['cargarListaDepartamentoAction', 'cargarListaMunicipiosDelDepartamentoAction']),
    siguiente(){
      console.log(this.step);
      this.validarForm()
      // if(this.step >= 5){
      //   this.step = 5
      //   console.log('Ha llegado al final')
      // }else{
      //   this.step++
      // }
    },
    anterior(){
      if(this.step < 1){
        this.step = 1
        console.log('No se puede regresar mas')
      }else{
        this.step--
      }
    },
    buscarMunicipios(departamentoID){
      this.cargarListaMunicipiosDelDepartamentoAction(departamentoID.id).then(data => {
        this.municipios = data
      })
    },
    onSubmit () {
      this.guardarInformacionGeneralAction({
        ...this.infoGeneral,
        encuesta: {
          id: this.encuestaID
        }
      }).then(data => {
        this.$router.push({name: 'poblacion', params: {id: this.encuestaID}})
      })
    },
    validarForm(){
      let stepValue = this.step
      switch (stepValue) {
        case 1:
          //validar FormUbicacion
          this.$refs.ubicacionForm.validate().then(success => {
            if (success) {
              // yay, models are correct
              this.step++
            }
          })
          break;
        case 2:
          //validar FormLimites
          this.$refs.limitesForm.validate().then(success => {
            if (success) {
              // yay, models are correct
              this.step++
            }
          })
          break
        case 3:
          //validar FormLimites
          this.$refs.otroForm.validate().then(success => {
            if (success) {
              // yay, models are correct
              this.step++
            }
          })
          break
        case 4:
          //validar FormLimites
          this.$refs.demografiaForm.validate().then(success => {
            if (success) {
              // yay, models are correct
              this.step++
            }
          })
          break
      
        default:
          this.step++
          break;
      }
    }
  },
  computed: {
    ...mapGetters('informacionGeneral', ['getInformacionGeneralState']),

  }
}
</script>

<style>

</style>