<template>
  <q-page class="q-pa-xl bg-grey-1">
    <div class="header-section bg-gradient text-white q-mb-xl shadow-2">
      <div class="header-content constrain">
        <h1 class="text-h3 text-weight-bold q-ma-none">Gestión de Puestos de Trabajo</h1>
        <p class="text-subtitle1 q-mt-sm opacity-subtitle">Listado y administración de cargos de la organización</p>
      </div>
      <q-btn 
        to="/talento-humano/puestos-trabajo/nuevo" 
        class="btn-new shadow-3" 
        icon="add" 
        label="Nuevo Puesto" 
        unelevated
      />
    </div>

    <q-card class="list-card shadow-12">
      <q-table
        :data="puestos"
        :columns="columns"
        row-key="id"
        :loading="loading"
        :filter="filter"
        flat
        bordered
      >
        <template v-slot:top-right>
          <q-input 
            outlined 
            dense 
            debounce="300" 
            v-model="filter" 
            placeholder="Buscar por código o cargo..."
            class="search-input"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-chip 
              :color="props.value === 'ACTIVO' ? 'positive' : 'negative'" 
              text-color="white" 
              dense
            >
              {{ props.value }}
            </q-chip>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-sm">
            <q-btn 
              flat 
              round 
              color="primary" 
              icon="edit" 
              @click="editPuesto(props.row.id)"
            />
            <q-btn 
              flat 
              round 
              color="negative" 
              icon="delete" 
              @click="confirmDelete(props.row)"
            />
          </q-td>
        </template>
      </q-table>
    </q-card>
  </q-page>
</template>

<script>
import { ref, onMounted, computed } from '@vue/composition-api'
import { usePuestosTrabajoStore } from '../../../../piña/puestosTrabajo'

export default {
  name: 'PuestoTrabajoList',
  setup(props, { root }) {
    const store = usePuestosTrabajoStore()
    const router = root.$router
    const $q = root.$q
    const filter = ref('')

    const columns = [
      { name: 'codigoCargo', label: 'Código', field: 'codigoCargo', align: 'left', sortable: true },
      { name: 'nombreCargo', label: 'Cargo', field: 'nombreCargo', align: 'left', sortable: true },
      { name: 'area', label: 'Área', field: 'area', align: 'left', sortable: true },
      { name: 'nivelJerarquico', label: 'Nivel', field: 'nivelJerarquico', align: 'left', sortable: true },
      { name: 'tipoContrato', label: 'Contrato', field: 'tipoContrato', align: 'left' },
      { name: 'fechaCreacion', label: 'Fecha Creación', field: 'fechaCreacion', align: 'left', sortable: true },
      { name: 'estado', label: 'Estado', field: 'estado', align: 'center', sortable: true },
      { name: 'actions', label: 'Acciones', field: 'id', align: 'center' }
    ]

    onMounted(async () => {
      await store.fetchPuestos()
    })

    const editPuesto = (id) => {
      router.push(`/talento-humano/puestos-trabajo/editar/${id}`)
    }

    const confirmDelete = (puesto) => {
      $q.dialog({
        title: 'Confirmar Eliminación',
        message: `¿Estás seguro de que deseas desactivar el cargo: ${puesto.nombreCargo}?`,
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await store.deletePuesto(puesto.id)
          $q.notify({
            type: 'positive',
            message: 'Cargo desactivado correctamente'
          })
        } catch (error) {
          $q.notify({
            type: 'negative',
            message: 'Error al desactivar el cargo'
          })
        }
      })
    }

    return {
      puestos: computed(() => store.puestos),
      loading: computed(() => store.loading),
      columns,
      filter,
      editPuesto,
      confirmDelete
    }
  }
}
</script>

<style scoped>
.header-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3rem 2rem;
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.bg-gradient {
  background: linear-gradient(135deg, #84B24D, #75AF7E, #4E9C4C);
}

.opacity-subtitle {
  opacity: 0.9;
  color: #ffffff;
}

.btn-new {
  background-color: #ffffff;
  color: #4E9C4C;
  border-radius: 12px;
  padding: 12px 24px;
  font-weight: bold;
  text-transform: none;
  transition: transform 0.2s;
}

.btn-new:hover {
  transform: scale(1.05);
  background-color: #f8f9fa;
}

.list-card {
  border-radius: 16px;
  overflow: hidden;
}

h1 {
  font-size: 32px !important;
  line-height: 1.2;
  color: #ffffff !important;
}

:deep(.q-table th) {
  font-weight: bold;
  color: #6B7C85;
}

.search-input {
  width: 300px;
  background: white;
  border-radius: 8px;
}

:deep(.q-table tbody td) {
  color: #4A5A63;
}
</style>
