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
                            <q-select
                                outlined
                                dense
                                v-model="selectedUser"
                                :options="userOptions"
                                option-value="id"
                                option-label="nombreCompleto"
                                label="Seleccionar aprobador"
                                :rules="[requiredRule]"
                                :loading="loadingUsers"
                                emit-value
                                map-options
                                @input="onUserSelected"
                                clearable
                                use-input
                                hide-selected
                                fill-input
                                input-debounce="0"
                                @filter="filterUsers"
                            >
                                <template v-slot:prepend>
                                    <q-icon name="person_search" />
                                </template>
                                <template v-slot:no-option>
                                    <q-item>
                                        <q-item-section class="text-grey">
                                            {{ loadingUsers ? 'Cargando usuarios...' : 'No hay usuarios disponibles' }}
                                        </q-item-section>
                                    </q-item>
                                </template>
                                <template v-slot:option="scope">
                                    <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                                        <q-item-section avatar>
                                            <q-icon name="person" />
                                        </q-item-section>
                                        <q-item-section>
                                            <q-item-label>{{ scope.opt.nombreCompleto }}</q-item-label>
                                            <q-item-label caption>{{ scope.opt.email }}</q-item-label>
                                        </q-item-section>
                                    </q-item>
                                </template>
                            </q-select>
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
                                readonly
                                :rules="[requiredRule, emailRule]"
                                :hint="usuario.email ? 'Email del usuario seleccionado' : 'Se llenará automáticamente al seleccionar un usuario'"
                                :bg-color="usuario.email ? 'green-1' : 'grey-2'"
                            >
                                <template v-slot:prepend>
                                    <q-icon :name="usuario.email ? 'email' : 'email_outlined'" :color="usuario.email ? 'green' : 'grey'" />
                                </template>
                                <template v-slot:append v-if="usuario.email">
                                    <q-icon name="check_circle" color="green" />
                                </template>
                            </q-input>
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
import axios from 'axios'
import { URL_API } from "../../utils/config"

export default {
    name: 'AgregarAprobadorForm',
    data() {
        return {
            show: true,
            usuario: this.iniciarModeloUsuario(),
            selectedUser: null,
            users: [],
            userOptions: [],
            loadingUsers: false,
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
    
    async created() {
        await this.loadUsers()
    },
    methods: {
        async loadUsers() {
            this.loadingUsers = true
            try {
                const response = await axios.get(`${URL_API}/api/users/`)
                if (response.data && response.data.results) {
                    this.users = response.data.results
                    // Filtrar solo usuarios activos
                    this.userOptions = this.users.filter(user => user.estado === true)
                } else {
                    this.users = []
                    this.userOptions = []
                }
            } catch (error) {
                console.error('Error al cargar usuarios:', error)
                this.$q.notify({
                    type: 'negative',
                    message: 'Error al cargar la lista de usuarios',
                    icon: 'error'
                })
                this.users = []
                this.userOptions = []
            } finally {
                this.loadingUsers = false
            }
        },
        
        filterUsers(val, update) {
            update(() => {
                if (val === '') {
                    this.userOptions = this.users.filter(user => user.estado === true)
                } else {
                    const needle = val.toLowerCase()
                    this.userOptions = this.users.filter(user => {
                        return user.estado === true && (
                            user.nombreCompleto.toLowerCase().indexOf(needle) > -1 ||
                            user.email.toLowerCase().indexOf(needle) > -1 ||
                            user.username.toLowerCase().indexOf(needle) > -1
                        )
                    })
                }
            })
        },
        
        onUserSelected(userId) {
            if (userId) {
                const selectedUserData = this.users.find(user => user.id === userId)
                if (selectedUserData) {
                    this.usuario.nombre = selectedUserData.nombreCompleto
                    this.usuario.email = selectedUserData.email
                    // También podemos guardar datos adicionales si es necesario
                    this.usuario.username = selectedUserData.username
                }
            } else {
                // Si se deselecciona el usuario, limpiar los campos
                this.usuario.nombre = ''
                this.usuario.email = ''
                this.usuario.username = ''
            }
        },
        
        onSubmit() {
            // Validar que se haya seleccionado un usuario
            if (!this.selectedUser) {
                this.$q.notify({
                    type: 'negative',
                    message: 'Debe seleccionar un usuario',
                    icon: 'warning'
                })
                return
            }
            
            if (!this.usuario.rol) {
                this.$q.notify({
                    type: 'negative',
                    message: 'Debe seleccionar un rol',
                    icon: 'warning'
                })
                return
            }
            
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
                email: '',
                username: ''
            }
        }
    }
};
</script> 