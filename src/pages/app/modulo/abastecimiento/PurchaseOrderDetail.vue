<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn flat dense icon="arrow_back" label="Volver" @click="$router.back()" />
      <q-space />
      <div class="text-h6">Detalle Orden de Compra</div>
      <q-space />
      <q-btn flat icon="print" label="Imprimir" @click="handlePrint" :loading="printing" />
      <q-btn v-if="po && po.status != 'CLOSED'" color="negative" class="q-ml-sm" icon="check_circle" label="Cerrar orden"
        @click="confirmClose" :loading="closing" />
    </div>

    <q-banner v-if="loading" class="q-mb-md">
      <q-spinner-dots size="24px" class="q-mr-sm" /> Cargando orden de compra...
    </q-banner>
    <q-banner v-if="error" class="bg-negative text-white q-mb-md">
      <q-icon name="error" class="q-mr-sm" /> {{ error }}
    </q-banner>

    <div v-if="po" class="q-gutter-y-md">
      <q-card class="q-mb-md">
        <q-card-section class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-6">
            <div class="text-h6 q-mb-xs">{{ po.code }}</div>
            <div class="text-caption text-grey-7">Orden de compra</div>
          </div>
          <div class="col-12 col-md-6 flex justify-end">
            <q-chip :color="statusMeta.color" text-color="white" :icon="statusMeta.icon" class="q-mr-sm">
              {{ statusMeta.label }}
            </q-chip>
            <q-chip outline color="primary" icon="event">
              {{ formatDateTime(po.createdAt) }}
            </q-chip>
          </div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-3">
              <q-input dense outlined readonly label="Responsable" :value="po.assignedToUserId || '-'" />
            </div>
            <div class="col-12 col-md-3">
              <q-input dense outlined readonly label="Solicitante" :value="so.ownerUserId || '-'" />
            </div>
            <div class="col-12 col-md-3">
              <q-input dense outlined readonly label="Nivel de aprobación"
                :value="so.approvalLevelDescription || so.approvalLevel || '-'" />
            </div>
            <div class="col-12 col-md-3">
              <q-input dense outlined readonly label="Orden de suministro"
                :value="so.code || po.supplyOrderId || '-'" />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-card class="q-mb-md">
            <q-card-section class="bg-purple-1">
              <div class="text-subtitle1 text-purple-8">Proveedor</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6"><q-input dense outlined readonly label="Nombre"
                    :value="(sp && sp.name) || po.supplier || '-'" /></div>
                <div class="col-12 col-md-6"><q-input dense outlined readonly label="NIT"
                    :value="(sp && sp.nit) || po.supplierId || '-'" /></div>
                <div class="col-12 col-md-6"><q-input dense outlined readonly label="Contacto"
                    :value="(sp && sp.contactName) || '-'" /></div>
                <div class="col-12 col-md-6"><q-input dense outlined readonly label="Teléfono"
                    :value="(sp && sp.phone) || '-'" /></div>
                <div class="col-12 col-md-6"><q-input dense outlined readonly label="Correo"
                    :value="(sp && sp.email) || '-'" /></div>
                <div class="col-12 col-md-6"><q-input dense outlined readonly label="Dirección"
                    :value="(sp && sp.address) || '-'" /></div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card class="q-mb-md">
            <q-card-section class="bg-teal-1">
              <div class="text-subtitle1 text-teal-8">Envío</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12"><q-input dense outlined readonly label="Dirección"
                    :value="(so.shippingAddress && so.shippingAddress.address) || '-'" /></div>
                <div class="col-12 col-md-6"><q-input dense outlined readonly label="Contacto"
                    :value="(so.shippingAddress && so.shippingAddress.contact) || '-'" /></div>
                <div class="col-12 col-md-6"><q-input dense outlined readonly label="Celular"
                    :value="(so.shippingAddress && so.shippingAddress.cellphone) || '-'" /></div>
                <div class="col-12 col-md-6"><q-input dense outlined readonly label="Fecha de entrega"
                    :value="formatDate(so.shippingAddress && so.shippingAddress.deliveryDate)" /></div>
                <div class="col-12 col-md-6"><q-input dense outlined readonly label="Ciudad"
                    :value="(so.shippingAddress && so.shippingAddress.ciudad) || '-'" /></div>
              </div>
            </q-card-section>
          </q-card>
        </div>

      </div>

      <div class="row q-col-gutter-md">


        <div class="col-12 col-md-6">
          <q-card class="q-mb-md">
            <q-card-section class="bg-amber-1">
              <div class="text-subtitle1 text-amber-8">Plan y presupuesto</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="row q-col-gutter-md q-mb-sm">
                <div class="col-12 col-md-4">
                  <q-chip :color="so.linkedToPlan ? 'positive' : 'grey'" text-color="white" icon="link">
                    {{ so.linkedToPlan ? 'Vinculada a plan' : 'Sin plan' }}
                  </q-chip>
                </div>
                <div class="col-12 col-md-4">
                  <q-chip :color="so.amountValidForLevel ? 'positive' : 'negative'" text-color="white" icon="verified">
                    {{ so.amountValidForLevel ? 'Monto válido' : 'Monto no válido' }}
                  </q-chip>
                </div>
                <div class="col-12 col-md-4">
                  <q-input dense outlined readonly label="Total asignado al plan"
                    :value="formatMoney(so.totalPlanAllocatedAmount)" />
                </div>
              </div>
              <q-table v-if="Array.isArray(so.planItems) && so.planItems.length" :data="so.planItems"
                :columns="planColumns" row-key="id" flat :pagination="{ rowsPerPage: 0 }" />
            </q-card-section>
          </q-card>
        </div>

        <div class="col-12 col-md-6">
          <q-card class="q-mb-md">
            <q-card-section class="bg-blue-1">
              <div class="text-subtitle1 text-blue-8">Condiciones comerciales</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6"><q-input dense outlined readonly label="N° cotización"
                    :value="po.quotationNumber || '-'" /></div>
                <div class="col-12 col-md-6"><q-input dense outlined readonly label="Términos de pago"
                    :value="po.paymentTerms || '-'" /></div>
                <div class="col-12 col-md-6"><q-input dense outlined readonly label="Entrega acordada"
                    :value="formatDate(po.agreedDeliveryDate)" /></div>
              </div>
            </q-card-section>
          </q-card>
        </div>

      </div>

      <q-card class="q-mb-md">
        <q-card-section class="bg-green-1">
          <div class="text-subtitle1 text-green-8">Items</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-table :data="po.items || []" :columns="columns" row-key="id" flat :pagination="{ rowsPerPage: 0 }">
            <template v-slot:body-cell-unitPrice="props">
              <q-td :props="props">{{ formatMoney(props.row.unitPrice) }}</q-td>
            </template>
            <template v-slot:body-cell-subtotal="props">
              <q-td :props="props">{{ formatMoney((Number(props.row.quantity) || 0) * (Number(props.row.unitPrice) ||
                0)) }}</q-td>
            </template>
            <template v-slot:bottom>
              <div class="row full-width justify-end q-pa-sm">
                <div class="text-subtitle1 text-weight-bold">Total: {{ formatMoney(totalAmount) }}</div>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <q-card class="q-mb-md">
            <q-card-section class="bg-orange-1">
              <div class="text-subtitle1 text-orange-8">Aprobadores</div>
            </q-card-section>
            <q-separator />
            <q-card-section>
              <div v-if="Array.isArray(so.approvers) && so.approvers.length" class="column q-gutter-sm">
                <div v-for="ap in so.approvers" :key="ap.id" class="row items-center q-col-gutter-sm">
                  <div class="col-12 col-md-5">
                    <div class="text-body2 text-weight-medium">{{ ap.userPosition || 'Aprobador' }}</div>
                    <div class="text-caption text-grey-7">{{ ap.userId }} · {{ ap.email }}</div>
                  </div>
                  <div class="col-6 col-md-3">
                    <q-chip :color="ap.approved ? 'positive' : 'warning'" text-color="white"
                      :icon="ap.approved ? 'check' : 'hourglass_top'">
                      {{ ap.approved ? 'Aprobado' : 'Pendiente' }}
                    </q-chip>
                  </div>
                  <div class="col-6 col-md-4 text-right">
                    <span class="text-caption">{{ ap.approvalDate ? formatDateTime(ap.approvalDate) : '-' }}</span>
                  </div>
                </div>
              </div>
              <div v-else class="text-grey">Sin aprobadores</div>
            </q-card-section>
          </q-card>
        </div>
        <div class="col-12 col-md-6">
          <q-card class="q-mb-md">
            <q-card-section class="bg-grey-2">
              <div class="text-subtitle1 text-grey-8">Notas y descripción</div>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-gutter-sm">
              <q-field dense outlined stack-label label="Descripción de la solicitud">
                <template v-slot:control>
                  <div class="q-pt-xs">{{ so.description || '-' }}</div>
                </template>
              </q-field>
              <q-field dense outlined stack-label label="Notas del solicitante">
                <template v-slot:control>
                  <div class="q-pt-xs">{{ so.notes || '-' }}</div>
                </template>
              </q-field>
              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6"><q-input dense outlined readonly label="Garantía"
                    :value="so.warranty || '-'" />
                </div>
                <div class="col-12 col-md-6"><q-input dense outlined readonly label="Subdirección"
                    :value="so.subdireccion || '-'" /></div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>

    <q-dialog v-model="closeDialog">
      <q-card style="min-width:400px">
        <q-card-section class="row items-center">
          <q-icon name="warning" color="negative" class="q-mr-sm" />
          <div class="text-subtitle1">Confirmar cierre</div>
        </q-card-section>
        <q-card-section>
          ¿Desea cerrar esta orden de compra?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn color="negative" label="Cerrar orden" :loading="closing" @click="handleClose" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>

