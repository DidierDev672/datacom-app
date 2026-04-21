<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat dense icon="arrow_back" label="Volver" @click="$router.back()" />
      <q-space />
      <div class="text-h6">Generar Orden de Compra (OCS)</div>
    </div>

    <q-banner v-if="loading" class="q-mb-md">
      <q-spinner-dots size="24px" class="q-mr-sm" /> Cargando orden de abastecimiento...
    </q-banner>
    <q-banner v-if="error" class="bg-negative text-white q-mb-md">
      <q-icon name="error" class="q-mr-sm" /> {{ error }}
      <template v-slot:action>
        <q-btn flat label="Reintentar" @click="loadSupplyOrder" />
      </template>
    </q-banner>

    <div v-if="supplyOrder" class="q-gutter-y-md">
      <q-card>
        <q-card-section class="bg-blue-1">
          <div class="text-subtitle1 text-blue-8">Información de la Solicitud</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4"><q-input v-model="prefill.code" label="Consecutivo" dense outlined readonly />
            </div>
            <div class="col-12 col-md-4"><q-input v-model="prefill.subdireccion" label="Subdirección" dense outlined
                readonly /></div>
            <div class="col-12 col-md-4"><q-input v-model="prefill.deliveryDate" label="Fecha de entrega" dense outlined
                readonly /></div>
            <div class="col-12"><q-input type="textarea" v-model="prefill.description" label="Descripción" dense
                outlined readonly /></div>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section class="bg-green-1">
          <div class="text-subtitle1 text-green-8">Orden de Compra</div>
        </q-card-section>
        <q-separator />
        <form @submit.prevent="handleSave">
          <q-card-section>
            <div class="row q-col-gutter-md">
              <div class="col-12 col-md-6">
                <q-input v-model="purchaseOrderForm.providerName" label="Proveedor" dense outlined readonly
                  :rules="[val => !!val || 'Requerido']">
                  <template v-slot:append>
                    <q-btn dense flat icon="search" @click="showProviderModal = true" />
                  </template>
                </q-input>
              </div>
              <div class="col-12 col-md-3">
                <q-input v-model.number="purchaseOrderForm.paymentTerms" type="number" label="Plazo de pago (días)"
                  dense outlined />
              </div>
              <div class="col-12 col-md-3">
                <q-input v-model="purchaseOrderForm.currency" label="Moneda" dense outlined />
              </div>
            </div>

            <q-separator class="q-my-md" />

            <div class="q-mb-sm">
              <q-btn color="primary" icon="add" label="Agregar item" dense @click="addItem" />
            </div>
            <q-table :data="purchaseOrderForm.items" :columns="itemColumns" row-key="id" flat
              :pagination="{ rowsPerPage: 0 }">
              <template v-slot:body-cell-productName="props">
                <q-td :props="props">
                  <q-input dense outlined v-model="props.row.productName" />
                </q-td>
              </template>
              <template v-slot:body-cell-unit="props">
                <q-td :props="props">
                  <q-input dense outlined v-model="props.row.unit" />
                </q-td>
              </template>
              <template v-slot:body-cell-quantity="props">
                <q-td :props="props">
                  <q-input dense outlined type="number" v-model.number="props.row.quantity" />
                </q-td>
              </template>
              <template v-slot:body-cell-unitPrice="props">
                <q-td :props="props">
                  <q-input dense outlined type="number" v-model.number="props.row.unitPrice" />
                </q-td>
              </template>
              <template v-slot:body-cell-subtotal="props">
                <q-td :props="props">
                  {{ formatMoney((Number(props.row.quantity) || 0) * (Number(props.row.unitPrice) || 0)) }}
                </q-td>
              </template>
              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <q-btn flat round dense color="negative" icon="delete" @click="removeItem(props.row)" />
                </q-td>
              </template>
              <template v-slot:bottom>
                <div class="row full-width justify-end q-pa-sm">
                  <div class="text-subtitle1 text-weight-bold">Total: {{ formatMoney(totalAmount) }}</div>
                </div>
              </template>
            </q-table>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="grey-7" @click="$router.back()" />
            <q-btn color="primary" label="Guardar" :loading="saving" :disable="!canSave" type="submit" />
          </q-card-actions>
        </form>
      </q-card>
    </div>

    <!-- Modal Proveedores (Mock) -->
    <q-dialog v-model="showProviderModal" persistent>
      <q-card style="min-width: 900px; max-width: 95vw;">
        <q-card-section class="row items-center bg-primary text-white">
          <q-icon name="store" class="q-mr-sm" />
          <div class="text-h6">Seleccionar Proveedor</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="text-white" />
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md q-mb-md">
            <div class="col-12 col-md-3">
              <q-input dense outlined v-model="providerFilters.nit" label="Filtrar por NIT" clearable />
            </div>
            <div class="col-12 col-md-3">
              <q-input dense outlined v-model="providerFilters.name" label="Filtrar por Nombre" clearable />
            </div>
            <div class="col-12 col-md-3">
              <q-input dense outlined v-model="providerFilters.contact" label="Filtrar por Contacto" clearable />
            </div>
            <div class="col-12 col-md-3">
              <q-input dense outlined v-model="providerFilters.phone" label="Filtrar por Teléfono" clearable />
            </div>
            <div class="col-12">
              <q-btn color="primary" dense icon="search" label="Buscar" @click="searchProviders(0)" />
              <q-btn flat dense icon="clear_all" label="Limpiar filtros" class="q-ml-sm"
                @click="clearProviderFilters" />
            </div>
          </div>
          <q-table :data="filteredProviderRows" :columns="providerColumns" row-key="id" :loading="providerLoading" flat>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <q-btn color="primary" dense label="Seleccionar" @click="selectProvider(props.row)" />
              </q-td>
            </template>
            <template v-slot:bottom>
              <div class="row items-center q-pa-sm full-width">
                <div class="row items-center q-gutter-sm">
                  <span>Filas:</span>
                  <q-select dense outlined v-model="supplierSize" :options="[5, 10, 20]" style="width: 90px"
                    @input="onSupplierSize" />
                </div>
                <q-space />
                <q-pagination v-model="supplierPage" :max="getSuppliersTotalPages || 1" max-pages="6" boundary-numbers
                  @input="onSupplierPage" />
                <div class="q-ml-md">{{ getSuppliersTotalElements || 0 }} resultados</div>
              </div>
            </template>
          </q-table>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" color="grey-7" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { date } from 'quasar'
