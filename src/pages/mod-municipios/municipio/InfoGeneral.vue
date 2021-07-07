<template>
  <div class="q-ma-sm">
    <div class="row">
      <div class="col-xs-12 col-sm-8 offset-sm-2">

        <div v-if="step==1">
          <q-form ref="ubicacionForm">
            <p class="text-h6 q-mt-md q-mb-sm">1. Ubicación del Municipio</p>
            <q-card
              flat
              bordered
              class="my-card q-mb-md">
              <q-card-section class="q-pb-none">
                <div class="text-h6 q-mb-none">Departamento *</div>
              </q-card-section>

              <q-card-section>
                <div class="row">
                  <div class="col-xs-12 col-sm-6">
                    <q-select
                      dense
                      use-input
                      v-model="departamento"
                      option-label="nombreDepartamento"
                      option-value="id"
                      @input="buscarMunicipios"
                      @filter="filterFnDepartamento"
                      hint="Ingrese almenos dos caracteres para filtrar departamento"
                      :options="departamentos"
                      lazy-rules
                      :rules="[ val => val != null && val.id > 0 || 'Debe elegir un departamento']" />
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
                      ref="municipio"
                      use-input
                      v-model="infoGeneral.municipio"
                      option-label="nombreMunicipio"
                      option-value="id"
                      hint="Ingrese almenos dos caracteres para filtrar municipios"
                      :options="municipios"
                      @filter="filterFnMunicipio"
                      lazy-rules
                      :rules="[ val => val != null && val.id > 0 || 'Debe elegir un municipio']" />
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
                    <q-input
                      dense
                      v-model="infoGeneral.region"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']" />
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
                    <!-- <q-input dense v-model="infoGeneral.extension" /> -->
                    <q-field
                    v-model="infoGeneral.extension"
                    lazy-rules
                      :rules="[val => val > 0 || 'Campo requerido']"
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
        </div>

        <div v-if="step==2">
          <q-form ref="limitesForm">
            <p class="text-h6 q-mt-md q-mb-sm">Límites Geográficos</p>
              <q-card
                flat
                bordered
                class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Límite Norte</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input
                        dense
                        v-model="infoGeneral.limiteNorte"
                        lazy-rules
                      :rules="[val => !!val || 'Campo requerido']" />
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
                      <q-input dense v-model="infoGeneral.limiteSur"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']" />
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
                      <q-input dense v-model="infoGeneral.limiteOriente"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']" />
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
                      <q-input dense v-model="infoGeneral.limiteOccidente"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']" />
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
                      <q-input hint="No. de veredas" dense v-model="infoGeneral.composicion"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"/>
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
                      <!-- <q-input dense v-model="infoGeneral.altitud"/> -->
                      <q-field
                      v-model="infoGeneral.altitud"
                      hint="#,###"
                      >
                      <template v-slot:control="{ id, floatingLabel, value, emitValue }">
                          <money :id="id" class="q-field__input" :value="value" @input="emitValue" v-bind="altitudFormat" v-show="floatingLabel" />
                      </template>
                      </q-field>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Gentilicio</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input dense v-model="infoGeneral.gentilicio"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Fecha de fundación </div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input
                        type="date"
                        dense
                        v-model="infoGeneral.fechaFundacion"
                        lazy-rules
                      :rules="[val => !!val || 'Campo requerido']" />
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Categoría </div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input
                        dense
                        v-model="infoGeneral.categoria"
                        lazy-rules
                      :rules="[val => !!val || 'Campo requerido']" />
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
                      <q-input type="textarea" dense v-model="infoGeneral.emblema"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"/>
                    </div>
                  </div>
                </q-card-section>
              </q-card>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Personajes representativos</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input type="textarea" dense v-model="infoGeneral.personajeRepresentativo"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"/>
                    </div>
                  </div>
                </q-card-section>
              </q-card>
          </q-form>

        </div>

        <div v-if="step == 4">
          <q-form ref="demografiaForm">
            <p class="text-h6 q-mt-md q-mb-sm">2. Demografía</p>

              <q-card flat bordered class="my-card q-mb-md">
                <q-card-section class="q-pb-none">
                  <div class="text-h6 q-mb-none">Población urbana </div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <!-- <q-input
                        dense
                        type="number"
                        v-model.number="infoGeneral.poblacionUrbana"
                        lazy-rules
                        :rules="[
                          val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero ',
                          val => val > 0 || 'El valor ingresado debe ser mayor a cero '
                        ]" /> -->

                        <q-field
                        v-model="infoGeneral.poblacionUrbana"
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
                  <div class="text-h6 q-mb-none">Población rural </div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <!-- <q-input
                        dense
                        type="number"
                        v-model.number="infoGeneral.poblacionRural"
                        lazy-rules
                        :rules="[
                          val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero ',
                          val => val > 0 || 'El valor ingresado debe ser mayor a cero '
                        ]" /> -->
                        <q-field
                        v-model="infoGeneral.poblacionRural"
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
                  <div class="text-h6 q-mb-none">No. Hombres</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <!-- <q-input
                        dense
                        type="number"
                        v-model.number="infoGeneral.noHombres"
                        lazy-rules
                        :rules="[
                          val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero ',
                          val => val > 0 || 'El valor ingresado debe ser mayor a cero '
                        ]" /> -->
                        <q-field
                        v-model="infoGeneral.noHombres"
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
                  <div class="text-h6 q-mb-none">No. Mujeres</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <!-- <q-input
                        dense
                        type="number"
                        v-model.number="infoGeneral.noMujeres"
                        lazy-rules
                        :rules="[
                          val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero ',
                          val => val > 0 || 'El valor ingresado debe ser mayor a cero '
                        ]"/> -->
                        <q-field v-model="infoGeneral.noMujeres" hint="#,###">
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
                  <div class="text-h6 q-mb-none">No. Indígenas</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <!-- <q-input
                        dense
                        type="number"
                        v-model.number="infoGeneral.noIndigenas"
                        lazy-rules
                        :rules="[
                          val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero ',
                          val => val > 0 || 'El valor ingresado debe ser mayor a cero '
                        ]" /> -->
                        <q-field
                        v-model="infoGeneral.noIndigenas"
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
                  <div class="text-h6 q-mb-none">No. Afro</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <!-- <q-input
                        dense
                        type="number"
                        v-model.number="infoGeneral.noAfro"
                         lazy-rules
                        :rules="[
                          val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero ',
                          val => val > 0 || 'El valor ingresado debe ser mayor a cero '
                        ]"/> -->
                        <q-field
                        v-model="infoGeneral.noAfro"
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
                  <div class="text-h6 q-mb-none">Tasa de Fecundidad</div>
                </q-card-section>

                <q-card-section>
                  <div class="row">
                    <div class="col-xs-12 col-sm-6">
                      <q-input dense v-model="infoGeneral.tasaFecundidad"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']"/>
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
                      <q-input dense v-model="infoGeneral.tasaNatalidad"
                      lazy-rules
                      :rules="[val => !!val || 'Campo requerido']" />
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
                      <!-- <q-input
                        dense
                        v-model.number="infoGeneral.densidad"
                        type="number"
                         lazy-rules
                        :rules="[
                          val => Number.isInteger(val) || 'El valor ingresado debe ser un número entero ',
                          val => val > 0 || 'El valor ingresado debe ser mayor a cero '
                        ]"/> -->
                        <q-field
                        v-model="infoGeneral.densidad"
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
            <q-btn
              v-else
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
      departamentos: [],
      departamentosList: [],
      municipios: [],
      municipiosList: [],
      departamento: '',
      step: 1,
      numero: {
          decimal: '.',
          thousands: ',',
          precision: 0,
          masked: false /* doesn't work with directive */
      },
      altitudFormat: {
          decimal: '.',
          thousands: ',',
          suffix: ' MSNM',
          precision: 0,
          masked: false /* doesn't work with directive */
      },
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
      this.departamentosList = data
      this.departamentos = this.departamentosList
    })
    this.buscarInformacionGeneralAction(this.encuestaID).then(data => {
      if(data.id > 0){
        //this.step = 5
        this.infoGeneral = {...data}
        if(data.municipio != null){
          this.departamento = data.municipio.departamento
        }
      }
    })
  },
  methods: {
    ...mapActions('informacionGeneral',['buscarInformacionGeneralAction','guardarInformacionGeneralAction']),
    ...mapActions('departamento', ['cargarListaDepartamentoAction', 'cargarListaMunicipiosDelDepartamentoAction']),
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
    buscarMunicipios(departamentoID){
      this.infoGeneral.municipio = null
      this.$refs.municipio.resetValidation()
      if(departamentoID != null){
        this.cargarListaMunicipiosDelDepartamentoAction(departamentoID.id).then(data => {
          this.municipiosList = data
          this.municipios = this.municipiosList
        })
      }
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
              this.guardarInformacionGeneralAction({
                ...this.infoGeneral,
                encuesta: {
                  id: this.encuestaID
                }
              }).then(data => {
                this.infoGeneral.id = data
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
          //validar FormLimites
          this.$refs.limitesForm.validate().then(success => {
            if (success) {
              this.guardarInformacionGeneralAction({
                  ...this.infoGeneral,
                  encuesta: {
                    id: this.encuestaID
                  }
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
          //validar FormLimites
          this.$refs.otroForm.validate().then(success => {
            if (success) {
              this.guardarInformacionGeneralAction({
                  ...this.infoGeneral,
                  encuesta: {
                    id: this.encuestaID
                  }
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
        case 4:
          //validar FormLimites
          this.$refs.demografiaForm.validate().then(success => {
            if (success) {
              this.guardarInformacionGeneralAction({
                  ...this.infoGeneral,
                  encuesta: {
                    id: this.encuestaID
                  }
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
    filterFnDepartamento (val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.departamentos = this.departamentosList.filter(v => v.nombreDepartamento.toLowerCase().indexOf(needle) > -1)
      })
    },
    filterFnMunicipio (val, update, abort) {
      if (val.length < 2) {
        abort()
        return
      }

      update(() => {
        const needle = val.toLowerCase()
        this.municipios = this.municipiosList.filter(v => v.nombreMunicipio.toLowerCase().indexOf(needle) > -1)
      })
    },

  },
  computed: {
    ...mapGetters('informacionGeneral', ['getInformacionGeneralState']),

  }
}
</script>

<style>

</style>
