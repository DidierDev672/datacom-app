<template>
    <q-dialog
        persistent
        transition-show="scale"
        transition-hide="scale"
        v-model="show"
    >
        <q-card style="width: 700px;">
            <q-card-section>
                <div class="text-h6">
                    {{ mensajeBoton }} Junta Directiva Jac
                </div>
            </q-card-section>

            <q-separator />
            <q-card-section style="max-height: 50vh" class="scroll">
                <q-form class="q-gutter-md">
                    <!-- <div class="row q-col-gutter-sm">
          <div class="col-xs-12">
            <q-select
              outlined
              option-value="id"
              option-label="nombre"
              v-model="juntaDirectivaDB.tipo"
              :options="tipoOptions"
              label="Seleccione el tipo"
            />
          </div>
        </div> -->
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">
                            <q-select
                                outlined
                                option-value="id"
                                option-label="nombre"
                                v-model="juntaDirectivaDB.cargo"
                                :options="cargosOptions"
                                label="Seleccione el cargo"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">
                            <q-input
                                outlined
                                v-model="juntaDirectivaDB.nombre"
                                label="Nombre"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">
                            <q-input
                                outlined
                                v-model="juntaDirectivaDB.primerApellido"
                                label="Primer Apellido"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">
                            <q-input
                                outlined
                                v-model="juntaDirectivaDB.segundoApellido"
                                label="Segundo Apellido"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">
                            <q-input
                                outlined
                                v-model="
                                    juntaDirectivaDB.noDocumentoIdentificacion
                                "
                                label="No Documento"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">
                            <q-input
                                outlined
                                v-model="juntaDirectivaDB.celular"
                                label="Celular"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">
                            <q-input
                                outlined
                                v-model="juntaDirectivaDB.email"
                                label="Email"
                            />
                        </div>
                    </div>
                </q-form>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn
                    flat
                    label="Cancelar"
                    color="primary"
                    :disable="getJuntaDirectivaState.loading"
                    @click="close"
                />
                <q-btn
                    :label="mensajeBoton"
                    color="primary"
                    :loading="getJuntaDirectivaState.loading"
                    :disable="getJuntaDirectivaState.loading"
                    @click="onSubmit"
                >
                    <template v-slot:loading>
                        <q-spinner-facebook />
                    </template>
                </q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { CATEGORIAS, NIVEL_GERENCIAL } from 'src/utils/config';

export default {
    name: 'JuntaDirectivaForm',
    data() {
        return {
            show: true,
            juntaDirectivaDB: {},
            jacID: 0,
            tipoOptions: [],
            cargosOptions: [],
            tipoDocumento: [],
        };
    },
    created() {
        let categoriasCargo = [CATEGORIAS.CARGOS];
        let categoriasTipo = [CATEGORIAS.TIPO_JUNTA];

        this.jacID = this.$route.params.id;
        this.juntaDirectivaDB = {
            id: 0,
            tipo: { id: NIVEL_GERENCIAL.JUNTA_DIRECTIVA },
            cargo: '',
            nombre: '',
            primerApellido: '',
            segundoApellido: '',
            noDocumentoIdentificacion: '',
            email: '',
            celular: '',
        };
        if (
            Object.keys(this.getJuntaDirectivaState.objJuntaDirectiva).length >
            0
        ) {
            this.juntaDirectivaDB.id = this.getJuntaDirectivaState.objJuntaDirectiva.id;
            this.juntaDirectivaDB.tipo = this.getJuntaDirectivaState.objJuntaDirectiva.tipo;
            this.juntaDirectivaDB.cargo = this.getJuntaDirectivaState.objJuntaDirectiva.cargo;
            this.juntaDirectivaDB.nombre = this.getJuntaDirectivaState.objJuntaDirectiva.nombre;
            this.juntaDirectivaDB.primerApellido = this.getJuntaDirectivaState.objJuntaDirectiva.primerApellido;
            this.juntaDirectivaDB.segundoApellido = this.getJuntaDirectivaState.objJuntaDirectiva.segundoApellido;
            this.juntaDirectivaDB.noDocumentoIdentificacion = this.getJuntaDirectivaState.objJuntaDirectiva.noDocumentoIdentificacion;
            this.juntaDirectivaDB.email = this.getJuntaDirectivaState.objJuntaDirectiva.email;
            this.juntaDirectivaDB.celular = this.getJuntaDirectivaState.objJuntaDirectiva.celular;
        }
        this.cargarListaParametroPorCategoriaAction(categoriasCargo).then(
            (data) => {
                this.cargosOptions = data;
            }
        );
        // this.cargarListaParametroPorCategoriaAction(categoriasTipo).then(data => {
        //   this.tipoOptions = data
        // })
    },
    methods: {
        ...mapActions('juntaDirectiva', [
            'registrarJuntaDirectivaAction',
            'actualizarJuntaDirectivaAction',
            'unsetJuntaDirectivaAction',
        ]),
        ...mapActions('parametros', ['cargarListaParametroPorCategoriaAction']),
        onSubmit() {
            let info = {
                ...this.juntaDirectivaDB,
                jac: {
                    id: this.jacID,
                },
                usuarioCreacion: this.getUser,
                usuarioActualizacion: this.getUser,
            };

            if (info.id > 0) {
                info.usuarioCreacion = this.getJuntaDirectivaState.objJuntaDirectiva.usuarioCreacion;
                this.actualizarJuntaDirectivaAction(info).then(() => {});
            } else {
                this.registrarJuntaDirectivaAction(info).then((data) => {
                    //this.juntaDirectivaDB.id = data

                    this.juntaDirectivaDB = {
                        id: 0,
                        tipo: { id: NIVEL_GERENCIAL.JUNTA_DIRECTIVA },
                        cargo: '',
                        nombre: '',
                        primerApellido: '',
                        segundoApellido: '',
                        noDocumentoIdentificacion: '',
                        email: '',
                        celular: '',
                    };
                });
            }
        },
        close() {
            this.$emit('close');
        },
    },
    computed: {
        ...mapGetters('juntaDirectiva', ['getJuntaDirectivaState']),
        ...mapGetters('auth', ['getUser']),
        mensajeBoton() {
            return this.juntaDirectivaDB.id > 0 ? 'Actualizar' : 'Guardar';
        },
    },
    beforeDestroy() {
        this.unsetJuntaDirectivaAction();
    },
};
</script>

<style scoped></style>
