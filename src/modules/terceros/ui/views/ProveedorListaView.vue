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

      <!-- ── Toolbar: búsqueda ── -->
      <div class="table-toolbar">
        <div class="table-toolbar__info">
          <span class="table-toolbar__count">{{ tercerosList.length }} proveedores registrados</span>
        </div>
        <q-input
          outlined
          dense
          debounce="300"
          v-model="filter"
          placeholder="Buscar por nombre, NIT o correo..."
          class="search-input"
          bg-color="white"
        >
          <template v-slot:prepend>
            <q-icon name="search" class="search-icon" />
          </template>
          <template v-slot:append>
            <q-icon
              v-if="filter"
              name="close"
              class="cursor-pointer"
              @click="filter = ''"
            />
          </template>
        </q-input>
      </div>

      <!-- ── Tabla con semi-card rows ── -->
      <q-table
        :data="tercerosList"
        :columns="columns"
        row-key="id"
        :loading="isLoading"
        :filter="filter"
        flat
        separator="none"
        class="custom-table"
        hide-header
      >
        <!-- Fila personalizada -->
        <template v-slot:body="props">
          <q-tr
            :props="props"
            class="provider-row"
            :class="{ 'provider-row--even': props.rowIndex % 2 === 0 }"
            @click="viewDetail(props.row)"
          >
            <!-- Zona 1: Avatar + Nombre + Tipo -->
            <q-td class="provider-cell provider-cell--main" style="width: 40%;">
              <div class="provider-identity">
                <div class="provider-avatar">
                  <q-icon
                    :name="props.row.tipoTercero === 'PERSONA_JURIDICA' ? 'domain' : 'person'"
                    size="20px"
                    color="white"
                  />
                </div>
                <div>
                  <div class="provider-name">
                    {{ props.row.razonSocial || ((props.row.nombres || props.row.apellidos) ? `${props.row.nombres || ''} ${props.row.apellidos || ''}`.trim() : props.row.identificacion) }}
                  </div>
                  <div class="provider-type">
                    {{ props.row.tipoTercero === 'PERSONA_JURIDICA' ? 'Persona Jurídica' : 'Persona Natural' }}
                  </div>
                </div>
              </div>
            </q-td>

            <!-- Zona 2: ID · Ciudad · Email -->
            <q-td class="provider-cell provider-cell--secondary" style="width: 36%;">
              <div class="provider-meta">
                <span class="provider-meta__id">{{ props.row.identificacion }}</span>
                <span v-if="props.row.ciudad" class="provider-meta__sep">·</span>
                <span v-if="props.row.ciudad" class="provider-meta__city">{{ props.row.ciudad }}</span>
              </div>
              <div v-if="props.row.email" class="provider-email">{{ props.row.email }}</div>
            </q-td>

            <!-- Zona 3: Estado + Acciones -->
            <q-td class="provider-cell provider-cell--actions" style="width: 24%;">
              <div class="provider-actions-zone">
                <span
                  v-if="props.row.estado"
                  :class="['status-badge', `status-badge--${(props.row.estado || '').toLowerCase()}`]"
                >
                  {{ props.row.estado }}
                </span>
                <span v-else class="provider-no-status">—</span>

                <q-btn
                  flat
                  round
                  dense
                  icon="edit"
                  color="primary"
                  class="edit-provider-btn"
                  aria-label="Editar proveedor"
                  @click.stop="editProveedor(props.row)"
                >
                  <q-tooltip anchor="center left" self="center right" :offset="[8, 0]">
                    Editar datos del proveedor
                  </q-tooltip>
                </q-btn>

                <!-- Menú contextual ⋮ -->
                <q-btn
                  flat
                  round
                  dense
                  icon="more_vert"
                  class="action-menu-btn"
                  @click.stop
                >
                  <q-menu anchor="bottom right" self="top right" class="action-menu">
                    <q-list dense style="min-width: 180px">
                      <q-item clickable v-close-popup @click="viewDetail(props.row)" class="action-item">
                        <q-item-section avatar>
                          <q-icon name="visibility" size="18px" color="primary" />
                        </q-item-section>
                        <q-item-section>Ver detalle</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="editProveedor(props.row)" class="action-item">
                        <q-item-section avatar>
                          <q-icon name="edit" size="18px" color="primary" />
                        </q-item-section>
                        <q-item-section>Editar proveedor</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item clickable v-close-popup @click="confirmDelete(props.row)" class="action-item action-item--danger">
                        <q-item-section avatar>
                          <q-icon name="delete_outline" size="18px" color="negative" />
                        </q-item-section>
                        <q-item-section>Eliminar</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </div>
            </q-td>
          </q-tr>
        </template>

        <!-- Sin datos -->
        <template v-slot:no-data>
          <div class="full-width row flex-center text-grey-6 q-gutter-sm q-py-xl">
            <q-icon size="2.5em" :name="filter ? 'search_off' : 'group_off'" />
            <div class="text-center">
              <div class="text-subtitle2">{{ filter ? 'Sin resultados para tu búsqueda' : 'Aún no hay proveedores registrados' }}</div>
              <div class="text-caption q-mt-xs">{{ filter ? `No se encontró "${filter}"` : 'Comienza registrando el primer proveedor' }}</div>
            </div>
          </div>
        </template>
      </q-table>
    </q-card>

    <!-- Detail Dialog -->
    <q-dialog v-model="showDetail" transition-show="scale" transition-hide="scale">
      <q-card style="width: 720px; max-width: 92vw;" class="detail-dialog">

        <!-- ── Header ── -->
        <div class="detail-header">
          <div class="detail-header__left">
            <div class="detail-header__avatar">
              <q-icon :name="selectedTercero && selectedTercero.tipoTercero === 'PERSONA_JURIDICA' ? 'domain' : 'person'" size="28px" color="white" />
            </div>
            <div>
              <div class="detail-header__title">Detalle del Proveedor</div>
              <div class="detail-header__subtitle">Información registrada en el sistema</div>
            </div>
          </div>
          <q-btn icon="close" flat round dense color="white" v-close-popup />
        </div>

        <!-- ── Hero: Nombre destacado ── -->
        <div v-if="selectedTercero" class="detail-hero">
          <div class="detail-hero__name">{{ getFullName(selectedTercero) }}</div>
          <div class="detail-hero__badges">
            <span class="badge badge--type">
              {{ selectedTercero.tipoTercero === 'PERSONA_JURIDICA' ? 'Persona Jurídica' : 'Persona Natural' }}
            </span>
            <span v-if="selectedTercero.estado" :class="['badge', 'badge--status', `badge--${(selectedTercero.estado || '').toLowerCase()}`]">
              {{ selectedTercero.estado }}
            </span>
          </div>
        </div>

        <!-- ── Body ── -->
        <div class="detail-body scroll" style="max-height: 58vh;">
          <div v-if="selectedTercero">

            <!-- Card: Identidad -->
            <div class="detail-card">
              <div class="detail-card__header">
                <q-icon name="badge" size="18px" class="detail-card__icon" />
                <span class="detail-card__title">Identidad</span>
              </div>
              <div class="detail-grid">
                <div class="kv-item">
                  <div class="kv-label">Tipo de documento</div>
                  <div class="kv-value">{{ selectedTercero.tipoDocumento || '—' }}</div>
                </div>
                <div class="kv-item">
                  <div class="kv-label">Número de identificación</div>
                  <div class="kv-value kv-value--highlight">{{ selectedTercero.identificacion || '—' }}</div>
                </div>
              </div>
            </div>

            <!-- Card: Contacto -->
            <div class="detail-card">
              <div class="detail-card__header">
                <q-icon name="location_on" size="18px" class="detail-card__icon" />
                <span class="detail-card__title">Ubicación y Contacto</span>
              </div>
              <div class="detail-grid">
                <div class="kv-item">
                  <div class="kv-label">Ciudad</div>
                  <div class="kv-value">{{ selectedTercero.ciudad || '—' }}</div>
                </div>
                <div class="kv-item">
                  <div class="kv-label">País</div>
                  <div class="kv-value">{{ selectedTercero.pais || '—' }}</div>
                </div>
                <div class="kv-item">
                  <div class="kv-label">Correo electrónico</div>
                  <div class="kv-value">{{ selectedTercero.email || '—' }}</div>
                </div>
                <div class="kv-item">
                  <div class="kv-label">Teléfono</div>
                  <div class="kv-value">{{ selectedTercero.telefono || '—' }}</div>
                </div>
                <div class="kv-item kv-item--full">
                  <div class="kv-label">Dirección</div>
                  <div class="kv-value">{{ selectedTercero.direccion || '—' }}</div>
                </div>
              </div>
            </div>

            <!-- Card: Bancaria -->
            <div class="detail-card">
              <div class="detail-card__header">
                <q-icon name="account_balance" size="18px" class="detail-card__icon" />
                <span class="detail-card__title">Información Bancaria</span>
              </div>
              <div class="detail-grid">
                <div class="kv-item">
                  <div class="kv-label">Banco</div>
                  <div class="kv-value kv-value--highlight">{{ selectedTercero.banco || '—' }}</div>
                </div>
                <div class="kv-item">
                  <div class="kv-label">Tipo de cuenta</div>
                  <div class="kv-value">{{ selectedTercero.tipoCuenta || '—' }}</div>
                </div>
                <div class="kv-item kv-item--full">
                  <div class="kv-label">Número de cuenta</div>
                  <div class="kv-value kv-value--highlight">{{ selectedTercero.numeroCuenta || '—' }}</div>
                </div>
              </div>
            </div>

            <!-- Card: Forma de pago -->
            <div class="detail-card">
              <div class="detail-card__header">
                <q-icon name="payments" size="18px" class="detail-card__icon" />
                <span class="detail-card__title">Forma de pago</span>
              </div>
              <div class="detail-grid">
                <div class="kv-item kv-item--full">
                  <div class="kv-label">Forma de pago principal</div>
                  <div class="kv-value">{{ labelTipoFormaPago(fpTipo(selectedTercero)) }}</div>
                </div>
                <div
                  v-if="fpTipo(selectedTercero) === 'CREDITO_DIAS' && fpDiasCredito(selectedTercero) != null && fpDiasCredito(selectedTercero) !== ''"
                  class="kv-item"
                >
                  <div class="kv-label">Días de crédito</div>
                  <div class="kv-value">{{ fpDiasCredito(selectedTercero) }} días</div>
                </div>
                <div
                  v-if="fpTipo(selectedTercero) === 'CREDITO_MESES' && fpMesesPlazo(selectedTercero) != null && fpMesesPlazo(selectedTercero) !== ''"
                  class="kv-item"
                >
                  <div class="kv-label">Plazo (meses)</div>
                  <div class="kv-value">{{ fpMesesPlazo(selectedTercero) }}</div>
                </div>
                <div
                  v-if="fpTipo(selectedTercero) === 'CUOTAS' && fpNumCuotas(selectedTercero) != null && fpNumCuotas(selectedTercero) !== ''"
                  class="kv-item"
                >
                  <div class="kv-label">Número de cuotas</div>
                  <div class="kv-value">{{ fpNumCuotas(selectedTercero) }}</div>
                </div>
                <div
                  v-if="fpTipo(selectedTercero) === 'CUOTAS' && fpMesesPlazo(selectedTercero) != null && fpMesesPlazo(selectedTercero) !== ''"
                  class="kv-item"
                >
                  <div class="kv-label">Plazo total (meses)</div>
                  <div class="kv-value">{{ fpMesesPlazo(selectedTercero) }}</div>
                </div>
                <div
                  v-if="mesesPagoChips(selectedTercero).length > 0"
                  class="kv-item kv-item--full"
                >
                  <div class="kv-label">Meses de pago preferidos</div>
                  <div class="kv-value kv-chips">
                    <span
                      v-for="mes in mesesPagoChips(selectedTercero)"
                      :key="mes"
                      class="badge badge--resp"
                    >{{ mes }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card: Tributaria -->
            <div class="detail-card">
              <div class="detail-card__header">
                <q-icon name="receipt_long" size="18px" class="detail-card__icon" />
                <span class="detail-card__title">Información Tributaria</span>
              </div>
              <div class="detail-grid">
                <div class="kv-item">
                  <div class="kv-label">Régimen</div>
                  <div class="kv-value">{{ selectedTercero.regimen || '—' }}</div>
                </div>
                <div class="kv-item kv-item--full">
                  <div class="kv-label">Responsabilidades fiscales</div>
                  <div class="kv-value kv-chips">
                    <template v-if="getResponsabilidadesList(selectedTercero).length">
                      <span
                        v-for="resp in getResponsabilidadesList(selectedTercero)"
                        :key="resp"
                        class="badge badge--resp"
                      >{{ resp }}</span>
                    </template>
                    <span v-else class="kv-empty">Sin responsabilidades registradas</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        <!-- ── Footer ── -->
        <div class="detail-footer">
          <q-btn
            unelevated
            label="Cerrar"
            color="primary"
            class="detail-footer__btn"
            v-close-popup
          />
        </div>

      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from '@vue/composition-api'
import { useTercerosStore } from 'src/piña/terceros'

/** Debe coincidir con ProveedorRegistroView — payload temporal para modo edición */
var PROVEEDOR_EDIT_STORAGE_KEY = 'proveedor_edit_payload'

export default defineComponent({
  name: 'ProveedorListaView',
  setup(props, { root }) {
    const $q = root.$q
    const store = useTercerosStore()
    const filter = ref('')
    const showDetail = ref(false)
    const selectedTercero = ref(null)

    // Columnas mínimas requeridas por q-table para filtrado/sort interno.
    // El render visual se hace completamente en el slot body personalizado.
    const columns = [
      {
        name: 'razonSocial',
        label: 'RAZÓN SOCIAL / NOMBRE',
        align: 'left',
        field: (r) => r.razonSocial || (r.nombres || r.apellidos ? `${r.nombres || ''} ${r.apellidos || ''}`.trim() : r.identificacion),
        sortable: true
      },
      { name: 'identificacion', label: 'IDENTIFICACIÓN', align: 'left', field: 'identificacion', sortable: true },
      { name: 'email', label: 'CORREO', align: 'left', field: 'email', sortable: true },
      { name: 'ciudad', label: 'CIUDAD', align: 'left', field: (r) => r.ciudad || '', sortable: true },
      { name: 'estado', label: 'ESTADO', align: 'center', field: 'estado', sortable: true }
    ]

    const LABEL_FP_TIPO = {
      CONTADO: 'Contado — sin crédito',
      CREDITO_DIAS: 'Crédito por días (30/45/60…)',
      CREDITO_MESES: 'Crédito por meses calendario',
      CUOTAS: 'Pago en cuotas'
    }

    const MESES_NOMBRES = {
      '1': 'Enero',
      '2': 'Febrero',
      '3': 'Marzo',
      '4': 'Abril',
      '5': 'Mayo',
      '6': 'Junio',
      '7': 'Julio',
      '8': 'Agosto',
      '9': 'Septiembre',
      '10': 'Octubre',
      '11': 'Noviembre',
      '12': 'Diciembre'
    }

    const fpTipo = (t) => {
      if (!t) return ''
      if (t.formaPagoTipo) return t.formaPagoTipo
      if (t.formaPago && t.formaPago.tipoFormaPago) return t.formaPago.tipoFormaPago
      return ''
    }

    const fpDiasCredito = (t) => {
      if (!t) return null
      if (t.diasCredito != null && t.diasCredito !== '') return t.diasCredito
      if (t.formaPago && t.formaPago.diasCredito != null) return t.formaPago.diasCredito
      return null
    }

    const fpNumCuotas = (t) => {
      if (!t) return null
      if (t.numeroCuotas != null && t.numeroCuotas !== '') return t.numeroCuotas
      if (t.formaPago && t.formaPago.numeroCuotas != null) return t.formaPago.numeroCuotas
      return null
    }

    const fpMesesPlazo = (t) => {
      if (!t) return null
      if (t.mesesPlazo != null && t.mesesPlazo !== '') return t.mesesPlazo
      if (t.formaPago && t.formaPago.mesesPlazo != null) return t.formaPago.mesesPlazo
      return null
    }

    const fpMesesPagoRaw = (t) => {
      if (!t) return ''
      if (t.mesesPago != null && t.mesesPago !== '') return t.mesesPago
      if (t.formaPago && t.formaPago.mesesPago != null) {
        var mp = t.formaPago.mesesPago
        if (Array.isArray(mp)) return mp.join(',')
        return mp
      }
      return ''
    }

    const labelTipoFormaPago = (tipo) => {
      if (!tipo) return '—'
      return LABEL_FP_TIPO[tipo] || tipo
    }

    const mesesPagoChips = (t) => {
      var raw = fpMesesPagoRaw(t)
      if (!raw && raw !== 0) return []
      var parts = []
      if (Array.isArray(raw)) {
        parts = raw.map(function (x) {
          return String(x).trim()
        }).filter(function (p) {
          return p
        })
      } else {
        parts = String(raw).split(',').map(function (s) {
          return s.trim()
        }).filter(function (p) {
          return p
        })
      }
      return parts.map(function (p) {
        return MESES_NOMBRES[p] || ('Mes ' + p)
      })
    }

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

    const editProveedor = (tercero) => {
      if (!tercero || !tercero.id) {
        root.$q.notify({
          color: 'warning',
          message: 'No se puede editar: falta el identificador del proveedor',
          icon: 'warning'
        })
        return
      }
      try {
        window.sessionStorage.setItem(PROVEEDOR_EDIT_STORAGE_KEY, JSON.stringify(tercero))
      } catch (e) {
        root.$q.notify({
          color: 'warning',
          message: 'No se pudo preparar la edición. Intente de nuevo.',
          icon: 'warning'
        })
        return
      }
      root.$router.push({
        name: 'registrar-proveedor-nuevo',
        query: { modo: 'editar', id: String(tercero.id) }
      })
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
      editProveedor,
      confirmDelete,
      getStatusColor,
      getFullName,
      getResponsabilidadesList,
      labelTipoFormaPago,
      fpTipo,
      fpDiasCredito,
      fpNumCuotas,
      fpMesesPlazo,
      mesesPagoChips
    }
  }
})
</script>


<style scoped>
/* ─── Page Layout ─────────────────────────────────────────── */
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
  overflow: hidden;
}

