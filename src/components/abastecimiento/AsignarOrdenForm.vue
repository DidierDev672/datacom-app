<template>
  <q-dialog v-model="show" persistent transition-show="scale" transition-hide="scale">
    <q-card style="width: 600px; max-width: 90vw;">
      <q-card-section>
        <div class="text-h6">Asignar orden a usuario</div>
        <div class="text-subtitle2 text-grey-7 q-mt-xs">Orden: {{ orderCode || orderId }}</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-gutter-md">
        <q-form ref="assignForm">
          <q-select
            outlined
            dense
            v-model="selectedUser"
            :options="userOptions"
            option-value="username"
            option-label="nombreCompleto"
            emit-value
            map-options
            use-input
            hide-selected
            fill-input
            input-debounce="0"
            @filter="filterUsers"
            :loading="loadingUsers"
            label="Seleccionar usuario del equipo de abastecimiento"
            :rules="[requiredRule]"
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
                  <q-item-label caption>{{ scope.opt.username }} — {{ scope.opt.email }}</q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-form>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn flat color="primary" label="Cancelar" @click="close" />
        <q-btn :loading="submitting" color="primary" no-caps icon="assignment_ind" label="Asignar" @click="onAssign" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from 'axios'
import { URL_API } from '../../utils/config'

export default {
  name: 'AsignarOrdenForm',
  props: {
    orderId: { type: String, required: true },
    orderCode: { type: String, default: '' },
    value: { type: Boolean, default: true }
  },
  emits: ['close', 'assigned'],
  data() {
    return {
      show: this.value,
      selectedUser: null,
      users: [],
      userOptions: [],
      loadingUsers: false,
      submitting: false,
      requiredRule: val => (val !== null && val !== '' && val !== undefined) || 'Este campo es obligatorio'
    }
  },
  watch: {
    value(val) { this.show = val },
    show(val) { if (!val) this.$emit('close') }
  },
  created() {
    this.loadUsers()
  },
  methods: {
    async loadUsers() {
      this.loadingUsers = true
      try {
        const response = await axios.get(`${URL_API}/api/users/`)
        const allUsers = (response.data && response.data.results) ? response.data.results : []
        this.users = allUsers.filter(u => u.estado === true)
        this.userOptions = this.users
      } catch (error) {
        console.error('Error al cargar usuarios:', error)
        this.$q.notify({ type: 'negative', message: 'No fue posible cargar usuarios', icon: 'error' })
      } finally {
        this.loadingUsers = false
      }
    },
    filterUsers(val, update) {
      update(() => {
        if (!val) { this.userOptions = this.users; return }
        const needle = val.toLowerCase()
        this.userOptions = this.users.filter(u =>
          (u.nombreCompleto && u.nombreCompleto.toLowerCase().includes(needle)) ||
          (u.email && u.email.toLowerCase().includes(needle)) ||
          (u.username && u.username.toLowerCase().includes(needle))
        )
      })
    },
    async onAssign() {
      if (!this.selectedUser) {
        this.$q.notify({ type: 'warning', message: 'Seleccione un usuario' })
        return
      }
      try {
        this.submitting = true
        this.$emit('assigned', { username: this.selectedUser })
      } finally {
        this.submitting = false
      }
    },
    close() { this.show = false }
  }
}
</script>



