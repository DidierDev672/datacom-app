<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col text-h5 text-weight-bold">
        Requisiciones de Compras
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Nueva Requisición" @click="$router.push('/compras/requisiciones/nueva')" />
      </div>
    </div>

    <div class="row q-mb-md">
      <div class="col-12 col-md-4">
        <q-select
          v-model="filtroEstado"
          :options="opcionesEstado"
          label="Filtrar por Estado"
          dense outlined clearable
          @input="cargarDatos"
        />
      </div>
    </div>

    <q-table
      :data="store.requisiciones"
      :columns="columns"
      row-key="idRequisicion"
      :loading="store.isLoading"
      flat bordered
      no-data-label="No hay requisiciones"
      class="tabla-estilizada"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <span 
            class="badge-estado"
            :style="{ backgroundColor: getBadgeColor(props.row.status) }"
          >
            {{ props.row.status || 'SIN ESTADO' }}
          </span>
        </q-td>
      </template>
      
      <template v-slot:body-cell-acciones="props">
        <q-td :props="props" class="text-center">
          <button class="btn-accion" title="Ver detalle" @click="abrirDetalle(props.row)">
            <q-icon name="visibility" size="16px" />
          </button>
        </q-td>
      </template>
    </q-table>

    <q-dialog v-model="modalVisible">
      <q-card style="width: 700px; max-width: 90vw; border-radius: 12px;">
        <q-card-section class="row items-center q-pb-none">
          <div class="modal-titulo">Detalle de Requisición</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md" v-if="requisicionSeleccionada">
          <div class="row q-col-gutter-xl">
            <div class="col-12 col-md-6">
              <div class="modal-subtitulo q-mb-md">Información General</div>
              
              <div class="q-mb-md">
                <div class="modal-label">Código</div>
                <div class="modal-valor">{{ requisicionSeleccionada.codigo }}</div>
              </div>

              <div class="q-mb-md">
                <div class="modal-label">Proyecto</div>
                <div class="modal-valor">{{ requisicionSeleccionada.proyecto }}</div>
              </div>

              <div class="q-mb-md">
                <div class="modal-label">Solicitante</div>
                <div class="modal-valor">{{ requisicionSeleccionada.solicitante }}</div>
              </div>
            </div>

            <div class="col-12 col-md-6">
              <div class="modal-subtitulo q-mb-md">Estado y Fechas</div>
              
              <div class="q-mb-md">
                <div class="modal-label">Fecha de Solicitud</div>
                <div class="modal-valor">{{ requisicionSeleccionada.fechaSolicitud }}</div>
              </div>

              <div class="q-mb-md">
                <div class="modal-label">Estado</div>
                <div class="q-mt-xs">
                  <span 
                    class="modal-badge-estado"
                    :style="{ backgroundColor: getBadgeColor(requisicionSeleccionada.status) }"
                  >
                    {{ requisicionSeleccionada.status || 'SIN ESTADO' }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="row">
            <div class="col-12">
              <div class="modal-subtitulo q-mb-sm">Detalle de Ítems</div>
              <q-table
                :data="requisicionSeleccionada.items || []"
                :columns="columnasItems"
                row-key="idItem"
                flat bordered
                dense
                hide-pagination
                :pagination="{ rowsPerPage: 0 }"
                no-data-label="No hay ítems registrados"
                class="q-mb-md tabla-items-detalle"
              >
                <template v-slot:bottom-row v-if="requisicionSeleccionada.items && requisicionSeleccionada.items.length > 0">
                  <q-tr class="bg-grey-1">
                    <q-td colspan="4" class="text-right" style="font-size: 14px; font-weight: 600; color: #111827; padding: 10px 12px;">
                      TOTAL GENERAL
                    </q-td>
                    <q-td class="text-right col-total">
                      {{ formatMoneyCustom(calcularTotalRequisicion(requisicionSeleccionada.items)) }}
                    </q-td>
                  </q-tr>
                </template>
              </q-table>
            </div>
          </div>

          <q-separator class="q-my-md" />

          <div class="row">
            <div class="col-12">
              <div class="modal-subtitulo q-mb-sm">Justificación</div>
              <div class="modal-justificacion">
                {{ requisicionSeleccionada.justificacion || 'No se proporcionó información adicional o justificación detallada para esta requisición.' }}
              </div>
            </div>
          </div>

          <q-separator class="q-my-md" v-if="requisicionSeleccionada" />

          <div class="row">
            <div class="col-12">
              <div class="modal-subtitulo q-mb-sm">Recomendaciones</div>
              <div class="modal-texto-largo" style="line-height: 1.5; color: #374151;">
                {{ requisicionSeleccionada.recomendaciones || 'No hay recomendaciones registradas.' }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { useRequisicionStore } from '../store/useRequisicionStore';

export default {
  name: 'RequisicionesListView',
  data() {
    return {
      modalVisible: false,
      requisicionSeleccionada: null,
      filtroEstado: null,
      opcionesEstado: [
        { label: 'Borrador', value: 'BORRADOR' },
        { label: 'Pendiente / Enviada', value: 'ENVIADA' },
        { label: 'Aprobada', value: 'APROBADA' },
        { label: 'Rechazada', value: 'RECHAZADA' }
      ],
      columns: [
        { name: 'codigo', label: 'Código', align: 'left', field: 'codigo', sortable: true, classes: 'col-codigo' },
        { name: 'proyecto', label: 'Proyecto', align: 'left', field: 'proyecto', sortable: true, classes: 'col-proyecto' },
        { name: 'solicitante', label: 'Solicitante', align: 'left', field: 'solicitante', sortable: true, classes: 'col-solicitante' },
        { name: 'fechaSolicitud', label: 'Fecha Solicitud', align: 'center', field: 'fechaSolicitud', sortable: true, classes: 'col-fecha' },
        { name: 'status', label: 'Estado', align: 'center', field: 'status', sortable: true },
        { name: 'acciones', label: 'Acciones', align: 'center' }
      ],
      columnasItems: [
        { name: 'detalle', label: 'Detalle', align: 'left', field: 'detalle' },
        { name: 'unidad', label: 'Unidad', align: 'center', field: 'unidad' },
        { name: 'cantidad', label: 'Cantidad', align: 'center', field: 'cantidad', classes: 'col-numerico' },
        { name: 'precioUnitario', label: 'V. Unitario', align: 'right', field: 'precioUnitario', classes: 'col-numerico', format: val => val ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val) : '$ 0' },
        { name: 'total', label: 'V. Total', align: 'right', field: row => (row.cantidad || 0) * (row.precioUnitario || 0), classes: 'col-total', format: val => val ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val) : '$ 0' }
      ]
    }
  },
  computed: {
    store() {
      return useRequisicionStore();
    }
  },
  mounted() {
    this.cargarDatos();
  },
  methods: {
    abrirDetalle(row) {
      this.requisicionSeleccionada = row;
      this.modalVisible = true;
    },
    calcularTotalRequisicion(items) {
      if (!items || !items.length) return 0;
      return items.reduce((acc, row) => acc + ((row.cantidad || 0) * (row.precioUnitario || 0)), 0);
    },
    formatMoneyCustom(val) {
      return val ? new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(val) : '$ 0';
    },
    cargarDatos() {
      const filters = this.filtroEstado ? { status: this.filtroEstado.value } : {};
      this.store.fetchAll(filters);
    },
    getBadgeColor(status) {
      if (!status) return '#6B7280';
      const s = status.toUpperCase();
      if (['ACTIVO', 'APROBADA'].includes(s)) return '#16A34A';
      if (['PENDIENTE', 'ENVIADA'].includes(s)) return '#CA8A04';
      if (['RECHAZADA', 'RECHAZADO'].includes(s)) return '#DC2626';
      if (s === 'BORRADOR') return '#6B7280';
      return '#6B7280';
    }
  }
}
</script>

