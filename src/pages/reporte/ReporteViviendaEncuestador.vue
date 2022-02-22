<template>
    <div class="q-ma-sm">
        <div class="row">
            <div class="col-xs-12 col-sm-6 offset-sm-3">
                <div>
                    <q-form ref="ubicacionForm">
                        <p class="text-h6 q-mt-md q-mb-sm">
                            Filtrar viviendas por encuestador
                        </p>
                        <q-card flat bordered class="my-card q-mb-md">
                            <q-card-section class="q-pb-none">
                                <div class="text-h6 q-mb-none">
                                    Seleccione un encuestador *
                                </div>
                            </q-card-section>

                            <q-card-section>
                                <div class="row">
                                    <div class="col-xs-12">
                                        <q-select
                                            dense
                                            use-input
                                            v-model="filtrosDTO.cuenta"
                                            option-label="username"
                                            option-value="username"
                                            @filter="filterFnUser"
                                            :options="encuestadores"
                                            lazy-rules
                                            :rules="[
                                                (val) =>
                                                    val != null ||
                                                    'Debe elegir un usuario',
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
                                                filtrosDTO.encuestasCerradas
                                            "
                                            label="¿Filtrar solo encuestas cerradas?"
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
            filtrosDTO: {},
            encuestadores: [],
            encuestadorList: [],
            encuestasCerradas: true,
            loading: false,
        };
    },

    created() {
        this.filtrosDTO = {
            cuenta: '',
            encuestasCerradas: true,
        };

        const urlService = 'usuario';

        axios.get(`${URL_API}/${urlService}/`).then((response) => {
            this.encuestadorList = response.data.map((user) => {
                return user.username;
            });
        });
    },

    methods: {
        onSubmit() {
            console.log(this.filtrosDTO.cuenta);
            console.log(this.filtrosDTO.encuestasCerradas);

            this.loading = true;

            const urlService = 'reportes-vivienda';

            axios
                .post(
                    `${URL_API}/${urlService}/por-encuestador`,
                    this.filtrosDTO,
                    { responseType: 'blob' }
                )
                .then(({ data }) => {
                    this.loading = false;
                    const url = window.URL.createObjectURL(data);
                    // console.log('Url: ', url)
                    const a = document.createElement('a');
                    a.setAttribute('style', 'display:none;');
                    document.body.appendChild(a);
                    a.href = url;
                    a.download = 'ViviendasPorEncuestador.pdf';
                    a.click();
                    return url;
                })
                .catch((error) => {
                    console.log('Error: ', error);
                    this.loading = false;
                });
        },

        filterFnUser(val, update) {
            update(() => {
                const needle = val.toLowerCase();
                this.encuestadores = this.encuestadorList.filter(
                    (v) => v.toLowerCase().indexOf(needle) > -1
                );
            });
        },
    },
};
</script>