</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'PurchaseOrderDetail',
  props: { id: { type: String, required: true } },
  data() {
    return {
      columns: [
        { name: 'productName', label: 'Producto/Servicio', align: 'left', field: 'productName' },
        { name: 'unit', label: 'Unidad', align: 'center', field: 'unit' },
        { name: 'quantity', label: 'Cantidad', align: 'center', field: 'quantity' },
        { name: 'unitPrice', label: 'Precio Unitario', align: 'right', field: 'unitPrice' },
        { name: 'subtotal', label: 'Subtotal', align: 'right', field: 'subtotal' }
      ],
      planColumns: [
        { name: 'planItemDescription', label: 'Item del plan', align: 'left', field: 'planItemDescription' },
        { name: 'percentage', label: '%', align: 'right', field: 'percentage', format: (v) => `${Number(v || 0)}%` },
        { name: 'allocatedAmount', label: 'Asignado', align: 'right', field: 'allocatedAmount', format: (v) => this.formatMoney(v) },
      ],
      closeDialog: false,
      printing: false,
      closing: false,
    }
  },
  computed: {
    ...mapGetters('purchaseorder', ['getCurrent', 'getLoading', 'getError']),
    response() { return this.getCurrent || {} },
    po() {
      const r = this.response
      if (r && r.purchaseOrder) return r.purchaseOrder
      // fallback: API antiguo retorna la orden directamente
      if (r && (r.items || r.code || r.status)) return r
      return null
    },
    so() {
      const r = this.response
      if (r && r.supplyOrder) return r.supplyOrder
      return {}
    },
    sp() {
      const r = this.response
      if (r && r.supplier) return r.supplier
      return null
    },
    loading() { return this.getLoading },
    error() { return this.getError },
    totalAmount() {
      const items = (this.po && this.po.items) ? this.po.items : []
      return items.reduce((t, i) => t + (Number(i.quantity) || 0) * (Number(i.unitPrice) || 0), 0)
    },
    statusMeta() {
      const status = (this.po && this.po.status) ? String(this.po.status) : ''
      const map = {
        QUOTING: { label: 'En cotización', color: 'info', icon: 'request_quote' },
        OPEN: { label: 'Abierta', color: 'primary', icon: 'shopping_cart' },
        CLOSED: { label: 'Cerrada', color: 'grey-7', icon: 'lock' },
        REJECTED: { label: 'Rechazada', color: 'negative', icon: 'block' },
        APPROVED: { label: 'Aprobada', color: 'positive', icon: 'check_circle' },
      }
      return map[status] || { label: status || 'Sin estado', color: 'secondary', icon: 'label' }
    }
  },
  created() {
    this.load()
  },
  methods: {
    ...mapActions('purchaseorder', ['fetchPurchaseOrderById', 'closePurchaseOrder', 'printPurchaseOrder']),
    formatMoney(val) { try { return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(val || 0) } catch (e) { return `$${(val || 0).toLocaleString()}` } },
    formatDate(iso) {
      if (!iso) return '-'
      try { return new Date(iso).toLocaleDateString('es-CO', { year: 'numeric', month: 'short', day: '2-digit' }) } catch (e) { return '-' }
    },
    formatDateTime(iso) {
      if (!iso) return '-'
      try { return new Date(iso).toLocaleString('es-CO', { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' }) } catch (e) { return '-' }
    },
    async load() {
      await this.fetchPurchaseOrderById(this.id)
    },
    confirmClose() { this.closeDialog = true },
    async handleClose() {
      try {
        this.closing = true
        await this.closePurchaseOrder({ id: this.id })
        this.$q.notify({ type: 'positive', message: 'Orden cerrada', icon: 'check' })
        this.closeDialog = false
        this.$router.push({ name: 'ordenes-compra-lista' })
      } catch (e) {
        this.$q.notify({ type: 'negative', message: 'No se pudo cerrar la orden', icon: 'error' })
        this.$router.push({ name: 'ordenes-compra-lista' })
      } finally {
        this.closing = false
      }
    },
    async handlePrint() {
      try {
        this.printing = true
        const { blob, filename, contentType } = await this.printPurchaseOrder({ id: this.id, format: 'excel' })
        const safeNameBase = (this.po && (this.po.code || this.id)) || this.id
        const fallbackName = `purchase-order-${safeNameBase}.xls`
        const finalName = (filename && filename.trim()) ? filename.trim() : fallbackName
        const fileBlob = blob instanceof Blob ? blob : new Blob([blob], { type: contentType || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = window.URL.createObjectURL(fileBlob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', finalName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      } catch (e) {
        this.$q.notify({ type: 'negative', message: 'No se pudo exportar la orden a Excel', icon: 'error' })
      } finally {
        this.printing = false
      }
    }
  }
}
</script>

<style scoped>
.text-weight-medium {
  font-weight: 600;
}
</style>
