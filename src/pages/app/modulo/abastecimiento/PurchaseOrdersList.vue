<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h6">Órdenes de Compra</div>
      <q-space />
      <q-btn color="primary" icon="add_shopping_cart" label="Nueva OCS" @click="goCreate" />
    </div>

    <q-banner v-if="loading" class="q-mb-md">
      <q-spinner-dots size="24px" class="q-mr-sm" /> Cargando órdenes de compra...
    </q-banner>
    <q-banner v-if="error" class="bg-negative text-white q-mb-md">
      <q-icon name="error" class="q-mr-sm" /> {{ error }}
      <template v-slot:action>
        <q-btn flat label="Reintentar" @click="load" />
      </template>
    </q-banner>

    <q-table :data="orders" :columns="columns" row-key="id" :pagination="{ rowsPerPage: 10 }">
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat dense round icon="visibility" @click="view(props.row)" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PurchaseOrdersList',
  data() {
    return {
      columns: [
        { name: 'code', label: 'Código', align: 'left', field: 'code' },
        { name: 'supplier', label: 'Proveedor', align: 'left', field: 'supplier' },
        { name: 'assignedToUserId', label: 'Asignada a', align: 'left', field: 'assignedToUserId' },
        { name: 'createdAt', label: 'Fecha', align: 'left', field: 'createdAt' },
        { name: 'status', label: 'Estado', align: 'left', field: 'status' },
        { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' }
      ]
    }
  },
  computed: {
    ...mapGetters('purchaseorder', ['getList', 'getLoading', 'getError']),
    orders() { return this.getList || [] },
    loading() { return this.getLoading },
    error() { return this.getError }
  },
  created() {
    this.load()
  },
  methods: {
    ...mapActions('purchaseorder', ['fetchPurchaseOrders']),
    load() { this.fetchPurchaseOrders() },
    goCreate() {
      // navega al flujo de crear a través de 'crear-ocs' sin id (si procede) o a gestión
      this.$router.push({ name: 'mis-ordenes-abastecimiento' })
    },
    view(row) {
      this.$router.push({ name: 'ordenes-compra-detalle', params: { id: row.id } })
    }
  }
}
</script>

<style scoped></style>
