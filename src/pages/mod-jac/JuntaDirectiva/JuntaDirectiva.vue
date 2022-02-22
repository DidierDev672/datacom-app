<template>
    <div>
        <q-table
            title="Junta Directiva"
            :data="getJuntaDirectiva"
            :columns="columns"
            row-key="name"
            @row-click="seleccionar"
            :loading="getJuntaDirectivaState.loading"
            loading-label="Cargando información, por favor espere"
        >
            <template v-slot:top="props">
                <div class="col-8 q-table__title">4. Junta Directiva</div>

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
        <!-- <junta-directiva-card
          v-for="juntaDirectiva in getJuntaDirectivaState.lista"
          class="q-mb-sm"
          :juntaDirectivaP="juntaDirectiva"
          @editar="editarInfo"
          :key="juntaDirectiva.id"></junta-directiva-card> -->

        <!-- <div v-if="showBtnContinuar" class="flex justify-center">
          <q-btn label="Continuar" no-caps color="primary" @click="onSubmit"/>
        </div> -->

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

        <junta-directiva-form
            v-if="showJuntaDirectivaForm"
            @close="closeModal"
        ></junta-directiva-form>
    </div>
</template>

<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import JuntaDirectivaForm from 'components/mod-jac/JuntaDirectiva/JuntaDirectivaForm';
import { NIVEL_GERENCIAL } from 'src/utils/config';
export default {
    name: 'JuntaDirectiva',
    components: { JuntaDirectivaForm },
    data() {
        return {
            jacID: 0,
            showJuntaDirectivaForm: false,
            columns: [
                {
                    name: 'cargo',
                    align: 'left',
                    label: 'Cargo',
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
            'getJuntaDirectiva',
            'getComites',
        ]),
        showBtnContinuar() {
            return this.getJuntaDirectivaState.lista.length > 0 ? true : false;
        },
    },
};
</script>

<style scoped></style>
