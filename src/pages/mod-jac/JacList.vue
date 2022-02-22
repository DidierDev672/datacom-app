<template>
    <div>
        <q-table
            title="Juntas de Acciones Comunales"
            :data="jacInfos"
            :columns="columns"
            row-key="name"
            @row-click="seleccionar"
            :loading="getJacInfoState.loading"
            loading-label="Cargando información, por favor espere"
        >
            <template v-slot:top="props">
                <div class="col-8 q-table__title">
                    Juntas de Acciones Comunales
                </div>

                <q-space />
                <q-btn
                    flat
                    round
                    dense
                    :icon="
                        props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'
                    "
                    @click="props.toggleFullscreen"
                    class="q-ml-md"
                />
            </template>

            <q-td slot="body-cell-acciones" slot-scope="props" :props="props">
                <q-btn flat round icon="edit" />
            </q-td>
        </q-table>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-btn
                fab
                icon="add"
                color="primary"
                :to="{ name: 'nueva-organizacion' }"
            >
                <q-tooltip>
                    Agregar Organización
                </q-tooltip>
            </q-btn>
        </q-page-sticky>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { TIPO_ENCUESTA } from 'src/utils/config';

export default {
    name: 'JacList',
    data() {
        return {
            jacInfos: [],
            columns: [
                {
                    name: 'id',
                    align: 'left',
                    label: '#',
                    field: 'id',
                    sortable: true,
                },
                {
                    name: 'comunidad',
                    align: 'left',
                    label: 'Comunidad',
                    field: (row) => row.comunidad.nombreComunidad,
                    sortable: true,
                },
                { name: 'noRut', align: 'left', label: 'Nit', field: 'noRut' },
                {
                    name: 'representante_legal',
                    align: 'left',
                    label: 'Representante legal',
                    field: 'representanteLegal',
                    sortable: true,
                },
                {
                    name: 'celular',
                    align: 'left',
                    label: 'Celular',
                    field: 'celular',
                },
            ],
        };
    },
    created() {
        this.cargarListaJacInfoAction().then((data) => {
            this.jacInfos = data;
        });
    },
    methods: {
        ...mapActions('jacInfo', ['cargarListaJacInfoAction']),
        seleccionar(evt, row, index) {
            console.log('jacInfo: ', row);
            let jacID = row.id;
            this.$router.push({ name: 'jac-info', params: { id: row.id } });
        },
    },
    computed: {
        ...mapGetters('jacInfo', ['getJacInfoState']),
    },
};
</script>

<style scoped></style>
