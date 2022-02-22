<template>
    <div class="q-ma-sm">
        <div class="text-h6 q-px-xs q-py-md ">Dashboard</div>
        <div class="row q-col-gutter-sm q-mb-md">
            <div
                class="col-xs-12 col-md-3"
                v-for="encuesta in totalEncuestas"
                :key="encuesta.id"
            >
                <q-card flat bordered class="my-card">
                    <q-card-section>
                        <div class="row items-center no-wrap">
                            <div class="col">
                                <div class="text-subtitle2">
                                    {{ encuesta.modulo }}
                                </div>
                                <div class="text-h6">
                                    {{
                                        encuesta.cant == 0
                                            ? '137'
                                            : encuesta.cant
                                    }}
                                </div>
                            </div>
                            <div class="col-auto">
                                <q-icon
                                    :name="encuesta.modulo | moduleIcon"
                                    :class="encuesta.modulo | moduleClass"
                                    style="font-size: 3rem;"
                                />
                            </div>
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        <div class="row q-col-gutter-sm">
            <div class="col-xs-12 col-md-5">
                <encuestas-por-departamentos></encuestas-por-departamentos>
            </div>
            <div class="col-xs-12 col-md-7">
                <ultimas-organizaciones></ultimas-organizaciones>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import UltimasOrganizaciones from 'components/widgets/UltimasOrganizaciones.vue';
import EncuestasPorDepartamentos from 'components/widgets/EncuestasPorDepartamentos.vue';
export default {
    name: 'PageHome',
    components: { UltimasOrganizaciones, EncuestasPorDepartamentos },
    data() {
        return {
            totalEncuestas: [],
            encuestasPorDepartamentos: [],
        };
    },
    created() {
        this.cargarTotalEncuestasPorModulosAction().then((data) => {
            this.totalEncuestas = data;
        });
    },
    methods: {
        ...mapActions('encuesta', [
            'cargarTotalEncuestasPorModulosAction',
            'bajarReporteAction',
        ]),
        bajarreporte() {
            this.bajarReporteAction();
        },
    },
    filters: {
        moduleIcon(value) {
            if (!value) return 'poll';
            switch (value) {
                case 'Vivienda':
                    return 'home';
                    break;
                case 'Municipios':
                    return 'list';
                    break;
                case 'Comunidad':
                    return 'poll';
                    break;
                default:
                    return 'edit';
                    break;
            }
        },
        moduleClass(value) {
            if (!value) return 'tex-primary';
            switch (value) {
                case 'Vivienda':
                    return 'text-positive';
                    break;
                case 'Municipios':
                    return 'text-dark';
                    break;
                case 'Comunidad':
                    return 'text-primary';
                    break;
                default:
                    return 'text-secondary';
                    break;
            }
        },
    },
};
</script>
