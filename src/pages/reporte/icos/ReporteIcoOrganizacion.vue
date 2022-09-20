<template>
    <div class="q-ma-sm">
        <div class="row">
            <div class="col-xs-12 col-sm-10 offset-sm-1">
                <div>
                    <div class="flex justify-between">
                        <p class="q-mt-md q-mb-sm">
                            Ficha municipal
                        </p>
                        <div>
                            <q-btn-dropdown
                                split
                                color="dark"
                                rounded
                                label="Caucasia"
                            >
                                <q-list>
                                    <!-- <q-item clickable v-close-popup>
                                        <q-item-section>
                                            <q-item-label
                                                >Remedios</q-item-label
                                            >
                                        </q-item-section>
                                    </q-item> -->

                                    <!-- <q-item clickable v-close-popup>
                                        <q-item-section>
                                            <q-item-label>Coveñas</q-item-label>
                                        </q-item-section>
                                    </q-item>

                                    <q-item clickable v-close-popup>
                                        <q-item-section>
                                            <q-item-label
                                                >Miraflores</q-item-label
                                            >
                                        </q-item-section>
                                    </q-item> -->
                                </q-list>
                            </q-btn-dropdown>
                        </div>
                    </div>
                    <q-card flat bordered class="my-card q-mb-md">
                        <q-card-section class="q-pb-none">
                            <q-banner
                                inline-actions
                            >
                                Caracter&iacute;sticas generales.
                            </q-banner>
                        </q-card-section>
                    </q-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import { URL_API } from '../../../utils/config';
// import BarChart from 'components/charts/BarChart.vue';
// import BarChartEducacionMunicipio from 'components/charts/BarChartEducacionMunicipio.vue';
export default {
    name: 'PageReporteViviendaEncuestador',
    // components: { BarChart, BarChartEducacionMunicipio },

    data() {
        return {
            filtrosDTO: {},
            encuestadores: [],
            encuestadorList: [],
            encuestasCerradas: true,
            loading: false,
            info: {},
        };
    },

    created() {
        console.log('Parent 1: ', this.chartdata);
        this.reporteFichaMunicipioAction(37).then((data) => {
            this.info = data;
        });
    },
    methods: {
        ...mapActions('reporteFichaMunicipio', ['reporteFichaMunicipioAction']),
    },
    computed: {
        ...mapGetters('reporteFichaMunicipio', ['getChartdataState']),
        // ...mapGetters('encuesta', ['getEncuestaState']),
        // encuesta() {
        //     return this.getEncuestaState.objEncuesta;
        // },
    },
};
</script>