.rounded-btn {
  border-radius: 8px;
}

/* ─── Toolbar ─────────────────────────────────────────────── */
.table-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #F1F5F9;
  background: #FAFAFA;
}

.table-toolbar__count {
  font-size: 13px;
  font-weight: 500;
  color: #64748B;
}

.search-input {
  width: 320px;
}

.search-icon {
  opacity: 0.55;
}

/* ─── Tabla sin header, filas semi-card ───────────────────── */
.custom-table :deep(thead) {
  display: none;
}

/* ─── Provider Row ────────────────────────────────────────── */
.provider-row {
  cursor: pointer;
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
  border-bottom: 1px solid #F1F5F9;
}

.provider-row:hover {
  background-color: #F0FDF4 !important;
  box-shadow: inset 3px 0 0 #84B24D;
}

.provider-row--even {
  background-color: #FAFAFA;
}

.provider-cell {
  padding: 14px 16px !important;
  vertical-align: middle;
}

/* ─── Zona 1: Identidad ───────────────────────────────────── */
.provider-identity {
  display: flex;
  align-items: center;
  gap: 12px;
}

.provider-avatar {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: linear-gradient(135deg, #84B24D, #4E9C4C);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.provider-name {
  font-size: 15px;
  font-weight: 600;
  color: #1F2937;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 260px;
}

.provider-type {
  font-size: 12px;
  font-weight: 400;
  color: #6B7280;
  margin-top: 2px;
}

/* ─── Zona 2: Meta (ID · Ciudad · Email) ─────────────────── */
.provider-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.provider-meta__id {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}

.provider-meta__sep {
  color: #CBD5E1;
  font-weight: 300;
}

.provider-meta__city {
  font-size: 13px;
  color: #4B5563;
}

.provider-email {
  font-size: 12px;
  color: #6B7280;
  margin-top: 3px;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* ─── Zona 3: Estado + Acciones ──────────────────────────── */
.provider-actions-zone {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.provider-no-status {
  color: #CBD5E1;
  font-size: 14px;
}

/* ─── Status Badges ───────────────────────────────────────── */
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.status-badge--activo {
  background: #DCFCE7;
  color: #15803D;
}

.status-badge--inactivo {
  background: #F1F5F9;
  color: #64748B;
}

.status-badge--bloqueado {
  background: #FEE2E2;
  color: #DC2626;
}

/* ─── Action menu ─────────────────────────────────────────── */
.action-menu-btn {
  opacity: 0.45;
  transition: opacity 0.15s ease;
}

.provider-row:hover .action-menu-btn {
  opacity: 1;
}

.provider-row:hover .edit-provider-btn {
  opacity: 1;
}

.edit-provider-btn {
  opacity: 0.85;
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.edit-provider-btn:hover {
  transform: scale(1.06);
}

.action-menu {
  border-radius: 10px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.action-item {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  transition: background-color 0.12s ease;
}

.action-item--danger {
  color: #DC2626;
}

/* ─── Modal: Contenedor ───────────────────────────────────── */
.detail-dialog {
  border-radius: 16px !important;
  overflow: hidden;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.18);
}

/* ─── Header ─────────────────────────────────────────────── */
.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #84B24D 0%, #4E9C4C 100%);
}

.detail-header__left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.detail-header__avatar {
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-header__title {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
}

.detail-header__subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.78);
  margin-top: 2px;
}

/* ─── Hero: Nombre ────────────────────────────────────────── */
.detail-hero {
  padding: 20px 24px 16px;
  background: #f8fdf4;
  border-bottom: 1px solid #e8f0e3;
}

.detail-hero__name {
  font-size: 20px;
  font-weight: 700;
  color: #0F172A;
  line-height: 1.3;
  margin-bottom: 10px;
}

.detail-hero__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* ─── Body ────────────────────────────────────────────────── */
.detail-body {
  padding: 20px 24px;
  background: #F8FAFC;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ─── Cards ───────────────────────────────────────────────── */
.detail-card {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  padding: 16px;
  transition: box-shadow 0.2s ease;
}

.detail-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
}

.detail-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #F1F5F9;
}

.detail-card__icon {
  color: #84B24D;
}

.detail-card__title {
  font-size: 13px;
  font-weight: 700;
  color: #1E293B;
  text-transform: uppercase;
  letter-spacing: 0.6px;
}

/* ─── Grid Key-Value ──────────────────────────────────────── */
.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px 20px;
}

