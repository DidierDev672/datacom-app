<template>
    <q-page>
        <div class="row">
            <div class="col-xs-12 col-sm-6 offset-sm-3">
                <div class="text-h6 q-px-xs q-py-md ">Reportes</div>
                <q-list bordered>
                    <q-item
                        clickable
                        :to="{ name: 'ReporteViviendaEncuestador' }"
                        v-ripple
                        class="q-py-md"
                    >
                        <q-item-section avatar>
                            <q-icon name="ti-home" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Viviendas</q-item-label>
                            <q-item-label caption
                                >filtradas por encuestador.</q-item-label
                            >
                        </q-item-section>
                        <q-item-section avatar>
                            <q-icon color="grey-6" name="ti-angle-right" />
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <q-item
                        clickable
                        :to="{ name: 'ReporteViviendaConsolidado' }"
                        v-ripple
                        class="q-py-md"
                    >
                        <q-item-section avatar>
                            <q-icon name="ti-home" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Viviendas</q-item-label>
                            <q-item-label caption
                                >Consolidadas por comunidad.</q-item-label
                            >
                        </q-item-section>
                        <q-item-section avatar>
                            <q-icon color="grey-6" name="ti-angle-right" />
                        </q-item-section>
                    </q-item>

                    <q-separator />

                    <!-- <q-item clickable v-ripple class="q-py-md">
                        <q-item-section avatar>
                            <q-icon name="ti-home" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Viviendas</q-item-label>
                            <q-item-label caption
                                >filtradas por municipio</q-item-label
                            >
                        </q-item-section>
                        <q-item-section avatar>
                            <q-icon color="grey-6" name="ti-angle-right" />
                        </q-item-section>
                    </q-item> -->

                    <q-separator />

                    <!-- <q-item clickable v-ripple class="q-py-md">
                        <q-item-section avatar>
                            <q-icon name="ti-home" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Viviendas</q-item-label>
                            <q-item-label caption
                                >Consolidadas por comunidad</q-item-label
                            >
                        </q-item-section>
                        <q-item-section avatar>
                            <q-icon color="grey-6" name="ti-angle-right" />
                        </q-item-section>
                    </q-item> -->

                    <q-item
                        clickable
                        :to="{ name: 'ReporteMunicipioFicha' }"
                        v-ripple
                        class="q-py-md"
                    >
                        <q-item-section avatar>
                            <q-icon name="ti-world" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Municipios</q-item-label>
                            <q-item-label caption>Ficha municipal</q-item-label>
                        </q-item-section>
                        <q-item-section avatar>
                            <q-icon color="grey-6" name="ti-angle-right" />
                        </q-item-section>
                    </q-item>

                    <!-- <q-item clickable v-ripple class="q-py-md">
                        <q-item-section avatar>
                            <q-icon name="ti-world" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label>Municipios</q-item-label>
                            <q-item-label caption
                                >Consolidado municipal</q-item-label
                            >
                        </q-item-section>
                        <q-item-section avatar>
                            <q-icon color="grey-6" name="ti-angle-right" />
                        </q-item-section>
                    </q-item> -->

                    <q-separator />
                </q-list>
            </div>
        </div>
    </q-page>
</template>

<script>
export default {
    name: 'PageMenuReportes',
};
</script>
