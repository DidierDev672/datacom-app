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
                     Agregar Aprobador
                </div>
            </q-card-section>

            <q-separator />
            <q-card-section style="max-height: 50vh" class="scroll">
                <q-form class="q-gutter-md">             
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">                            
                            <q-input
                                outlined
                                dense
                                v-model="usuario.nombre"
                                label="Nombre del aprobador"
                                :rules="[requiredRule]"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">
                            <q-select 
                                label="Rol del aprobador" 
                                dense 
                                outlined 
                                v-model="usuario.rol" 
                                :options="roles"
                                :rules="[requiredRule]"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-sm">
                        <div class="col-xs-12">
                            <q-input
                                outlined
                                dense
                                v-model="usuario.email"
                                label="Correo electrónico"
                                type="email"
                                :rules="[requiredRule, emailRule]"
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
                    @click="close"
                />
                <q-btn
                    no-caps
                    label="Agregar aprobador"
                    color="primary"
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
import { uid } from 'quasar'

export default {
    name: 'AgregarAprobadorForm',
    data() {
        return {
            show: true,
            usuario: this.iniciarModeloUsuario(),
            roles: [
                'Jefe inmediato',
                'Líder de abastecimiento',
                'Director de área',
                'Gerente financiero',
                'Director ejecutivo'
            ],
            requiredRule: val => (val !== null && val !== '' && val !== undefined) || 'Este campo es obligatorio',
            emailRule: val => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val) || 'Correo electrónico inválido'
        };
    },
    methods: {  
        onSubmit() {            
            this.$emit('onSubmitAprobador', this.usuario);
        },
        close() {
            this.$emit('close');
        },
        iniciarModeloUsuario(){
            return {
                id: uid(),
                nombre: '',
                rol: '',
                email: ''
            }
        }
    }
};
</script> 