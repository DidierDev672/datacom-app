<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col title-main">
        Órdenes de Compra
      </div>
      <div class="col-auto">
        <q-btn class="btn-primario" icon="add" label="Nueva Orden" @click="$router.push('/abastecimiento/autorizacion-compra/nueva')" />
      </div>
    </div>

    <q-table
      :data="filteredOrdenes"
      :columns="columns"
      row-key="idOrden"
      :loading="isLoading"
      flat bordered
      no-data-label="No hay órdenes registradas"
      class="q-mt-md"
    >
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div :class="['status-etiqueta', getStatusClass(props.row.status)]">
            {{ props.row.status }}
          </div>
        </q-td>
      </template>

      <template v-slot:body-cell-totalPagar="props">
        <q-td :props="props" class="col-valor-num">
          {{ props.value }}
        </q-td>
      </template>

      <template v-slot:body-cell-acciones="props">
        <q-td :props="props" class="text-center">
          <q-btn 
            flat 
            round 
            dense 
            icon="visibility" 
            class="btn-accion"
            @click="$router.push(`/abastecimiento/autorizacion-compra/${props.row.idOrden}`)"
          >
            <q-tooltip>Ver detalle</q-tooltip>
          </q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'OrdenCompraListView',
  data() {
    return {
      filtroEstado: null,
      columns: [
        { name: 'numero', label: 'Número', align: 'left', field: 'numero', sortable: true },
        { name: 'fechaEmision', label: 'Fecha Emisión', align: 'left', field: 'fechaEmision', sortable: true },
        { name: 'empresa', label: 'Empresa', align: 'left', field: 'empresa', sortable: true },
        { name: 'proyecto', label: 'Proyecto', align: 'left', field: 'proyecto', sortable: true },
        { name: 'totalPagar', label: 'Total', align: 'right', field: 'totalPagar', sortable: true, format: val => val ? new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP'}).format(val) : '$ 0' },
        { name: 'status', label: 'Estado', align: 'center', field: 'status', sortable: true },
        { name: 'acciones', label: 'Acciones', align: 'center' }
      ]
    }
  },
  computed: {
    ...mapState('ordenCompra', ['ordenes', 'isLoading']),
    filteredOrdenes() {
      if (this.filtroEstado) {
        return this.ordenes.filter(o => o.status === this.filtroEstado);
      }
      return this.ordenes;
    }
  },
  mounted() {
    this.fetchAll();
  },
  methods: {
    ...mapActions('ordenCompra', ['fetchAll']),
    getStatusClass(status) {
      if (status === 'APROBADA') return 'status-activo';
      if (status === 'BORRADOR') return 'status-borrador';
      if (status === 'EMITIDA') return 'status-pendiente';
      if (status === 'ANULADA') return 'status-rechazado';
      return '';
    }
  }
}
</script>

<style scoped>
.title-main {
  font-size: 24px !important;
  font-weight: 700 !important;
  color: #111827 !important;
}

/* --- TABLA ORDEN COMPRA (UX SPEC) --- */

/* Estilo de la tabla y filas */
::v-deep .q-table {
  border-collapse: separate;
}

::v-deep .q-table tbody tr {
  height: 48px !important; /* Altura de fila 48px */
}

::v-deep .q-table tbody tr:hover {
  background-color: #F9FAFB !important;
}

::v-deep .q-table td {
  padding: 12px 16px !important; /* Padding por celda */
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #111827 !important; /* Contenido 14px 400 */
}

/* Encabezados (headers) */
::v-deep .q-table th {
  font-size: 13px !important;
  font-weight: 600 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.05em !important;
  color: #6B7280 !important; /* Header -> 13px 600 #6B7280 */
  padding: 12px 16px !important;
}

/* Valores numéricos */
.col-valor-num {
  font-weight: 500 !important; /* Valores numéricos 14px 500 */
}

/* Totales (si aplica a alguna celda específica o pie) */
.text-total {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #000 !important;
}

/* --- ESTADO (Diseño tipo etiqueta) --- */
.status-etiqueta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 999px;
  text-transform: uppercase;
}

.status-activo {
  background-color: #DCFCE7;
  color: #16A34A; /* ACTIVO Verde */
}

.status-pendiente {
  background-color: #FEF9C3;
  color: #CA8A04; /* PENDIENTE Amarillo */
}

.status-rechazado {
  background-color: #FEE2E2;
  color: #DC2626; /* RECHAZADO Rojo */
}

.status-borrador {
  background-color: #F3F4F6;
  color: #6B7280; /* BORRADOR Gris */
}

/* --- ACCIONES (Botón con icon) --- */
.btn-accion {
  width: 36px !important;
  height: 36px !important;
  background: transparent !important;
  border-radius: 6px !important;
  color: #6B7280 !important;
  transition: all 0.2s ease;
}

.btn-accion:hover {
  background: #F3F4F6 !important;
  color: #111827 !important;
}

::v-deep .btn-accion .q-icon {
  font-size: 18px !important; /* Icono Tamaño 18px */
}

/* Botón "Nueva Orden" */
.btn-primario {
  height: 48px !important;
  padding: 0 16px !important;
  border-radius: 8px !important;
  background: #2563EB !important;
  color: white !important;
  font-weight: 600 !important;
  text-transform: none !important;
}
</style>
