<template>
  <q-page class="q-pa-md bg-grey-2">
    <!-- Header with Gradient -->
    <div class="registration-header q-mb-lg shadow-2">
      <div class="header-content q-pa-lg text-white flex justify-between items-center">
        <div>
          <h1 class="text-h4 text-white text-bold q-ma-none">Listado de Proveedores</h1>
          <p class="q-mt-sm opacity-80 text-white  text-subtitle1">Gestión Centralizada de Terceros - Datacom</p>
        </div>
        <q-btn
          color="white"
          text-color="primary"
          icon="person_add"
          label="Nuevo Registro"
          to="/abastecimiento/proveedores/nuevo"
          class="text-bold rounded-btn shadow-3"
        />
      </div>
    </div>

    <!-- Table Container -->
    <q-card flat bordered class="list-card shadow-1">
      <q-card-section>
        <q-table
          :data="tercerosList"
          :columns="columns"
          row-key="id"
          :loading="isLoading"
          :filter="filter"
          flat
          separator="none"
          class="custom-table"
        >
          <!-- Search Header -->
          <template v-slot:top-right>
            <q-input
              outlined
              dense
              debounce="300"
              v-model="filter"
              placeholder="Buscar proveedor..."
              class="search-input"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <!-- Status Column: badge con color según valor, muestra guion si es null -->
          <template v-slot:body-cell-estado="props">
            <q-td :props="props">
              <q-badge
                v-if="props.value"
                :color="getStatusColor(props.value)"
                class="q-pa-xs text-bold"
              >
                {{ props.value }}
              </q-badge>
              <span v-else class="text-grey-5 text-caption">Sin estado</span>
            </q-td>
          </template>

          <!-- Razon Social Column: fallback a identificacion si todos los campos de nombre son null -->
          <template v-slot:body-cell-razonSocial="props">
            <q-td :props="props">
              <div class="text-weight-medium text-dark">{{ props.value }}</div>
              <div v-if="props.row.tipoTercero" class="text-caption text-grey-6">{{ props.row.tipoTercero === 'PERSONA_JURIDICA' ? 'Persona Jurídica' : 'Persona Natural' }}</div>
            </q-td>
          </template>

          <!-- Actions Column -->
          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="q-gutter-x-sm">
              <q-btn
                flat
                round
                color="primary"
                icon="visibility"
                @click="viewDetail(props.row)"
              >
                <q-tooltip>Ver Detalles</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="negative"
                icon="delete_outline"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip>Eliminar Registro</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <!-- No Data Message -->
          <template v-slot:no-data="{ icon, message, filter }">
            <div class="full-width row flex-center text-grey-7 q-gutter-sm q-py-xl">
              <q-icon size="2em" :name="filter ? 'filter_b_and_w' : icon" />
              <span>{{ message }}</span>
            </div>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Detail Dialog -->
    <q-dialog v-model="showDetail" transition-show="scale" transition-hide="scale">
      <q-card style="width: 700px; max-width: 90vw;" class="detail-dialog">
        <q-card-section class="row items-center bg-primary text-white">
          <div class="text-h6 text-white">Detalle del Proveedor</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md scroll" style="max-height: 70vh">
          <div v-if="selectedTercero">
            <div class="row q-col-gutter-md">
              <!-- Info Básica -->
              <div class="col-12">
                <div class="text-subtitle1 text-bold text-primary q-mb-sm">Información Básica</div>
                <q-separator class="q-mb-md" />
              </div>
              <div class="col-12 col-sm-6">
                <div class="label-detail">Documento:</div>
                <div class="value-detail">{{ selectedTercero.tipoDocumento }} - {{ selectedTercero.identificacion }}</div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="label-detail">Tipo:</div>
                <div class="value-detail">{{ selectedTercero.tipoTercero }}</div>
              </div>
              <div class="col-12">
                <div class="label-detail">Nombre/Razón Social:</div>
                <div class="value-detail text-h6">{{ getFullName(selectedTercero) }}</div>
              </div>

              <!-- Contacto -->
              <div class="col-12 q-mt-md">
                <div class="text-subtitle1 text-bold text-primary q-mb-sm">Ubicación y Contacto</div>
                <q-separator class="q-mb-md" />
              </div>
              <div class="col-12 col-sm-6">
                <div class="label-detail">Ciudad / País:</div>
                <div class="value-detail">{{ selectedTercero.ciudad }}, {{ selectedTercero.pais }}</div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="label-detail">Email:</div>
                <div class="value-detail">{{ selectedTercero.email }}</div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="label-detail">Teléfono:</div>
                <div class="value-detail">{{ selectedTercero.telefono }}</div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="label-detail">Dirección:</div>
                <div class="value-detail">{{ selectedTercero.direccion }}</div>
              </div>

              <!-- Financiero -->
              <div class="col-12 q-mt-md">
                <div class="text-subtitle1 text-bold text-primary q-mb-sm">Información Bancaria</div>
                <q-separator class="q-mb-md" />
              </div>
              <div class="col-12 col-sm-6">
                <div class="label-detail">Banco / Cuenta:</div>
                <div class="value-detail">{{ selectedTercero.banco }} ({{ selectedTercero.tipoCuenta }})</div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="label-detail">Número de Cuenta:</div>
                <div class="value-detail">{{ selectedTercero.numeroCuenta }}</div>
              </div>

              <!-- Tributario -->
              <div class="col-12 q-mt-md">
                <div class="text-subtitle1 text-bold text-primary q-mb-sm">Carga Tributaria</div>
                <q-separator class="q-mb-md" />
              </div>
              <div class="col-12 col-sm-6">
                <div class="label-detail">Régimen:</div>
                <div class="value-detail">{{ selectedTercero.regimen }}</div>
              </div>
              <div class="col-12 col-sm-6">
                <div class="label-detail">Responsabilidades:</div>
                <div class="value-detail">
                  <q-chip v-for="resp in getResponsabilidadesList(selectedTercero)" :key="resp" dense outline color="secondary" size="sm">
                    {{ resp }}
                  </q-chip>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cerrar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from '@vue/composition-api'
