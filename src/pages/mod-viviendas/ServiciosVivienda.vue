<template>
<div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">
        <div>
          <q-form ref="estadoViviendaForm">
            <p class="text-h6 q-mt-md">Servicios de la vivienda</p>
            <q-card
              flat
              bordered
              class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">15. ¿Con cuál de los siguientes servicios públicos, privados o comunales cuenta la vivienda?</div>
              </q-card-section>

              <q-card-section>
                <div class="row">

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.servicioEnergia"
                      label="Energía Eléctrica" />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.servicioGas"
                      label="Gas Natural" />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.servicioAcueducto"
                      label="Acueducto" />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.servicioInternet"
                      label="Internet" />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.servicioTelevision"
                      label="Televisión" />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.servicioTelefonia"
                      label="telefonía Móvil" />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.servicioWhatsapp"
                      label="WhatsApp" />
                  </div>

                </div>
              </q-card-section>
            </q-card>

            <q-card v-if="datosVivienda.servicioAcueducto" flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">16. Calidad del Agua</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                        dense
                        v-model="datosVivienda.calidadAgua"
                        :options="calidadAguaOptions"
                        label="Calidad del Agua"
                        emit-value
                        map-options
                        lazy-rules
                        :rules="[ val => val != null && val > 0 || 'Debe elegir una opción']" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card v-if="datosVivienda.servicioAcueducto" flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">17. Frecuencia del servicio de acueducto</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                        dense
                        v-model="datosVivienda.frecuenciaServicioAcueducto"
                        :options="frecuenciaAcueductoOptions"
                        option-label="nombre"
                        label="Frecuencia del servicio de acueducto"
                        lazy-rules
                        :rules="[ val => val != null && val.id > 0 || 'Debe elegir una opción']" />
                  </div>
                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">18. Otras fuentes de captación de agua</div>
              </q-card-section>

              <q-card-section>
                <div class="row">

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.pozoProfundo"
                      label="Pozos Profundos" />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.quebradas"
                      label="Quebradas" />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.rios"
                      label="Ríos" />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.represa"
                      label="Represas" />
                  </div>

                  <div class="col-xs-12 col-sm-6">
                    <q-checkbox
                      v-model="datosVivienda.aguaLluvia"
                      label="Aguas Lluvias" />
                  </div>

                </div>
              </q-card-section>
            </q-card>

            <q-card flat bordered class="my-card q-mb-md">
              <q-card-section>
                <div class="text-h6">19. Capacidad de almacenamiento de agua</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                        dense
                        v-model="datosVivienda.capacidadAlmacenamientoAgua"
                        :options="capacidadAlmacenamientoOptions"
                        option-label="nombre"
                        label="Capacidad de almacenamiento de agua"
                        lazy-rules
                        :rules="[ val => val != null && val.id > 0 || 'Debe elegir una opción']" />
                  </div>
                </div>
              </q-card-section>
            </q-card>



          </q-form>
        </div>
        <div class="flex justify-center">
            <q-btn class="full-width"
              label="Guardar y continuar"
              no-caps
              color="primary"
              :disable="getDatosViviendaState.loading"
              :loading="getDatosViviendaState.loading"
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
import { CATEGORIAS } from "src/utils/config";
export default {
    data() {
        return {
          encuestaID: 0,
          datosVivienda: {},
          frecuenciaAcueductoOptions: [],
          capacidadAlmacenamientoOptions: [],
          calidadAguaOptions: [
            {label: 'Potable', value: 1},
            {label: 'Impotable', value: 2},
          ]
        }
    },
    created(){
      this.encuestaID = this.$route.params.id
      let categorias = [CATEGORIAS.FECUENCIA_SERVICIO_ACUEDUCTO, CATEGORIAS.CAPACIDAD_ALMACENAMIENTO];
      this.datosVivienda = {
        id: 0,
        calidadAgua: '',
        servicioEnergia: false,
        servicioGas: false,
        servicioAcueducto: false,
        servicioInternet: false,
        servicioTelevision: false,
        servicioTelefonia: false,
        servicioWhatsapp: false,
        pozoProfundo: false,
        quebradas: false,
        rios: false,
        represa: false,
        aguaLluvia: false,
        frecuenciaServicioAcueducto: '',
        capacidadAlmacenamientoAgua: ''
      }
      this.cargarListaParametroPorCategoriaAction(categorias).then(data => {
        data.map(opt => {
          let codigoCategoria = opt.categoria.codigo
          switch (codigoCategoria) {
            case 'FREC':
              this.frecuenciaAcueductoOptions.push(opt)
              break;
            case 'CAAL':
              this.capacidadAlmacenamientoOptions.push(opt)
              break;
            default:
              break;
          }
        })
      });

      this.buscarDatosViviendaAction(this.encuestaID).then(data => {
        if(data.id > 0){
          this.datosVivienda = {...data}
        }
      })

    },
    methods: {
      ...mapActions("parametros", ["cargarListaParametroPorCategoriaAction"]),
    ...mapActions("datosVivienda", ["buscarDatosViviendaAction", 'registrarDatosViviendaAction', 'actualizarDatosViviendaAction']),
      onSubmit(){
        console.log(this.datosVivienda);
        let info = {
            ...this.datosVivienda,
            encuesta: {
              id: this.encuestaID
            }
          }
        if(this.datosVivienda.id > 0){
          this.actualizarDatosViviendaAction(info)
        }else{
          this.registrarDatosViviendaAction(info).then(data => {
            this.datosVivienda.id = data
          })
        }
        this.$router.push({name: 'saneamiento-basico', params: {id: this.encuestaID}})
      },
      actualizarModelo(value){
        this.showControl = false
        console.log('Opción seleccionada: ', value);
        value.map(opt => {
          if(opt.id == 127){
            console.log('Se trata de acueducto');
            this.showControl = true
          }
        })
      }
    },
    computed: {
    ...mapGetters('datosVivienda', ['getDatosViviendaState'])
  }

}
</script>

<style>
.q-item__label--header {
  color: #464d69;
  /* font-size: 1.25rem;
  font-weight: 500;
  line-height: 2rem;
  letter-spacing: 0.0125em; */
}

</style>
