<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <div class="text-h5">Órdenes aprobadas</div>
      <q-space />
      <q-btn flat icon="refresh" @click="load" :loading="loading" />
    </div>

    <q-banner v-if="error" class="bg-negative text-white q-mb-md">
      <template v-slot:avatar><q-icon name="error" /></template>
      {{ error }}
    </q-banner>

    <q-table
      :data="approvedOrders"
      :columns="columns"
      row-key="id"
      :loading="loading"
      :rows-per-page-options="[10,20,50]"
    >
      <template v-slot:body-cell-actions="props">
        <q-td :props="props">
          <q-btn flat round color="primary" icon="visibility" @click="view(props.row)" class="q-mr-sm" />
          <q-btn flat round color="positive" icon="assignment_ind" @click="openAssign(props.row)" />
        </q-td>
      </template>
    </q-table>

    <asignar-orden-form
      v-if="showAssign && currentOrder"
      :order-id="currentOrder.id"
      :order-code="currentOrder.code"
      :value="showAssign"
      @close="showAssign = false"
      @assigned="handleAssigned"
    />
  </div>
  
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AsignarOrdenForm from 'components/abastecimiento/AsignarOrdenForm.vue'

export default {
  name: 'ApprovedOrders',
  components: { AsignarOrdenForm },
  data() {
    return {
      loading: false,
      error: null,
      approvedOrders: [],
      showAssign: false,
      currentOrder: null,
      columns: [
        { name: 'code', label: 'Consecutivo', field: 'code', align: 'left', sortable: true },
        { name: 'subdireccion', label: 'Subdirección', field: 'subdireccion', align: 'left', sortable: true },
        { name: 'description', label: 'Descripción', field: 'description', align: 'left' },
        { name: 'delivery', label: 'Entrega', field: row => row.shippingAddress && row.shippingAddress.deliveryDate, align: 'center' },
        { name: 'actions', label: 'Acciones', field: 'actions', align: 'center' }
      ]
    }
  },
  computed: {
    ...mapGetters('orderSupply', ['getLoading'])
  },
  created() { this.load() },
  methods: {
    ...mapActions('orderSupply', ['fetchApprovedOrders', 'assignOrderToUser', 'fetchOrders']),
    async load() {
      this.loading = true
      this.error = null
      try {
        await this.fetchOrders()
        this.approvedOrders = await this.fetchApprovedOrders()
      } catch (e) {
        this.error = 'Error cargando órdenes aprobadas'
      } finally {
        this.loading = false
      }
    },
    view(order) {
      this.currentOrder = order
      // potencialmente abrir detalle más adelante
    },
    openAssign(order) {
      this.currentOrder = order
      this.showAssign = true
    },
    async handleAssigned({ username }) {
      try {
        await this.assignOrderToUser({ orderId: this.currentOrder.id, username })
        this.$q.notify({ type: 'positive', message: 'Orden asignada' })
        this.showAssign = false
        await this.load()
      } catch (e) {
        this.$q.notify({ type: 'negative', message: 'No fue posible asignar la orden' })
      }
    }
  }
}
</script>