import { uid } from 'quasar';

export default {
  name: 'CreatePurchaseOrder',
  props: {
    orderId: { type: String, required: true }
  },
  data() {
    return {
      loading: false,
      saving: false,
      error: null,
      supplyOrder: null,
      prefill: {
        code: '',
        subdireccion: '',
        description: '',
        deliveryDate: ''
      },
      purchaseOrderForm: {
        providerNit: '',
        providerName: '',
        paymentTerms: 0,
        currency: 'COP',
        items: []
      },
      showProviderModal: false,
      providerLoading: false,
      providerError: null,
      providerColumns: [
        { name: 'nit', label: 'NIT', align: 'left', field: 'nit', sortable: true },
        { name: 'name', label: 'Nombre', align: 'left', field: 'name', sortable: true },
        { name: 'address', label: 'Dirección', align: 'left', field: 'address' },
        { name: 'phone', label: 'Teléfono', align: 'left', field: 'phone' },
        { name: 'contactName', label: 'Contacto', align: 'left', field: 'contactName' },
        { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' }
      ],
      providerRows: [
        { nit: '900123456', name: 'Distribuciones Andina SAS', address: 'Cra 15 # 45-21', phone: '3001234567', contact: 'Ana López' },
        { nit: '800987654', name: 'Suministros del Norte LTDA', address: 'Calle 72 # 10-15', phone: '6015558877', contact: 'Carlos Pérez' },
        { nit: '901555333', name: 'Tecnologías y Servicios SAS', address: 'Av. 68 # 22-35', phone: '3157894561', contact: 'María Gómez' }
      ],
      providerFilters: {
        nit: '',
        name: '',
        address: '',
        phone: '',
        contact: ''
      },
      supplierPage: 1,
      supplierSize: 10,
      itemColumns: [
        { name: 'productName', label: 'Producto/Servicio', align: 'left', field: 'productName' },
        { name: 'unit', label: 'Unidad', align: 'center', field: 'unit' },
        { name: 'quantity', label: 'Cantidad', align: 'center', field: 'quantity' },
        { name: 'unitPrice', label: 'Precio Unitario', align: 'right', field: 'unitPrice' },
        { name: 'subtotal', label: 'Subtotal', align: 'right', field: 'subtotal' },
        { name: 'actions', label: 'Acciones', align: 'center', field: 'actions' }
      ]
    }
  },
  computed: {
    ...mapGetters('orderSupply', ['getLoading', 'getError']),
    ...mapGetters('purchaseorder', [
      'getSuppliers',
      'getSuppliersLoading',
      'getSuppliersError',
      'getSuppliersPage',
      'getSuppliersSize',
      'getSuppliersTotalElements',
      'getSuppliersTotalPages'
    ]),
    totalAmount() {
      if (!this.purchaseOrderForm.items) return 0
      return this.purchaseOrderForm.items.reduce((t, i) => t + (Number(i.quantity) * Number(i.unitPrice || 0)), 0)
    },
    canSave() {
      return !!this.purchaseOrderForm.providerNit && this.validItems.length > 0
    },
    validItems() {
      return (this.purchaseOrderForm.items || []).filter(i => {
        const hasName = !!(i.productName && String(i.productName).trim().length)
        const hasUnit = !!(i.unit && String(i.unit).trim().length)
        const qty = Number(i.quantity)
        const price = Number(i.unitPrice)
        const validQty = !isNaN(qty) && qty > 0
        const validPrice = !isNaN(price) && price >= 0
        return hasName && hasUnit && validQty && validPrice
      })
    },
    filteredProviderRows() {
      // Usar datos del store si existieran; fallback al mock inicial
      const items = (this.getSuppliers && this.getSuppliers.length) ? this.getSuppliers : this.providerRows
      const f = this.providerFilters
      const textIncludes = (a, b) => String(a || '').toLowerCase().includes(String(b || '').toLowerCase())
      // Filtro solo por nit y nombre según requerimiento
      return items.filter(p =>
        (!f.nit || textIncludes(p.nit, f.nit)) &&
        (!f.name || textIncludes(p.name || p.supplier || p.contactName, f.name))
      )
    }
  },
  created() {
    this.loadSupplyOrder()
    this.searchProviders(0);
  },
  watch: {
    supplierPage(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.onSupplierPage(newVal)
      }
    },
    supplierSize(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.onSupplierSize(newVal)
      }
    }
  },
  methods: {
    ...mapActions('orderSupply', ['fetchOrderById']),
    ...mapActions('purchaseorder', ['createPurchaseOrder', 'searchSuppliers']),
    addItem() {
      const newItem = {
        id: uid(),
        productName: '',
        unit: '',
        quantity: 1,
        unitPrice: 0
      }
      this.purchaseOrderForm.items = [...this.purchaseOrderForm.items, newItem]
    },
    removeItem(row) {
      const idToRemove = row && row.id
      this.purchaseOrderForm.items = (this.purchaseOrderForm.items || []).filter(i => i.id !== idToRemove)
    },
    formatDate(val) {
      if (!val) return ''
      return date.formatDate(new Date(val), 'DD/MM/YYYY')
    },
    formatMoney(val) {
      try { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: this.purchaseOrderForm.currency || 'COP' }).format(val || 0) } catch (e) { return `$${(val || 0).toLocaleString()}` }
    },
    selectProvider(provider) {
      if (!provider) return
      this.purchaseOrderForm.providerNit = provider.nit
      this.purchaseOrderForm.providerName = provider.name || provider.supplier || ''
      this.showProviderModal = false
    },
    clearProviderFilters() {
      this.providerFilters = { nit: '', name: '', address: '', phone: '', contact: '' }
    },
    async searchProviders(page = 0) {
      try {
        this.providerLoading = true
        await this.searchSuppliers({ name: this.providerFilters.name || '', nit: this.providerFilters.nit || '', page, size: this.supplierSize })
      } catch (e) {
        // handled by store
      } finally {
        this.providerLoading = false
      }
    },
    onSupplierPage(val) {
      this.supplierPage = val
      this.searchProviders((val - 1) < 0 ? 0 : (val - 1))
    },
    onSupplierSize(val) {
      this.supplierSize = val
      this.supplierPage = 1
      this.searchProviders(0)
    },
    async loadSupplyOrder() {
      try {
        this.loading = true
        this.error = null
        const order = await this.fetchOrderById(this.orderId)
        this.supplyOrder = order
        // Prefill
        this.prefill.code = order.code
        this.prefill.subdireccion = order.subdireccion
        this.prefill.description = order.description
        this.prefill.deliveryDate = this.formatDate(order && order.shippingAddress ? order.shippingAddress.deliveryDate : null)
        // Map items
        this.purchaseOrderForm.items = (order && order.details ? order.details : []).map(d => ({
          id: d.id || `${Date.now()}-${Math.random()}`,
          productName: d.productName,
          quantity: d.quantity,
          unit: d.unit,
          unitPrice: d.unitPrice
        }))
      } catch (e) {
        console.error(e)
        this.error = 'No fue posible cargar la orden. Intente nuevamente.'
      } finally {
        this.loading = false
      }
    },
    async handleSave() {
      try {
        this.saving = true
        const currentUser = this.$store.getters['auth/getUser']
        const payload = {
          supplyOrderId: this.supplyOrder.id,
          createdByUserId: currentUser,
          assignedToUserId: this.supplyOrder.procurementAssigneeUserId,
          supplierId: this.purchaseOrderForm.providerNit,
          items: this.validItems.map(i => ({
            id: i.id,
            productName: i.productName,
            quantity: String(i.quantity),
            unit: i.unit,
            unitPrice: String(i.unitPrice)
          }))
        }
        await this.createPurchaseOrder(payload)
        this.$q.notify({ type: 'positive', message: 'Orden de compra creada', icon: 'check' })
        this.$router.push({ name: 'ordenes-compra-lista' })
      } catch (e) {
        this.$q.notify({ type: 'negative', message: 'Error al guardar la OCS', icon: 'error' })
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped></style>
