<template>
    <div class="q-ma-sm">
        <div class="row">
            <div class="col-xs-12 col-sm-6 offset-sm-3">
                <div>
                    <q-form ref="ubicacionForm">
                        <p class="text-h6 q-mt-md q-mb-sm">
                            Consolidado de viviendas por comunidad
                        </p>
                        <q-card flat bordered class="my-card q-mb-md">
                            <q-card-section class="q-pb-none">
                                <div class="text-h6 q-mb-none">
                                    Seleccione una comunidad *
                                </div>
                            </q-card-section>

                            <q-card-section>
                                <div class="row">
                                    <div class="col-xs-12">
                                        <q-select
                                            dense
                                            use-input
                                            v-model="encuesta"
                                            option-label="comunidad"
                                            option-value="id"
                                            @filter="filterFnUser"
                                            :options="comunidades"
                                            lazy-rules
                                            :rules="[
                                                (val) =>
                                                    val != null ||
                                                    'Debe elegir una Comunidad',
                                            ]"
                                        />
                                    </div>
                                </div>
                            </q-card-section>
                        </q-card>
                    </q-form>
                </div>
                <div class="flex justify-center">
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
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { URL_API } from '../../utils/config';
export default {
    name: 'PageReporteViviendaEncuestador',

    data() {
        return {
            encuesta: {},
            comunidades: [],
            comunidadesList: [],
            encuestasCerradas: true,
            loading: false,
        };
    },

    created() {
        this.encuesta = {
            id: '0',
            comunidad: '',
        };
        const urlService = 'encuesta/comunidades';

        axios.get(`${URL_API}/${urlService}`).then((response) => {
            console.log('Comunidades List: ', response);
            this.comunidadesList = response.data;
            this.encuestas = response.data;
        });
    },

    methods: {
        onSubmit() {
            this.loading = true;

            const urlService = 'por-comunidad';

            axios
                .get(
                    `${URL_API}/reportes-vivienda/${this.encuesta.id}/${urlService}`,
                    {
                        responseType: 'blob',
                    }
                )
                .then(({ data }) => {
                    console.log('Data response: ', data);
                    this.loading = false;
                    const url = window.URL.createObjectURL(data);
                    // console.log('Url: ', url)
                    const a = document.createElement('a');
                    a.setAttribute('style', 'display:none;');
                    document.body.appendChild(a);
                    a.href = url;
                    a.download = 'File.pdf';
                    a.click();
                    return url;
                })
                .catch((error) => {
                    console.log('Error: ', error);
                    this.loading = false;
                });
        },

        filterFnUser(val, update) {
            if (val === '') {
                update(() => {
                    this.comunidades = this.comunidadesList;

                    // with Quasar v1.7.4+
                    // here you have access to "ref" which
                    // is the Vue reference of the QSelect
                });
                return;
            }
            update(() => {
                console.log('Encuesta: ', this.encuesta);
                console.log('Comunidad Filter: ', val);
                const needle = val.toLowerCase();
                this.comunidades = this.comunidadesList.filter(
                    (v) => v.comunidad.toLowerCase().indexOf(needle) > -1
                );
            });
        },
    },
};
</script>
