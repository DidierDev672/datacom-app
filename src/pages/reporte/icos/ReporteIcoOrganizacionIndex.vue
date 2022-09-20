<template>
    <div class="q-ma-sm">
        <div class="row">
            <div class="col-xs-12 col-sm-8 col-md-6 offset-sm-3">
                <div v-if="icos.length <= 0">
                    <q-form ref="ubicacionForm">
                        <p class="text-h6 q-mt-md q-mb-sm">
                            Filtrar Icos por organización
                        </p>
                        <q-card flat bordered class="my-card q-mb-md">
                            <q-card-section class="q-pb-none">
                                <div class="text-h6 q-mb-none">
                                    Exportar ICOS de una organización
                                </div>
                            </q-card-section>

                            <q-card-section>
                                <div class="row">
                                    <div class="col-xs-12">
                                        <q-select
                                          use-input
                                          v-model="filtrosDTO.organizacion"
                                          option-label="jac"
                                          option-value="id"
                                          hint="Seleccione la organización"
                                          :options="jacs"
                                          @filter="filtrarJac"
                                          lazy-rules
                                          :rules="[
                                            val =>
                                              (val != null && val.id > 0) ||
                                              'Debe elegir una organizacion'
                                          ]"
                                        />
                                    </div>
                                </div>
                            </q-card-section>

                            <q-card-section>
                                <div class="row">
                                    <div class="col-xs-12">
                                        <q-toggle
                                            v-model="
                                                filtrosDTO.icoReciente
                                            "
                                            label="¿Filtrar ico más reciente?"
                                        />
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </q-form>
                </div>
                <div v-if="icos.length <= 0" class="flex justify-center">
                    <q-btn
                        label="Filtrar"
                        class="full-width"
                        no-caps
                        color="primary"
                        :disable="loading"
                        :loading="loading"
                        @click="onSubmit"
                    >
                        <template v-slot:loading>
                            <q-spinner-facebook />
                        </template>
                    </q-btn>
                </div>
                <div v-if="icos.length > 0">
                  <q-card flat bordered class="my-card q-mb-md">
                    <q-card-section class="q-pb-none">
                        <div class="text-h6 q-mb-none">
                            Resultados: {{ filtrosDTO.organizacion.jac}}
                        </div>
                    </q-card-section>
                    <q-card-section>
                      <apexcharts width="500" type="bar" :options="options" :series="series"></apexcharts>
                      <div class="q-pa-md">
                        <q-table
                          title="Icos"
                          flat
                          :data="icos"
                          :columns="columns"
                          row-key="name"
                        />
                      </div>
                      <q-btn flat color="primary" @click="resetIcos()">Regresar</q-btn>
                    </q-card-section>
                  </q-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import axios from 'axios';
import { URL_API } from '../../../utils/config';
import VueApexCharts from 'vue-apexcharts'
export default {
    name: 'PageReporteViviendaEncuestador',
    components: {apexcharts: VueApexCharts},
    data() {
        return {
            filtrosDTO: {},
            jacs: [],
            icos: [],
            loading: false,
            options: {
              colors:['#64c2c8'],
              chart: {
                id: 'vuechart-example'
              },
              xaxis: {
                categories: []
              }
            },
            series: [{
              name: 'series-1',
              data: []
            }],
            columns: [
              { name: 'evaluacion', align: 'left', label: 'Evaluacion', field: 'evaluacion', sortable: true },
              { name: 'puntaje', label: 'Puntaje', field: 'puntaje', sortable: true },
              { name: 'encuestador', label: 'Encuestador', field: 'encuestador', sortable: true },
              { name: 'fecha', label: 'Fecha', field: 'fecha' },
            ],
        };
    },

    created() {
      console.log('Icos: ', this.icos.length)
        this.filtrosDTO = {
            organizacion: '',
            icoReciente: false,
        };

        const urlService = 'usuario';

        axios.get(`${URL_API}/${urlService}/`).then((response) => {
            this.encuestadorList = response.data.map((user) => {
                return user.username;
            });
        });
    },

    methods: {
      ...mapActions('jacInfo', ['cargarListaJacInfoAction']),
        onSubmit() {
            console.log(this.filtrosDTO);

            this.loading = true;

            const urlService = 'icos-por-organizacion';

            axios
                .post(
                    `${URL_API}/${urlService}`,
                    {
                      icoReciente: this.filtrosDTO.icoReciente,
                      organizacionId: this.filtrosDTO.organizacion.id
                    }
                )
                .then(({ data }) => {
                    this.loading = false;
                    console.log('Data: ', data);
                    this.icos = data

                    this.options = {
                      chart: {
                        id: 'vuechart-example'
                      },
                      xaxis: {
                        categories: data.map(seguimiento => seguimiento.evaluacion)
                      },
                      yaxis: {
                        title: {
                          text: 'Puntaje obtenido'
                        }
                      }
                    },
                    this.series = [{
                      name: 'Seguimientos Icos',
                      data: data.map(seguimiento => seguimiento.puntaje)
                    }]

                })
                .catch((error) => {
                    console.log('Error: ', error);
                    this.loading = false;
                });
        },

      filtrarJac(val, update, abort) {
      console.log(val)
      if (val.length < 3) {
        abort()
        return
      }

      update(() => {
        const needle = val.toLowerCase();

        this.cargarListaJacInfoAction({
            page: 0,
            rowsPerPage: 50,
            filter: needle
          }).then(response => {

            this.jacs.splice(
              0,
              this.jacs.length,
              ...response.data.content
            );
        });


      });
    },

    resetIcos(){
      this.icos = [];
    }

    },
};
</script>