<style scoped>
/* Espacio y Encabezados */
::v-deep .tabla-estilizada .q-table th {
  padding: 12px 16px !important;
  font-size: 13px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  color: #6B7280 !important;
}

::v-deep .tabla-estilizada .q-table tbody td {
  height: 48px !important;
  padding: 12px 16px !important;
}

/* Tipografía de columnas específicas */
::v-deep .tabla-estilizada .q-table tbody td.col-codigo {
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #111827 !important;
}

::v-deep .tabla-estilizada .q-table tbody td.col-proyecto {
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #1F2937 !important;
}

::v-deep .tabla-estilizada .q-table tbody td.col-solicitante {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #374151 !important;
}

::v-deep .tabla-estilizada .q-table tbody td.col-fecha {
  font-size: 13px !important;
  font-weight: 400 !important;
  color: #6B7280 !important;
}

/* Estado (Badge) */
.badge-estado {
  font-size: 13px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 999px;
  color: #FFFFFF;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* Acciones (Botón con ícono) */
.btn-accion {
  width: 36px;
  height: 36px;
  border-radius: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  transition: background 0.2s ease;
}

.btn-accion:hover {
  background: #F3F4F6;
}

/* Modal Estilos */
.modal-titulo {
  font-size: 24px;
  font-weight: 600;
  color: #111827;
}

.modal-subtitulo {
  font-size: 18px;
  font-weight: 500;
  color: #111827;
}

.modal-label {
  font-size: 13px;
  font-weight: 400;
  color: #6B7280;
  margin-bottom: 2px;
}

.modal-valor {
  font-size: 14px;
  font-weight: 400;
  color: #111827;
}

.modal-texto-largo {
  font-size: 15px;
  font-weight: 400;
  color: #111827;
}

.modal-justificacion {
  font-size: 14px;
  line-height: 1.5;
  color: #374151;
}

.modal-badge-estado {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  color: #FFFFFF;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
/* Tabla detalle ítems en Modal */
::v-deep .tabla-items-detalle .q-table th {
  font-size: 13px !important;
  font-weight: 600 !important;
  color: #6B7280 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  padding: 10px 12px !important;
}

::v-deep .tabla-items-detalle .q-table tbody td {
  height: 48px !important;
  padding: 10px 12px !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #111827 !important;
  transition: background-color 0.2s ease;
}

/* Hover de fila */
::v-deep .tabla-items-detalle .q-table tbody tr:hover td {
  background-color: #F9FAFB !important;
}

/* Fila activa (para modales editables etc) */
::v-deep .tabla-items-detalle .q-table tbody tr.fila-activa td,
::v-deep .tabla-items-detalle .q-table tbody tr.selected td {
  background-color: #EFF6FF !important;
}

/* Valores numericos y Totales */
::v-deep .tabla-items-detalle .q-table tbody td.col-numerico {
  font-weight: 500 !important;
  color: #111827 !important;
}

::v-deep .tabla-items-detalle .q-table tbody td.col-total {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #000000 !important;
}

/* Inputs dentro de tabla (Reglas UX para modales editables) */
::v-deep .tabla-items-detalle .q-field__control {
  height: 36px !important;
  min-height: 36px !important;
}

::v-deep .tabla-items-detalle .q-field__native,
::v-deep .tabla-items-detalle .q-field__input {
  font-size: 14px !important;
  padding: 8px !important;
}
</style>