import { useTercerosStore } from 'src/piña/terceros'

export default defineComponent({
  name: 'ProveedorListaView',
  setup(props, { root }) {
    const $q = root.$q
    const store = useTercerosStore()
    const filter = ref('')
    const showDetail = ref(false)
    const selectedTercero = ref(null)

    const columns = [
      {
        name: 'razonSocial',
        label: 'RAZÓN SOCIAL / NOMBRE',
        align: 'left',
        field: (r) => r.razonSocial || (r.nombres || r.apellidos ? `${r.nombres || ''} ${r.apellidos || ''}`.trim() : r.identificacion),
        sortable: true
      },
      { name: 'identificacion', label: 'IDENTIFICACIÓN', align: 'left', field: 'identificacion', sortable: true },
      {
        name: 'ciudad',
        label: 'CIUDAD',
        align: 'left',
        field: (r) => r.ciudad || '—',
        sortable: true
      },
      { name: 'email', label: 'CORREO ELECTRÓNICO', align: 'left', field: 'email', sortable: true },
      { name: 'estado', label: 'ESTADO', align: 'center', field: 'estado', sortable: true },
      { name: 'actions', label: 'ACCIONES', align: 'center' }
    ]

    onMounted(async () => {
      console.log('>>> [ProveedorListaView] Componente montado. Cargando datos...')
      try {
        await store.fetchTerceros()
        console.log('<<< [ProveedorListaView] Datos cargados satisfactoriamente.')
      } catch (err) {
        console.error('!!! [ProveedorListaView] Error al cargar datos:', err)
        $q.notify({
          color: 'negative',
          message: 'Error al cargar los proveedores',
          icon: 'error'
        })
      }
    })

    const viewDetail = (tercero) => {
      selectedTercero.value = tercero
      showDetail.value = true
    }

    const confirmDelete = (tercero) => {
      $q.dialog({
        title: 'Confirmar Eliminación',
        message: `¿Está seguro que desea eliminar a "${tercero.razonSocial || tercero.nombres}"? Esta acción no se puede deshacer.`,
        cancel: true,
        persistent: true,
        ok: {
          color: 'negative',
          label: 'Sí, Eliminar'
        }
      }).onOk(async () => {
        try {
          await store.deleteTercero(tercero.id)
          $q.notify({
            color: 'positive',
            message: 'Proveedor eliminado correctamente',
            icon: 'check_circle'
          })
        } catch (err) {
          $q.notify({
            color: 'negative',
            message: 'Error al eliminar el proveedor',
            icon: 'error'
          })
        }
      })
    }

    const getStatusColor = (status) => {
      switch (status) {
        case 'ACTIVO': return 'positive'
        case 'INACTIVO': return 'grey-7'
        case 'BLOQUEADO': return 'negative'
        default: return 'primary'
      }
    }

    const getFullName = (tercero) => {
      if (tercero.tipoTercero === 'PERSONA_JURIDICA') return tercero.razonSocial
      return `${tercero.nombres} ${tercero.apellidos}`
    }

    const getResponsabilidadesList = (tercero) => {
      if (!tercero.responsabilidades) return []
      return tercero.responsabilidades.split(',').filter(r => r)
    }

    return {
      filter,
      showDetail,
      selectedTercero,
      columns,
      tercerosList: computed(() => store.terceros),
      isLoading: computed(() => store.loading),
      viewDetail,
      confirmDelete,
      getStatusColor,
      getFullName,
      getResponsabilidadesList
    }
  }
})
</script>


<style scoped>
.registration-header {
  background: linear-gradient(135deg, #84B24D 0%, #75AF7E 50%, #4E9C4C 100%);
  border-radius: 12px;
  overflow: hidden;
}

.header-content h1 {
  font-size: 24px !important;
  letter-spacing: 0.5px;
}

.list-card {
  border-radius: 16px;
  background-color: white;
}

.custom-table :deep(thead tr th) {
  font-weight: 700;
  color: #6B7C85;
  text-transform: uppercase;
  font-size: 11px;
}

.custom-table :deep(tbody tr:hover) {
  background-color: #f5fcf5;
}

.search-input {
  width: 300px;
}

.label-detail {
  font-size: 10px;
  font-weight: 700;
  color: #a7b1b7;
  text-transform: uppercase;
  margin-bottom: 2px;
}

.value-detail {
  font-size: 14px;
  color: #4A5A63;
  font-weight: 500;
}

.rounded-btn {
  border-radius: 8px;
}

.detail-dialog {
  border-radius: 12px;
  overflow: hidden;
}
</style>
