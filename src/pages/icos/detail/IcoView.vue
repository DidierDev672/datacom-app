<template>
    <div class="q-ma-sm">
        <div class="text-right logo">
            <img width="164px" src="/icons/logo.png" />
        </div>
        <div class="text-h6 text-center q-px-xs q-py-md " v-if="evaluacion.jac">
            Seguimiento organizaci&oacute;n
        </div>
        <q-markup-table dense>
            <tbody>
                <tr>
                    <td>Junta de acci&oacute;n comunal</td>
                    <td>{{ evaluacion.jac.nombre }}</td>
                </tr>
                <tr>
                    <td>Nit</td>
                    <td>{{ evaluacion.jac.noRut }}</td>
                </tr>
                <tr>
                    <td>Representante Legal</td>
                    <td>{{ evaluacion.jac.representanteLegal }}</td>
                </tr>
                <tr>
                    <td>Valoración Junta de Acción comunal</td>
                    <td>{{ evaluacion.calificacion }}</td>
                </tr>
            </tbody>
        </q-markup-table>

        <q-card
            flat
            bordered
            class="my-card bg-grey-1 q-mb-sm"
            v-for="tema in temas"
            :key="tema.id"
        >
            <q-card-section class="q-pb-none">
                <div class="row items-center no-wrap">
                    <div class="col">
                        <div class="text-h6">{{ tema.tema }}</div>
                    </div>
                    <div class="col-auto">
                        <q-btn
                            color="grey-7"
                            class="print-grey-7"
                            round
                            :label="tema.calificacionTotal.toFixed(2)"
                        >
                        </q-btn>
                    </div>
                </div>
            </q-card-section>

            <q-card-section
                class="q-pt-none"
                v-if="tema.indicadores.length > 0"
            >
                <q-list>
                    <q-item
                        clickable
                        v-ripple
                        v-for="indicador in tema.indicadores"
                        :key="indicador.id"
                    >
                        <q-item-section>{{
                            indicador.indicador.descripcion
                        }}</q-item-section>
                        <q-item-section avatar>
                            <q-item-label>{{
                                indicador.calificacion
                            }}</q-item-label>
                            <!-- <q-badge color="primary" :label="indicador.calificacion" /> -->
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-card-section>
        </q-card>
        <q-markup-table wrap-cells dense flat bordered square>
            <tbody>
                <tr>
                    <th rowspan="4">
                        Plan de mejoramiento
                    </th>
                    <th>Valoración</th>
                    <th>Proyección</th>
                    <th>Actividad a realizar</th>
                    <th>Plazo</th>
                </tr>
                <tr>
                    <td>
                        <q-chip
                            square
                            color="red"
                            text-color="white"
                            class="full-width"
                        >
                            1
                        </q-chip>
                    </td>
                    <td>Plan de choque</td>
                    <td>Acompañamiento, Asesoría y capacitación</td>
                    <td>Corto</td>
                </tr>
                <tr>
                    <td>
                        <q-chip
                            square
                            color="orange"
                            text-color="white"
                            class="full-width"
                        >
                            Entre 2 y 2,99
                        </q-chip>
                    </td>
                    <td>Fortalecimiento</td>
                    <td>Asesoría y Sistematización</td>
                    <td>Mediano</td>
                </tr>
                <tr>
                    <td>
                        <q-chip
                            square
                            color="green"
                            text-color="white"
                            class="full-width text-center"
                        >
                            3
                        </q-chip>
                    </td>
                    <td>Mejoramiento contínuo</td>
                    <td>Seguimiento</td>
                    <td>Largo</td>
                </tr>
            </tbody>
        </q-markup-table>

        <q-page-sticky
            class="botones"
            position="bottom-right"
            :offset="[18, 18]"
        >
            <q-fab
                vertical-actions-align="right"
                color="primary"
                glossy
                icon="keyboard_arrow_up"
                direction="up"
            >
                <q-fab-action
                    label-position="left"
                    color="primary"
                    @click="imprimir"
                    icon="print"
                    label="Imprimir"
                />
            </q-fab>
        </q-page-sticky>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { log } from 'util';
import print from 'print-js';
export default {
    data() {
        return {
            evaluacionID: 0,
            evaluacion: [],
            areas: [],
            indicadores: [],
            countTemas: 0,
            calificacionTema: 0,
            tema: '',
            temas: [],
            registro: null,
            temasArray: [],
        };
    },
    created() {
        this.evaluacionID = this.$route.params.id;
        this.buscarIcoAction(this.evaluacionID).then((data) => {
            this.evaluacion = data;
            console.log('data: ', data);
            this.registro = data.indicadores['0'];

            this.tema = this.registro.indicador.tema;
            this.temasArray.push(this.tema);
            data.indicadores.forEach((indicador) => {
                // this.temasArray.push(this.tema);
                if (indicador.indicador.tema.id !== this.tema.id) {
                    this.temasArray.push(indicador.indicador.tema);
                    this.tema = indicador.indicador.tema;
                }
            });

            this.temasArray.forEach((tema) => {
                this.countTemas = 0;
                this.calificacionTema = 0;
                this.indicadores = data.indicadores.filter((indicador) => {
                    // console.log("Quien es indicador: ", indicador);
                    if (indicador.indicador.tema.id === tema.id) {
                        return { indi: indicador.id };
                    }
                });
                this.calificacionTema = 0;
                this.indicadores.forEach((ind) => {
                    this.calificacionTema += ind.calificacion;
                });

                this.temas.push({
                    tema: tema.descripcion,
                    indicadores: this.indicadores,
                    noIndicadores: this.indicadores.length,
                    calificacionTotal:
                        this.calificacionTema / this.indicadores.length,
                });
            });
        });
    },
    methods: {
        ...mapActions('ico', ['buscarIcoAction']),
        imprimir() {
            // print('imprimir', 'html')
            window.print();
        },
    },
    computed: {
        ...mapGetters('ico', ['getIcoState']),
    },
};
</script>

<style lang="sass">

@media screen
  .logo
    display: none

@media print
  .logo
    display: block
    text-align: right !important

  .botones
    display: none !important

  .q-item__label--caption
    font-family: Arial, monospace
    color: rgba(0, 0, 0, 0.85)

  .print-grey-7
    background: #757575 !important
</style>
