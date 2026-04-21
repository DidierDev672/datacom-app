<template>
  <q-card flat bordered class="q-pa-md q-mt-md bg-grey-1">
    <div class="row justify-end">
      <div class="col-8 col-md-4">
        <div class="row q-mb-sm">
          <div class="col-6 text-right detalle-label">Subtotal:</div>
          <div class="col-6 text-right detalle-valor">{{ formatMoney(subtotal) }}</div>
        </div>
        <div class="row q-mb-sm">
          <div class="col-6 text-right detalle-label">IVA ({{ porcentajeIva }}%):</div>
          <div class="col-6 text-right detalle-valor">{{ formatMoney(iva) }}</div>
        </div>
        <q-separator class="q-my-sm" />
        <div class="row">
          <div class="col-6 text-right detalle-total">Total a Pagar:</div>
          <div class="col-6 text-right detalle-total text-primary">{{ formatMoney(totalPagar) }}</div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
export default {
  name: 'ResumenTotales',
  props: {
    items: {
      type: Array,
      required: true
    },
    porcentajeIva: {
      type: Number,
      required: true
    }
  },
  computed: {
    subtotal() {
      return this.items.reduce((acc, row) => acc + ((Number(row.cantidad) || 0) * (Number(row.valorUnitario) || 0)), 0);
    },
    iva() {
      return this.subtotal * ((Number(this.porcentajeIva) || 0) / 100);
    },
    totalPagar() {
      return this.subtotal + this.iva;
    }
  },
  methods: {
    formatMoney(val) {
      return new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP', minimumFractionDigits: 0}).format(val);
    }
  }
}
</script>

<style scoped>
.detalle-label {
  font-size: 14px !important;
  font-weight: 500 !important;
  color: #6B7280 !important;
}

.detalle-valor {
  font-size: 14px !important;
  font-weight: 400 !important;
  color: #111827 !important;
}

.detalle-total {
  font-size: 16px !important;
  font-weight: 600 !important;
  /* color #111827 but overridden by text-primary if needed */
}
</style>
