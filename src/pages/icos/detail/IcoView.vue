<template>
<div>
    <div class="text-h6 page-title-box" > Seguimiento organizaci&oacute;n</div>
    <div class="q-ma-md">
        <div class="text-right logo">
            <img width="164px" src="/icons/logo.png" />
        </div>
        <q-markup-table dense flat bordered square class="q-mb-sm">
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

        <q-card class="q-mb-sm">
            <q-card-section>
                <ico-radar :title="tituloGrafico"></ico-radar>
            </q-card-section>
        </q-card>

        <q-card
            flat
            bordered
            class="my-card q-mb-sm"
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
                        <q-item-section>
                            <q-item-label>{{ indicador.indicador.descripcion }}</q-item-label>
                            <q-item-label caption>R//: {{ indicador.descripcionCalificacion }}</q-item-label>
                        </q-item-section>
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
                    <th rowspan="5">
                        Plan de mejoramiento
                    </th>
                    <th>Valoración</th>
                    <th>Proyección</th>
                    <th>Actividad a realizar</th>
                    <th>Nivel</th>
                    <th>Plazo para logros</th>
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
                    <td>Plan de choque urgente</td>
                    <td>Acompañamiento, definición, asesoría y capacitación</td>
                    <td>Inferior</td>
                    <td>6 meses</td>
                </tr>
                <tr>
                    <td>
                        <q-chip
                            square
                            color="orange"
                            text-color="white"
                            class="full-width"
                        >
                            2
                        </q-chip>
                    </td>
                    <td>Plan de mejora mediano plazo</td>
                    <td>Seguimiento, asesoría, capacitación</td>
                    <td>Medio</td>
                    <td>4 meses</td>
                </tr>
                <tr>
                    <td>
                        <q-chip
                            square
                            color="yellow"
                            text-color="white"
                            class="full-width text-center"
                        >
                            3
                        </q-chip>
                    </td>
                    <td>Plan de mejora mediano plazo</td>
                    <td>Seguimiento</td>
                    <td>Intermedio</td>
                    <td>4 meses</td>
                </tr>
                <tr>
                    <td>
                        <q-chip
                            square
                            color="green"
                            text-color="white"
                            class="full-width text-center"
                        >
                            4
                        </q-chip>
                    </td>
                    <td>Plan mejoramiento continuo, gestion, sostenibilidad </td>
                    <td>Seguimiento, asesoría, gestión, rendición de cuentas</td>
                    <td>Superior</td>
                    <td>2 meses</td>
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
</div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import IcoRadar from 'components/widgets/IcoRadar.vue'
import { log } from 'util';
import print from 'print-js';
export default {
    components: { IcoRadar },
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
            tituloGrafico: ''
        };
    },
    created() {
        this.evaluacionID = this.$route.params.id;
        this.buscarIcoAction(this.evaluacionID).then((data) => {
            this.evaluacion = data;
          this.tituloGrafico = this.evaluacion.id + ' ' + this.evaluacion.jac.nombre + ' - ' + this.evaluacion.descripcion + ' | Cal. ' + this.evaluacion.calificacion
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
                    //console.log("Quien es indicador: ", indicador);
                    if (indicador.indicador.tema.id === tema.id) {
                        //console.log('Indicador que coincide: ', indicador)
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
           // console.log('Temas: ', this.temas)
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
