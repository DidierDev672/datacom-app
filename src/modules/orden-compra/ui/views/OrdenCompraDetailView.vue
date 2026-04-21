<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="col title-main">
        Detalle Orden de Compra: {{ ordenActual ? ordenActual.numero : '...' }}
      </div>
      <div class="col-auto">
        <q-btn flat color="primary" label="Volver al Listado" @click="$router.push('/abastecimiento/autorizacion-compra')" />
      </div>
    </div>

    <div v-if="isLoading">
      <q-spinner color="primary" size="3em" class="q-ma-md" />
    </div>

    <q-card v-else-if="ordenActual" flat bordered class="q-pa-md">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <div class="subtitle q-mb-sm">Información General</div>
          <q-list dense>
            <q-item><q-item-section><q-item-label class="detalle-label">Fecha Emisión</q-item-label><q-item-label class="detalle-valor">{{ ordenActual.fechaEmision }}</q-item-label></q-item-section></q-item>
            <q-item><q-item-section><q-item-label class="detalle-label">Empresa</q-item-label><q-item-label class="detalle-valor">{{ ordenActual.empresa }}</q-item-label></q-item-section></q-item>
            <q-item><q-item-section><q-item-label class="detalle-label">Proyecto</q-item-label><q-item-label class="detalle-valor">{{ ordenActual.proyecto }}</q-item-label></q-item-section></q-item>
            <q-item><q-item-section><q-item-label class="detalle-label">Estado</q-item-label>
              <q-item-label class="detalle-valor">
                <q-badge :color="getBadgeColor(ordenActual.status)">{{ ordenActual.status }}</q-badge>
              </q-item-label>
            </q-item-section></q-item>
          </q-list>
        </div>

        <div class="col-12 col-md-6">
          <div class="subtitle q-mb-sm">Proveedor</div>
          <q-list dense v-if="ordenActual.proveedor">
            <q-item><q-item-section><q-item-label class="detalle-label">Nombre</q-item-label><q-item-label class="detalle-valor">{{ ordenActual.proveedor.nombre }}</q-item-label></q-item-section></q-item>
            <q-item><q-item-section><q-item-label class="detalle-label">NIT</q-item-label><q-item-label class="detalle-valor">{{ ordenActual.proveedor.nit }}</q-item-label></q-item-section></q-item>
            <q-item><q-item-section><q-item-label class="detalle-label">Dirección</q-item-label><q-item-label class="detalle-valor">{{ ordenActual.proveedor.direccion }}</q-item-label></q-item-section></q-item>
            <q-item><q-item-section><q-item-label class="detalle-label">Contacto</q-item-label><q-item-label class="detalle-valor">{{ ordenActual.proveedor.telefono }} - {{ ordenActual.proveedor.email }}</q-item-label></q-item-section></q-item>
          </q-list>
        </div>
      </div>

      <q-separator class="q-my-md" />
      
      <div class="subtitle q-mb-md">Ítems ({{ ordenActual.items ? ordenActual.items.length : 0 }})</div>
      <q-table
        :data="ordenActual.items || []"
        :columns="columns"
        row-key="idItem"
        flat bordered
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
      >
        <template v-slot:body-cell-valorUnitario="props">
          <q-td :props="props" class="text-right d-precio">
            {{ formatMoney(props.row.valorUnitario) }}
          </q-td>
        </template>
        <template v-slot:body-cell-valorTotal="props">
          <q-td :props="props" class="text-right d-precio">
            {{ formatMoney(props.row.valorTotal) }}
          </q-td>
        </template>
      </q-table>

      <div class="row justify-end q-mt-md">
        <div class="col-12 col-md-4 bg-grey-1 q-pa-sm rounded-borders text-right">
          <div class="row q-mb-xs"><div class="col-6 detalle-label">Subtotal:</div><div class="col-6 detalle-valor">{{ formatMoney(ordenActual.subtotal) }}</div></div>
          <div class="row q-mb-xs"><div class="col-6 detalle-label">IVA ({{ ordenActual.porcentajeIva }}%):</div><div class="col-6 detalle-valor">{{ formatMoney(ordenActual.iva) }}</div></div>
          <q-separator class="q-my-xs" />
          <div class="row text-primary"><div class="col-6 detalle-total">Total:</div><div class="col-6 detalle-total">{{ formatMoney(ordenActual.totalPagar) }}</div></div>
        </div>
      </div>

    </q-card>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'OrdenCompraDetailView',
  data() {
    return {
      columns: [
        { name: 'numeroItem', label: 'N°', align: 'center', field: 'numeroItem' },
        { name: 'descripcion', label: 'Descripción', align: 'left', field: 'descripcion' },
        { name: 'unidad', label: 'Unidad', align: 'center', field: 'unidad' },
        { name: 'cantidad', label: 'Cant', align: 'center', field: 'cantidad' },
        { name: 'valorUnitario', label: 'V. Unitario', align: 'right', field: 'valorUnitario' },
        { name: 'valorTotal', label: 'V. Total', align: 'right', field: 'valorTotal' }
      ]
    };
  },
  computed: {
    ...mapState('ordenCompra', ['ordenActual', 'isLoading'])
  },
  mounted() {
    const id = this.$route.params.id;
    if (id) {
      this.fetchById(id);
    }
  },
  methods: {
    ...mapActions('ordenCompra', ['fetchById']),
    formatMoney(val) {
      if (!val) return '$ 0';
      return new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP', minimumFractionDigits: 0}).format(val);
    },
    getBadgeColor(status) {
      if (status === 'APROBADA') return 'positive';
      if (status === 'BORRADOR') return 'grey';
      if (status === 'EMITIDA') return 'warning';
      if (status === 'ANULADA') return 'negative';
      return 'primary';
    }
  }
}
</script>

<style scoped>
/* Tipografías base según UX specification */
.title-main {
  font-size: 24px !important;
  font-weight: 700 !important;
  color: #111827 !important;
}

.subtitle {
  font-size: 18px !important;
  font-weight: 500 !important;
  color: #111827 !important;
}

.detalle-label {
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #6B7280 !important;
} /* El valor destaca más que el label */

.detalle-valor {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #111827 !important;
}

.detalle-total {
  font-size: 16px !important;
  font-weight: 600 !important;
  color: #111827 !important;
  /* (Override potential existing colors gracefully if it is text-primary) */
}

/* Tabla Items en Detalle */
::v-deep .q-table th {
  font-size: 13px !important;
  font-weight: 600 !important;
}
::v-deep .q-table td {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #111827 !important;
}
::v-deep .d-cantidad {
  font-weight: 500 !important;
}
::v-deep .d-precio {
  font-weight: 500 !important;
}
</style>