.kv-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.kv-item--full {
  grid-column: 1 / -1;
}

.kv-label {
  font-size: 11px;
  font-weight: 600;
  color: #64748B;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.kv-value {
  font-size: 14px;
  font-weight: 500;
  color: #0F172A;
  word-break: break-word;
}

.kv-value--highlight {
  font-size: 15px;
  font-weight: 700;
  color: #1E293B;
}

.kv-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 2px;
}

.kv-empty {
  font-size: 13px;
  color: #94A3B8;
  font-style: italic;
}

/* ─── Badges ──────────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  line-height: 1.4;
}

.badge--type {
  background: #E0F2FE;
  color: #0369A1;
}

.badge--status.badge--activo {
  background: #DCFCE7;
  color: #15803D;
}

.badge--status.badge--inactivo {
  background: #F1F5F9;
  color: #64748B;
}

.badge--status.badge--bloqueado {
  background: #FEE2E2;
  color: #DC2626;
}

.badge--resp {
  background: #F0FDF4;
  color: #16A34A;
  border: 1px solid #BBF7D0;
}

/* ─── Footer ──────────────────────────────────────────────── */
.detail-footer {
  padding: 14px 24px;
  background: #ffffff;
  border-top: 1px solid #E2E8F0;
  display: flex;
  justify-content: flex-end;
}

.detail-footer__btn {
  border-radius: 8px;
  padding: 6px 24px;
  font-weight: 600;
  font-size: 13px;
}
</style>
