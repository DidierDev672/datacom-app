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
                                    <q-item clickable v-close-popup>
                                        <q-item-section>
                                            <q-item-label
                                                >Remedios</q-item-label
                                            >
                                        </q-item-section>
                                    </q-item>

                                    <q-item clickable v-close-popup>
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
                                    </q-item>
                                </q-list>
                            </q-btn-dropdown>
                        </div>
                    </div>
                    <q-card flat bordered class="my-card q-mb-md">
                        <q-card-section class="q-pb-none">
                            <q-banner
                                inline-actions
                                class="text-white bg-accent"
                            >
                                Caracter&iacute;sticas generales.
                            </q-banner>
                        </q-card-section>

                        <q-card-section class="q-pb-none">
                            <div class="row">
                                <div class="col">Alcalde</div>
                                <div class="col">{{ info.alcalde }}</div>
                                <div class="col">Departamento</div>
                                <div class="col">{{ info.departamento }}</div>
                            </div>
                            <div class="row">
                                <div class="col">Categoria</div>
                                <div class="col">{{ info.categoria }}</div>
                                <div class="col">Composici&oacute;n</div>
                                <div class="col">
                                    {{ info.composicion }} veredas
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">Extensión territorial</div>
                                <div class="col">({{ info.extension }})</div>
                                <div class="col">
                                    <p class="q-mb-none">
                                        Poblaci&oacute;n activa
                                    </p>
                                    <small>(15 - 59 años)</small>
                                </div>
                                <div class="col">
                                    {{ info.poblacionActiva }}
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">Total poblaci&oacute;n</div>
                                <div class="col">{{ info.totalPoblacion }}</div>
                                <div class="col">
                                    <p class="q-mb-none">
                                        Poblaci&oacute;n inactiva
                                    </p>
                                    <small>(0-14 y 60 o más años)</small>
                                </div>
                                <div class="col">
                                    {{ info.poblacionInactiva }}
                                </div>
                            </div>
                            <div class="row">
                                <div class="col">Distribuci&oacute;n</div>
                                <div class="col">Urbano</div>
                                <div class="col">Rural</div>
                                <div class="col"></div>
                                <div class="col"></div>
                            </div>
                            <div class="row">
                                <div class="col"></div>
                                <div class="col">
                                    {{ info.poblacionUrbana }}
                                </div>
                                <div class="col">{{ info.poblacionRural }}</div>
                                <div class="col"></div>
                                <div class="col"></div>
                            </div>
                            <div class="row q-col-gutter-sm q-mt-md q-mb-md">
                                <div class="col">
                                    <q-card flat bordered>
                                        <bar-chart municipioID="37"></bar-chart>
                                    </q-card>
                                </div>
                                <div class="col">
                                    <q-markup-table>
                                        <tbody>
                                            <tr>
                                                <td>Tasa de Natalidad</td>
                                                <td>
                                                    {{ info.tasaNatalidad }} %
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Tasa de Fecundidad</td>
                                                <td>
                                                    {{ info.tasaFecundidad }} %
                                                </td>
                                            </tr>
                                        </tbody>
                                    </q-markup-table>
                                </div>
                            </div>
                            <q-markup-table>
                                <tbody>
                                    <tr>
                                        <td class="text-left">
                                            Poblaci&oacute;n Afro
                                        </td>
                                        <td class="text-center">
                                            {{ info.poblacionAfro }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-left">
                                            Poblaci&oacute;n Ind&iacute;gena
                                        </td>
                                        <td class="text-center">
                                            {{ info.poblacionIndigena }}
                                        </td>
                                    </tr>
                                </tbody>
                            </q-markup-table>
                        </q-card-section>

                        <q-card-section class="q-pb-none">
                            <q-banner
                                inline-actions
                                class="text-white bg-accent"
                            >
                                Calidad de Vida.
                            </q-banner>
                        </q-card-section>

                        <q-card-section class="q-pb-none">
                            <div class="row">
                                <div class="col"></div>
                            </div>

                            <q-markup-table>
                                <thead>
                                    <tr>
                                        <th class="text-left">
                                            &Iacute;ndice
                                        </th>
                                        <th class="text-center">Urbano (%)</th>
                                        <th class="text-center">Rural (%)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="text-left">
                                            Indice de pobresa multidimensional
                                        </td>
                                        <td class="text-center">
                                            {{ info.ipmUrbano }}
                                        </td>
                                        <td class="text-center">
                                            {{ info.ipmRural }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-left">
                                            Necesidades básicas insatisfecha
                                        </td>
                                        <td class="text-center">
                                            {{ info.nbiUrbano }}
                                        </td>
                                        <td class="text-center">
                                            {{ info.nbiRural }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="text-left">
                                            Necesidades básicas insatisfecha
                                        </td>
                                        <td class="text-center">
                                            {{ info.pcmUrbano }}
                                        </td>
                                        <td class="text-center">
                                            {{ info.pcmRural }}
                                        </td>
                                    </tr>
                                </tbody>
                            </q-markup-table>
                        </q-card-section>

                        <q-card-section class="q-pb-none">
                            <div class="row q-col-gutter-sm">
                                <div class="col">
                                    <q-banner
                                        inline-actions
                                        class="text-white bg-accent"
                                    >
                                        Educaci&oacute;n.
                                    </q-banner>
                                    <bar-chart-educacion-municipio
                                        municipioID="37"
                                    ></bar-chart-educacion-municipio>
                                    <div class="row">
                                        <div class="col">
                                            Tasa de analfabetismo Urbano
                                        </div>
                                        <div class="col-auto">
                                            {{ info.tasaAnalfabetismoUrbano }}
                                        </div>
                                    </div>
                                    <q-markup-table>
                                        <thead>
                                            <tr>
                                                <th class="text-left">
                                                    Pruebas saber 11
                                                </th>
                                                <th>Puntaje</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Matem&aacute;ticas</td>
                                                <td class="text-center">
                                                    {{
                                                        info.pruebaSaberMatematica
                                                    }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Lectura cr&iacute;tica</td>
                                                <td class="text-center">
                                                    {{
                                                        info.pruebaSaberLectura
                                                    }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </q-markup-table>
                                </div>
                                <div class="col">
                                    <q-banner
                                        inline-actions
                                        class="text-white bg-accent"
                                    >
                                        Vivienda.
                                    </q-banner>
                                    <div class="row q-mb-md q-mt-md">
                                        <div class="col">
                                            Viviendas y Hogares
                                        </div>
                                    </div>
                                    <q-markup-table>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Urbano</th>
                                                <th>Rural</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Viviendas</td>
                                                <td class="text-center">
                                                    {{ info.viviendasUrbanas }}
                                                </td>
                                                <td class="text-center">
                                                    {{ info.viviendasRurales }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Hogares</td>
                                                <td class="text-center">
                                                    {{ info.hogaresUrbanos }}
                                                </td>
                                                <td class="text-center">
                                                    {{ info.hogaresRurales }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </q-markup-table>

                                    <div class="row q-mb-md q-mt-md">
                                        <div class="col">
                                            D&eacute;ficit cualitativo y
                                            cu&aacute;ntitativo
                                        </div>
                                    </div>
                                    <q-markup-table>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Cualitativo</th>
                                                <th>Cu&aacute;ntitativo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Deficit</td>
                                                <td class="text-center">
                                                    {{
                                                        info.deficitCualitativo
                                                    }}
                                                </td>
                                                <td class="text-center">
                                                    {{
                                                        info.deficitCuantitativo
                                                    }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </q-markup-table>

                                    <!-- Sección Seguridad -->
                                    <q-banner
                                        inline-actions
                                        class="text-white bg-accent q-mt-md"
                                    >
                                        Seguridad.
                                    </q-banner>
                                    <div class="row q-mt-md">
                                        <div class="col">
                                            Tasa de homicidios
                                        </div>
                                        <div class="col-auto">
                                            {{ info.tasaHomicidios }}
                                        </div>
                                    </div>
                                    <!-- Fin sección Seguridad -->
                                </div>
                            </div>
                        </q-card-section>

                        <!-- Secretarias -->
                        <q-card-section class="q-pb-none">
                            <div class="row q-col-gutter-sm">
                                <div class="col">
                                    <q-banner
                                        inline-actions
                                        class="text-white bg-accent"
                                    >
                                        Entidades municipales
                                    </q-banner>
                                    <q-markup-table wrap-cells>
                                        <thead>
                                            <tr>
                                                <th class="text-left">
                                                    Secretar&iacute;as
                                                </th>
                                                <th>Contacto</th>
                                                <th>Tel&eacute;fono</th>
                                                <th>Email</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-for="secretaria in info.secretarias"
                                                :key="secretaria.id"
                                            >
                                                <td>
                                                    {{
                                                        secretaria.idGabinete
                                                            .nombre
                                                    }}
                                                </td>
                                                <td class="text-left">
                                                    {{
                                                        secretaria.nombreContacto
                                                    }}
                                                </td>
                                                <td class="text-left">
                                                    {{ secretaria.telefono }}
                                                </td>
                                                <td class="text-left">
                                                    {{ secretaria.correo }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </q-markup-table>
                                </div>
                            </div>
                        </q-card-section>
                        <!-- Fin secretarias -->

                        <!-- Información economica -->
                        <q-card-section class="q-pb-none">
                            <div class="row q-col-gutter-sm">
                                <div class="col">
                                    <q-banner
                                        inline-actions
                                        class="text-white bg-accent"
                                    >
                                        Finanzas del municipio
                                    </q-banner>
                                    <q-markup-table wrap-cells>
                                        <thead>
                                            <tr>
                                                <th>Rubro</th>
                                                <th>Monto</th>
                                                <th>Periodo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-for="finanza in info.finanzas"
                                                :key="finanza.id"
                                            >
                                                <td>
                                                    {{
                                                        finanza
                                                            .tipoIndicadorFinanza
                                                            .nombre
                                                    }}
                                                </td>
                                                <td>
                                                    ${{
                                                        new Intl.NumberFormat().format(
                                                            finanza.valor
                                                        )
                                                    }}
                                                </td>
                                                <td>{{ finanza.periodo }}</td>
                                            </tr>
                                        </tbody>
                                    </q-markup-table>
                                </div>
                                <div class="col">
                                    <q-banner
                                        inline-actions
                                        class="text-white bg-accent"
                                    >
                                        Actividades econ&oacute;mica de
                                        importancia
                                    </q-banner>
                                    <q-markup-table wrap-cells>
                                        <tbody>
                                            <tr
                                                v-for="producto in info.productos"
                                                :key="producto.id"
                                            >
                                                <td>{{ producto.nombre }}</td>
                                            </tr>
                                        </tbody>
                                    </q-markup-table>

                                    <q-banner
                                        inline-actions
                                        class="text-white bg-accent q-mt-md"
                                    >
                                        Indicadores econ&oacute;micos
                                    </q-banner>
                                    <q-markup-table wrap-cells>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    Medidor Desempeño Municipal
                                                </td>
                                                <td>
                                                    {{
                                                        info.indicadores
                                                            .medidorDesempenoMunicipal
                                                    }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    Dependencia de Transferencia
                                                </td>
                                                <td>
                                                    {{
                                                        info.indicadores
                                                            .dependenciaDetransferencia
                                                    }}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    &Iacute;ndice de resultado
                                                </td>
                                                <td>
                                                    {{
                                                        info.indicadores
                                                            .indiceDeResultado
                                                    }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </q-markup-table>
                                </div>
                            </div>
                        </q-card-section>
                        <!-- Fin información economica -->

                        <!-- Secretarias -->
                        <q-card-section class="q-pb-none">
                            <div class="row q-col-gutter-sm">
                                <div class="col">
                                    <q-banner
                                        inline-actions
                                        class="text-white bg-accent"
                                    >
                                        Organizaciones
                                    </q-banner>
                                    <q-markup-table wrap-cells>
                                        <thead>
                                            <tr>
                                                <th class="text-left">
                                                    Nombre
                                                </th>
                                                <th>Contacto</th>
                                                <th>Tel&eacute;fono</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr
                                                v-for="organizacion in info.organizaciones"
                                                :key="organizacion.id"
                                            >
                                                <td>
                                                    {{ organizacion.nombre }}
                                                </td>
                                                <td class="text-left">
                                                    {{ organizacion.contacto }}
                                                </td>
                                                <td class="text-left">
                                                    {{ organizacion.telefono }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </q-markup-table>
                                </div>
                            </div>
                        </q-card-section>
                        <!-- Fin secretarias -->

                        <q-card-section>
                            <div class="row">
                                <div class="col-xs-12">
                                    <!-- <q-select
                                        dense
                                        use-input
                                        placeholder="Seleccione un Municipio"
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
                                    /> -->
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </div>
                <div class="flex justify-center">
                    <!-- <q-btn
                        label="Imprimir ficha"
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
                    </q-btn> -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';
import { URL_API } from '../../../utils/config';
import BarChart from 'components/charts/BarChart.vue';
import BarChartEducacionMunicipio from 'components/charts/BarChartEducacionMunicipio.vue';
export default {
    name: 'PageReporteViviendaEncuestador',
    components: { BarChart, BarChartEducacionMunicipio },

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
