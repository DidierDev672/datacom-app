<template>
    <div>
        <q-table
            title="Comités de Trabajo"
            :data="getOrganosRepresentacion"
            :columns="columns"
            row-key="name"
            @row-click="seleccionar"
            :loading="getJuntaDirectivaState.loading"
            loading-label="Cargando información, por favor espere"
        >
            <template v-slot:top="props">
                <div class="col-8 q-table__title">Órganos de representación</div>

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
                @click="showJuntaDirectivaForm = true"
            >
                <q-tooltip>
                    Agregar nuevo registro
                </q-tooltip>
            </q-btn>
        </q-page-sticky>

        <organo-representacion-form
            v-if="showJuntaDirectivaForm"
            @close="closeModal"
        ></organo-representacion-form>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import OrganoRepresentacionForm from 'components/mod-jac/organos-representacion/OrganoRepresentacionForm.vue';
import { NIVEL_GERENCIAL } from 'src/utils/config';
export default {
    name: 'JuntaDirectiva',
    components: { OrganoRepresentacionForm },
    data() {
        return {
            jacID: 0,
            showJuntaDirectivaForm: false,
            columns: [
                {
                    name: 'cargo',
                    align: 'left',
                    label: 'Comité',
                    field: (row) => row.cargo.nombre,
                    sortable: true,
                },
                {
                    name: 'nombre',
                    align: 'left',
                    label: 'Nombre completo',
                    field: (row) => row.nombre + ' ' + row.primerApellido,
                    sortable: true,
                },
                {
                    name: 'noDocumentoIdentificacion',
                    align: 'left',
                    label: 'Doc. Identificación',
                    field: 'noDocumentoIdentificacion',
                },
                {
                    name: 'celular',
                    align: 'left',
                    label: 'Celular',
                    field: 'celular',
                },
                {
                    name: 'email',
                    align: 'left',
                    label: 'Email',
                    field: 'email',
                },
                { name: 'acciones', label: '', field: 'acciones' },
            ],
        };
    },
    created() {
        this.jacID = this.$route.params.id;

        if (this.jacID > 0) {
            this.cargarListaJuntaDirectivaAction(this.jacID);
        }
    },
    methods: {
        ...mapActions('juntaDirectiva', ['cargarListaJuntaDirectivaAction']),
        ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
        ...mapMutations('juntaDirectiva', ['setJuntaDirectivaSuccess']),
        closeModal() {
            this.showJuntaDirectivaForm = false;
        },
        seleccionar(evt, row, index) {
            this.setJuntaDirectivaSuccess(row);
            this.showJuntaDirectivaForm = true;
        },
        onSubmit() {
            this.$router.push({ name: 'c-salud', params: { id: this.jacID } });
        },
    },
    computed: {
        ...mapGetters('juntaDirectiva', [
            'getJuntaDirectivaState',
            'getComites',
            'getOrganosRepresentacion'
        ]),
        showBtnContinuar() {
            return this.getJuntaDirectivaState.lista.length > 0 ? true : false;
        },
    },
};
</script>

<style scoped></style>
