<template>
  <div class="orders-page">
    <!-- Header de página -->
    <div class="page-header">
      <div class="page-header__left">
        <h1 class="page-title">Mis Órdenes</h1>
        <span class="page-subtitle">{{ filteredOrders.length }} registro{{ filteredOrders.length !== 1 ? 's' : '' }}</span>
      </div>
      <div class="page-header__right">
        <q-select
          v-model="statusFilter"
          :options="statusOptions"
          label="Estado"
          clearable dense outlined
          emit-value map-options
          class="filter-select"
          style="min-width: 180px"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="loading-state">
      <q-spinner-dots size="40px" color="primary" />
      <span>Cargando órdenes...</span>
    </div>

    <!-- Error -->
    <div v-if="error" class="q-pa-md">
      <q-banner class="error-banner">
        <template v-slot:avatar><q-icon name="error" /></template>
        Error al cargar las órdenes: {{ error }}
        <template v-slot:action>
          <q-btn flat label="Reintentar" @click="loadOrders" />
        </template>
      </q-banner>
    </div>

    <!-- Tabla optimizada -->
    <div v-if="!loading && !error">
      <q-table
        :data="filteredOrders"
        :columns="columns"
        row-key="id"
        :pagination="pagination"
        :rows-per-page-options="[10, 20, 50]"
        flat bordered
        class="orders-table"
      >
        <!-- Celda: Consecutivo + Descripción (agrupada) -->
        <template v-slot:body-cell-code="props">
          <q-td :props="props">
            <div class="cell-primary">{{ props.row.code }}</div>
            <div class="cell-secondary text-truncate" style="max-width:220px">{{ props.row.description }}</div>
          </q-td>
        </template>

        <!-- Celda: Responsables (Propietario + Abastecimiento agrupados) -->
        <template v-slot:body-cell-responsables="props">
          <q-td :props="props">
            <div class="cell-secondary">{{ props.row.ownerUserId }}</div>
            <div v-if="props.row.supplyUserId" class="cell-muted">
              <q-icon name="assignment_ind" size="12px" class="q-mr-xs" />{{ props.row.supplyUserId }}
            </div>
          </q-td>
        </template>

        <!-- Celda: Estado -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <div :class="['status-pill', getStatusClass(props.row.status)]">
              {{ props.row.statusDescription }}
            </div>
          </q-td>
        </template>

        <!-- Celda: Fecha -->
        <template v-slot:body-cell-deliveryDate="props">
          <q-td :props="props">
            <span class="cell-date">{{ formatDate(props.row.deliveryDate) }}</span>
          </q-td>
        </template>

        <!-- Celda: Total -->
        <template v-slot:body-cell-total="props">
          <q-td :props="props">
            <span class="cell-money">${{ new Intl.NumberFormat().format(props.row.amount) }}</span>
          </q-td>
        </template>

        <!-- Celda: Acciones -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn flat round dense icon="visibility" class="action-btn" @click="viewOrderDetails(props.row)">
              <q-tooltip>Ver detalle</q-tooltip>
            </q-btn>
            <q-btn flat round dense icon="edit" class="action-btn"
              :disable="props.row.status === 'PENDING_SUPPLY'" @click="editOrder(props.row)">
              <q-tooltip>Editar</q-tooltip>
            </q-btn>
            <q-btn v-if="isFullyApproved(props.row)" flat round dense icon="assignment_ind" class="action-btn"
              :disable="props.row.supplyUserId !== null" @click="openAssignModal(props.row)">
              <q-tooltip>Asignar</q-tooltip>
            </q-btn>
            <q-btn v-if="props.row.supplyUserId" flat round dense icon="shopping_cart" class="action-btn-accent"
              @click="goToCreateOCS(props.row)">
              <q-tooltip>Generar OCS</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Modal de detalles de la orden -->
    <q-dialog v-if="selectedOrder" v-model="showDetailsDialog" persistent>
      <q-card style="min-width: 85vw; max-width: 95vw; max-height: 90vh;" class="order-details-card">
        <!-- Header con gradiente -->
        <q-card-section class="row items-center bg-primary text-white q-pa-lg">
          <q-icon name="description" size="md" class="q-mr-md" />
          <div>
            <div class="text-h5 text-weight-bold">Detalles de la Orden</div>
            <div class="text-subtitle1 opacity-80">Solicitud: {{ selectedOrder && selectedOrder.code }}</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup class="text-white" size="md" />
        </q-card-section>

        <q-card-section class="q-pa-lg scroll" style="max-height: calc(90vh - 120px);">
          <div v-if="selectedOrder" class="q-px-xl">

            <!-- Tabs para organizar el contenido -->
            <q-tabs v-model="activeTab" dense class="text-grey q-mb-lg" active-color="primary" indicator-color="primary"
              align="justify">
              <q-tab name="details" icon="info" label="Detalles" />
              <q-tab name="audit" icon="history" label="Historial" />
            </q-tabs>

            <q-separator class="q-mb-lg" />

            <!-- Tab Panels -->
            <q-tab-panels v-model="activeTab" animated>
              <!-- Panel de Detalles -->
              <q-tab-panel name="details" class="q-pa-none">

                <!-- Estado de la orden - Badge destacado -->
                <div class="row justify-center q-mb-lg">
                  <q-chip :color="getStatusColor(selectedOrder.status)" text-color="white" size="lg" icon="flag"
                    class="text-weight-bold q-px-lg q-py-sm">
                    {{ selectedOrder.statusDescription }}
                  </q-chip>
                </div>

                <!-- Información principal en tarjetas -->
                <div class="row q-col-gutter-lg q-mb-lg">
                  <!-- Información General -->
                  <div class="col-12 col-md-6">
                    <q-card class="full-height shadow-5 rounded-borders">
                      <q-card-section class="bg-blue-1">
                        <div class="row items-center q-mb-md">
                          <q-icon name="info" color="blue-7" size="sm" class="q-mr-sm" />
                          <span class="text-h6 text-blue-8 text-weight-bold">Información General</span>
                        </div>
                      </q-card-section>
                      <q-separator />
                      <q-card-section>
                        <q-list dense>
                          <q-item>
                            <q-item-section avatar>
                              <q-icon name="edit_document" color="grey-6" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label caption>Solicitud</q-item-label>
                              <q-item-label class="text-weight-medium">{{ selectedOrder.code }}</q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item>
                            <q-item-section avatar>
                              <q-icon name="business" color="grey-6" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label caption>Subdirección</q-item-label>
                              <q-item-label class="text-weight-medium">{{ selectedOrder.subdireccion }}</q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item>
                            <q-item-section avatar>
                              <q-icon name="description" color="grey-6" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label caption>Descripción</q-item-label>
                              <q-item-label class="text-weight-medium">{{ selectedOrder.description }}</q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item>
                            <q-item-section avatar>
                              <q-icon name="approval" color="grey-6" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label caption>Nivel de Aprobación</q-item-label>
                              <q-item-label class="text-weight-medium">{{ selectedOrder.approvalLevelDescription
                              }}</q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item>
                            <q-item-section avatar>
                              <q-icon name="note" color="grey-6" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label caption>Observaciones</q-item-label>
                              <q-item-label class="text-weight-medium">{{ selectedOrder.notes || 'N/A' }}</q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item>
                            <q-item-section avatar>
                              <q-icon name="security" color="grey-6" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label caption>Garantías</q-item-label>
                              <q-item-label class="text-weight-medium">{{ selectedOrder.warranty || 'N/A'
                              }}</q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card-section>
                    </q-card>
                  </div>

                  <!-- Dirección de Entrega -->
                  <div class="col-12 col-md-6">
                    <q-card class="full-height shadow-5 rounded-borders">
                      <q-card-section class="bg-green-1">
                        <div class="row items-center q-mb-md">
                          <q-icon name="local_shipping" color="green-7" size="sm" class="q-mr-sm" />
                          <span class="text-h6 text-green-8 text-weight-bold">Dirección de Entrega</span>
                        </div>
                      </q-card-section>
                      <q-separator />
                      <q-card-section>
                        <q-list dense>
                          <q-item>
                            <q-item-section avatar>
                              <q-icon name="person" color="grey-6" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label caption>Contacto</q-item-label>
                              <q-item-label class="text-weight-medium">{{ selectedOrder.shippingAddress.contact
                              }}</q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item>
                            <q-item-section avatar>
                              <q-icon name="phone" color="grey-6" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label caption>Teléfono</q-item-label>
                              <q-item-label class="text-weight-medium">{{ selectedOrder.shippingAddress.cellphone
                              }}</q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item>
                            <q-item-section avatar>
                              <q-icon name="location_on" color="grey-6" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label caption>Dirección</q-item-label>
                              <q-item-label class="text-weight-medium">{{ selectedOrder.shippingAddress.address
                              }}</q-item-label>
                            </q-item-section>
                          </q-item>

                          <q-item>
                            <q-item-section avatar>
                              <q-icon name="event" color="grey-6" />
                            </q-item-section>
                            <q-item-section>
                              <q-item-label caption>Fecha de Entrega</q-item-label>
                              <q-item-label class="text-weight-medium">
                                {{ formatDate(selectedOrder.shippingAddress.deliveryDate) }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-card-section>
                    </q-card>
                  </div>
                </div>

                <!-- Detalles de productos -->
                <q-card class="shadow-5 rounded-borders q-mb-lg">
                  <q-card-section class="bg-orange-1">
                    <div class="row items-center justify-between">
                      <div class="row items-center">
                        <q-icon name="inventory" color="orange-7" size="sm" class="q-mr-sm" />
                        <span class="text-h6 text-orange-8 text-weight-bold">Productos/Servicios</span>
                      </div>
                      <q-chip color="orange-7" text-color="white" icon="shopping_cart"
                        :label="`${selectedOrder.details.length} item${selectedOrder.details.length !== 1 ? 's' : ''}`" />
                    </div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section>
                    <q-table :data="selectedOrder.details" :columns="productColumns" row-key="id" flat
                      :pagination="{ rowsPerPage: 0 }" class="modern-table">
                      <template v-slot:bottom>
                        <div class="row full-width bg-grey-1 q-pa-md rounded-borders">
                          <div class="col-12 text-right">
                            <div class="row items-center justify-end">
                              <q-icon name="calculate" color="primary" size="sm" class="q-mr-sm" />
                              <span class="text-h5 text-weight-bold text-primary">
                                Total: ${{ calculateTotal(selectedOrder.details) }}
                              </span>
                            </div>
                          </div>
                        </div>
                      </template>
                    </q-table>
                  </q-card-section>
                </q-card>

                <!-- Aprobadores -->
                <q-card class="shadow-5 rounded-borders q-mb-lg">
                  <q-card-section class="bg-purple-1">
                    <div class="row items-center justify-between">
                      <div class="row items-center">
                        <q-icon name="how_to_reg" color="purple-7" size="sm" class="q-mr-sm" />
                        <span class="text-h6 text-purple-8 text-weight-bold">Proceso de Aprobación</span>
                      </div>
                      <q-chip :color="getApprovalStatusColor(selectedOrder.approvers)" text-color="white"
                        icon="verified_user" :label="getApprovalStatusText(selectedOrder.approvers)" />
                    </div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section>
                    <q-table :data="selectedOrder.approvers" :columns="approverColumns" row-key="id" flat
                      :pagination="{ rowsPerPage: 0 }" class="modern-table">
                      <template v-slot:body-cell-approved="props">
                        <q-td :props="props">
                          <q-chip
                            :color="props.row.approved ? 'positive' : props.row.approvalDate ? 'negative' : 'orange'"
                            text-color="white" size="sm"
                            :icon="props.row.approved ? 'check_circle' : props.row.approvalDate ? 'cancel' : 'schedule'">
                            {{ props.row.approved ? 'Aprobado' : props.row.approvalDate ? 'Rechazado' : 'Pendiente' }}
                            <q-tooltip v-if="props.row.approved === false && props.row.approvalDate">
                              {{ props.row.rejectionReason }}
                            </q-tooltip>
                          </q-chip>
                        </q-td>
                      </template>
                      <template v-slot:body-cell-approvalDate="props">
                        <q-td :props="props">
                          <div class="row items-center">
                            <q-icon :name="props.row.approvalDate ? 'event_available' : 'event_busy'"
                              :color="props.row.approvalDate ? 'positive' : 'grey'" size="xs" class="q-mr-xs" />
                            {{ props.row.approvalDate ? formatDate(props.row.approvalDate) : 'Pendiente' }}
                          </div>
                        </q-td>
                      </template>
                      <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                          <q-btn v-if="props.row.approved === false && props.row.approvalDate" flat round
                            color="primary" icon="refresh" size="sm" @click="openReactivateDialog(props.row)">
                            <q-tooltip>Reactivar orden</q-tooltip>
                          </q-btn>
                        </q-td>
                      </template>
                    </q-table>
                  </q-card-section>
                </q-card>

                <!-- Proyectos -->
                <q-card class="shadow-5 rounded-borders">
                  <q-card-section class="bg-teal-1">
                    <div class="row items-center justify-between">
                      <div class="row items-center">
                        <q-icon name="account_tree" color="teal-7" size="sm" class="q-mr-sm" />
                        <span class="text-h6 text-teal-8 text-weight-bold">Plan de Abastecimiento</span>
                      </div>
                      <q-chip color="teal-7" text-color="white" icon="work"
                        :label="`${selectedOrder.planItems.length} proyecto${selectedOrder.planItems.length !== 1 ? 's' : ''}`" />
                    </div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section>
                    <q-table :data="selectedOrder.planItems" :columns="projectColumns" row-key="id" flat
                      :pagination="{ rowsPerPage: 0 }" class="modern-table" />
                  </q-card-section>
                </q-card>
              </q-tab-panel>

              <!-- Panel de Historial de Auditoría -->
              <q-tab-panel name="audit" class="q-pa-none">
                <q-card class="shadow-5 rounded-borders">
                  <q-card-section class="bg-indigo-1">
                    <div class="row items-center">
                      <q-icon name="history" color="indigo-7" size="sm" class="q-mr-sm" />
                      <span class="text-h6 text-indigo-8 text-weight-bold">Historial de Cambios</span>
                    </div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="q-pa-none">
                    <audit-history-timeline :audit-entries="auditHistory" :loading="auditLoading" :error="auditError"
                      @retry="loadAuditHistory" />
                  </q-card-section>
                </q-card>
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal asignar orden -->
    <asignar-orden-form v-if="showAssignDialog && orderForAssignment" :order-id="orderForAssignment.id"
      :order-code="orderForAssignment.code" :value="showAssignDialog" @close="showAssignDialog = false"
      @assigned="handleAssigned" />

    <!-- Modal reactivar orden -->
    <q-dialog v-model="showReactivateDialog" persistent>
      <q-card style="min-width: 400px;">
        <q-card-section class="row items-center bg-primary text-white">
          <q-icon name="refresh" size="md" class="q-mr-md" />
          <div>
            <div class="text-h6">Reactivar Orden</div>
            <div class="text-subtitle2">Indique el motivo para reactivar la orden</div>
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-input v-model="reactivateForm.note" type="textarea" label="Motivo para la reactivación *" outlined rows="4"
            :rules="[val => val && val.length > 0 || 'El motivo es requerido']"
            hint="Describa el motivo por el cual se reactivará esta orden" />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey-7" v-close-popup />
          <q-btn label="Reactivar" color="primary" icon="refresh"
            :disable="!reactivateForm.note || reactivateForm.note.trim().length === 0" @click="handleReactivateOrder" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { date } from 'quasar'
import axios from 'axios'
import { URL_API } from 'src/utils/config'
import AsignarOrdenForm from 'components/abastecimiento/AsignarOrdenForm.vue'
import AuditHistoryTimeline from 'components/abastecimiento/AuditHistoryTimeline.vue'

export default {
  name: 'OrdersList',
  components: { AsignarOrdenForm, AuditHistoryTimeline },
  data() {
    return {
      statusFilter: null,
      showDetailsDialog: false,
      selectedOrder: null,
      orderForAssignment: null,
      showAssignDialog: false,
      showReactivateDialog: false,
      reactivateForm: {
        approverId: null,
        note: ''
      },
      activeTab: 'details',
      auditHistory: [],
      auditLoading: false,
      auditError: null,
      pagination: {
        rowsPerPage: 10
      },

      productColumns: [
        {
          name: 'productName',
          label: 'Producto/Servicio',
          align: 'left',
          field: 'productName'
        },
        {
          name: 'quantity',
          label: 'Cantidad',
          align: 'center',
          field: 'quantity'
        },
        {
          name: 'unit',
          label: 'Unidad',
          align: 'center',
          field: 'unit'
        },
        {
          name: 'unitPrice',
          label: 'Precio Unitario',
          align: 'right',
          field: 'unitPrice',
          format: val => val ? `$${val.toLocaleString()}` : '$0'
        },
        {
          name: 'subtotal',
          label: 'Subtotal',
          align: 'right',
          field: row => row.quantity * row.unitPrice,
          format: val => val ? `$${val.toLocaleString()}` : '$0'
        }
      ],
      approverColumns: [
        {
          name: 'userId',
          label: 'Usuario',
          align: 'left',
          field: 'userId'
        },
        {
          name: 'userPosition',
          label: 'Cargo',
          align: 'left',
          field: 'userPosition'
        },
        {
          name: 'approved',
          label: 'Estado',
          align: 'center',
          field: 'approved'
        },
        {
          name: 'approvalDate',
          label: 'Fecha de Aprobación',
          align: 'center',
          field: 'approvalDate'
        },
        {
          name: 'actions',
          label: 'Acciones',
          align: 'center',
          field: 'actions'
        }
      ],
      projectColumns: [
        {
          name: 'planItemDescription',
          label: 'ID Proyecto',
          align: 'left',
          field: 'planItemDescription'
        },
        {
          name: 'percentage',
          label: 'Porcentaje',
          align: 'right',
          field: 'percentage',
          format: val => `${val}%`
        },
        {
          name: 'allocatedAmount',
          label: 'Monto Asignado',
          align: 'right',
          field: 'allocatedAmount'
        }
      ],
      statusOptions: [
        { label: 'Todos', value: null },
        { label: 'Aprobada', value: 'APPROVED' },
        { label: 'Rechazada', value: 'REJECTED' },
        { label: 'En Progreso', value: 'IN_PROGRESS' }
      ],
      columns: [
        { name: 'code', required: true, label: 'Solicitud', align: 'left', field: 'code', sortable: true },
        { name: 'responsables', label: 'Responsables', align: 'left', field: 'ownerUserId', sortable: true },
        { name: 'status', label: 'Estado', align: 'center', field: 'status', sortable: true },
        { name: 'deliveryDate', label: 'Entrega', align: 'center', field: row => row.shippingAddress && row.shippingAddress.deliveryDate, sortable: true },
        { name: 'total', label: 'Total', align: 'right', field: 'total', sortable: true },
        { name: 'actions', label: '', align: 'center', field: 'actions' }
      ]
    }
  },
  watch: {
    async activeTab(newTab) {
      if (newTab === 'audit' && this.selectedOrder && this.auditHistory.length === 0) {
        await this.loadAuditHistory()
      }
    },
    showDetailsDialog(newVal) {
      if (!newVal) {
        // Reset audit data when dialog is closed
        this.auditHistory = []
        this.auditError = null
        this.auditLoading = false
        this.activeTab = 'details'
      }
    }
  },
  async created() {
    await this.loadOrders();
  },
  computed: {
    ...mapGetters("auth", ["getUser"]),
    ...mapGetters('orderSupply', ['getUserOrders', 'getLoading', 'getError']),
    loading() {
      return this.getLoading
    },
    error() {
      return this.getError
    },
    filteredOrders() {
      const orders = this.getUserOrders || []

      // Si no hay filtro, mostrar todas las órdenes
      if (!this.statusFilter) {
        return orders
      }

      // Filtrar por estado seleccionado
      return orders.filter(order => order && order.status === this.statusFilter)
    }
  },
  methods: {
    ...mapActions('orderSupply', ['fetchUserOrders', 'assignOrderToUser', 'fetchOrderById', 'fetchOrderAuditHistory', 'reactivateOrder']),
    goToCreateOCS(order) {
      if (!order || !order.id) return
      this.$router.push({ name: 'crear-ocs', params: { orderId: order.id } })
    },
    async exportOrder(order) {
      try {
        if (!order || !order.id) return
        this.$q.loading.show({ message: 'Generando archivo...' })
        const response = await axios.get(`${URL_API}/api/supply-order/${order.id}/export`, {
          responseType: 'arraybuffer'
        })

        const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        const filename = `supply-order-${order.code || order.id}.xls`
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        this.$q.notify({ type: 'positive', message: 'Descarga iniciada', icon: 'file_download' })
      } catch (error) {
        console.error('Error exportando orden:', error)
        this.$q.notify({ type: 'negative', message: 'No fue posible exportar la orden', icon: 'error' })
      } finally {
        this.$q.loading.hide()
      }
    },
    async loadOrders() {
      try {
        const user = this.getUser
        if (user) {
          // El usuario es directamente el string del nombre de usuario
          const userId = user
          await this.fetchUserOrders(userId)
        } else {
          // Fallback con usuario por defecto
          //await this.fetchUserOrders('enarvaez')
        }
      } catch (error) {
        console.error('Error cargando órdenes:', error)
      }
    },
    getStatusColor(status) {
      switch (status) {
        case 'PENDING_SUPPLY':
          return 'positive'
        case 'REJECTED':
          return 'negative'
        case 'CANCELED':
          return 'negative'
        case 'PENDING_AUTHORIZATION':
          return 'warning'
        default:
          return 'grey'
      }
    },
    getStatusClass(status) {
      const classes = {
        'PENDING_SUPPLY': 'status--success',
        'APPROVED': 'status--success',
        'REJECTED': 'status--danger',
        'CANCELED': 'status--danger',
        'PENDING_AUTHORIZATION': 'status--warning',
        'IN_PROGRESS': 'status--info'
      };
      return classes[status] || 'status--default';
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return date.formatDate(new Date(dateString), 'DD/MM/YYYY')
    },
    calculateTotal(details) {
      if (!details || !Array.isArray(details)) return '0'
      try {
        return details.reduce((total, item) => {
          if (!item || typeof item.quantity !== 'number' || typeof item.unitPrice !== 'number') {
            return total
          }
          return total + (item.quantity * item.unitPrice)
        }, 0).toLocaleString()
      } catch (error) {
        console.error('Error calculando total:', error)
        return '0'
      }
    },
    async viewOrderDetails(order) {
      this.selectedOrder = await this.fetchOrderById(order.id);
      this.activeTab = 'details' // Reset to details tab
      this.showDetailsDialog = true
    },

    async loadAuditHistory() {
      if (!this.selectedOrder || !this.selectedOrder.id) return

      this.auditLoading = true
      this.auditError = null

      try {
        this.auditHistory = await this.fetchOrderAuditHistory(this.selectedOrder.id)
      } catch (error) {
        console.error('Error loading audit history:', error)
        this.auditError = error.message || 'Error al cargar el historial de auditoría'
      } finally {
        this.auditLoading = false
      }
    },
    editOrder(order) {
      this.$router.push({
        name: 'editar-orden-abastecimiento',
        params: { orderId: order.id }
      })
    },
    getApprovalStatusColor(approvers) {
      if (!approvers || !Array.isArray(approvers) || approvers.length === 0) {
        return 'grey'
      }

      const totalApprovers = approvers.length
      const approvedCount = approvers.filter(approver => approver.approved).length

      if (approvedCount === totalApprovers) {
        return 'positive' // Todos aprobados
      } else if (approvedCount > 0) {
        return 'warning' // Parcialmente aprobado
      } else {
        return 'negative' // Ninguno aprobado
      }
    },
    getApprovalStatusText(approvers) {
      if (!approvers || !Array.isArray(approvers) || approvers.length === 0) {
        return 'Sin aprobadores'
      }

      const totalApprovers = approvers.length
      const approvedCount = approvers.filter(approver => approver.approved).length

      if (approvedCount === totalApprovers) {
        return 'Completamente Aprobado'
      } else if (approvedCount > 0) {
        return `${approvedCount}/${totalApprovers} Aprobado`
      } else {
        return 'Pendiente de Aprobación'
      }
    },
    truncateUUID(uuid) {
      if (!uuid) return 'N/A'
      // Mostrar solo los primeros 8 caracteres
      return uuid.substring(0, 8).toUpperCase()
    },

    async copyToClipboard(text) {
      try {
        await navigator.clipboard.writeText(text)
        this.$q.notify({
          type: 'positive',
          message: 'UUID copiado al portapapeles',
          icon: 'content_copy',
          timeout: 2000
        })
      } catch (error) {
        console.error('Error al copiar:', error)
        this.$q.notify({
          type: 'negative',
          message: 'Error al copiar UUID',
          icon: 'error'
        })
      }
    },

    isFullyApproved(order) {
      return order.status === 'PENDING_SUPPLY';
    },
    openAssignModal(order) {
      console.log('Opening assign modal for order:', order);
      this.orderForAssignment = order;
      this.showAssignDialog = true
    },
    openReactivateDialog(approver) {
      this.reactivateForm.approverId = approver.id
      this.reactivateForm.note = ''
      this.showReactivateDialog = true
    },
    async handleReactivateOrder() {
      try {
        const currentUser = this.getUser
        await this.reactivateOrder({
          orderId: this.selectedOrder.id,
          approverId: this.reactivateForm.approverId,
          reactivatedByUserId: currentUser,
          note: this.reactivateForm.note
        })

        this.$q.notify({ type: 'positive', message: 'Orden reactivada exitosamente', icon: 'check_circle' })
        this.showReactivateDialog = false
        this.showDetailsDialog = false
        await this.loadOrders()
      } catch (error) {
        this.$q.notify({ type: 'negative', message: 'Error al reactivar la orden', icon: 'error' })
      }
    },
    async handleAssigned({ username }) {
      console.log('Order assigned to:', username);
      try {
        await this.assignOrderToUser({ orderId: this.orderForAssignment.id, username })
        this.$q.notify({ type: 'positive', message: 'Orden asignada exitosamente', icon: 'check' })
        this.showAssignDialog = false
        await this.loadOrders()
        //this.goToCreateOCS(this.orderForAssignment)
      } catch (e) {
        this.$q.notify({ type: 'negative', message: 'Error al asignar la orden', icon: 'error' })
      }
    }
  }
}
</script>

<style scoped>
/* ===== Page Layout ===== */
.orders-page {
  padding: 24px;
  font-family: 'Inter', sans-serif;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #4A5A63;
  margin: 0;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 13px;
  font-weight: 500;
  color: #A7B1B7;
  margin-top: 2px;
  display: block;
}

/* ===== Loading ===== */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px;
  color: #6B7C85;
  font-size: 14px;
}

.error-banner {
  background: #FEE2E2;
  color: #991B1B;
  border-radius: 8px;
}

/* ===== Table ===== */
.orders-table {
  border-radius: 10px;
  overflow: hidden;
}

::v-deep .orders-table thead th {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #6B7C85;
  padding: 14px 16px;
  background: #F5F7FA;
  border-bottom: 1px solid #E8ECEF;
}

::v-deep .orders-table tbody td {
  padding: 12px 16px;
  font-size: 14px;
  color: #4A5A63;
  border-bottom: 1px solid #F0F2F4;
}

::v-deep .orders-table tbody tr:hover td {
  background: #F9FAFB;
}

/* ===== Cell Hierarchy ===== */
.cell-primary {
  font-size: 14px;
  font-weight: 600;
  color: #4A5A63;
  line-height: 1.3;
}

.cell-secondary {
  font-size: 13px;
  font-weight: 400;
  color: #6B7C85;
  line-height: 1.4;
}

.cell-muted {
  font-size: 12px;
  color: #A7B1B7;
  display: flex;
  align-items: center;
  margin-top: 2px;
}

.cell-date {
  font-size: 13px;
  font-weight: 500;
  color: #6B7C85;
}

.cell-money {
  font-size: 14px;
  font-weight: 600;
  color: #4A5A63;
  font-variant-numeric: tabular-nums;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== Status Pills ===== */
.status-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.status--success { background: #DCFCE7; color: #16A34A; }
.status--warning { background: #FEF9C3; color: #CA8A04; }
.status--danger  { background: #FEE2E2; color: #DC2626; }
.status--info    { background: #DBEAFE; color: #2563EB; }
.status--default { background: #F3F4F6; color: #6B7280; }

/* ===== Action Buttons ===== */
.action-btn {
  width: 32px !important;
  height: 32px !important;
  color: #A7B1B7 !important;
  transition: all 0.2s ease;
}

.action-btn:hover {
  color: #4A5A63 !important;
  background: #F0F2F4 !important;
}

.action-btn-accent {
  width: 32px !important;
  height: 32px !important;
  color: #4E9C4C !important;
  transition: all 0.2s ease;
}

.action-btn-accent:hover {
  background: rgba(78, 156, 76, 0.08) !important;
}

::v-deep .action-btn .q-icon,
::v-deep .action-btn-accent .q-icon {
  font-size: 18px;
}

/* ===== Filter ===== */
::v-deep .filter-select .q-field__control {
  border-radius: 8px;
  height: 40px;
}

/* ===== Modal (preserved) ===== */
.order-details-card {
  border-radius: 12px;
  overflow: hidden;
}

.shadow-5 {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.rounded-borders {
  border-radius: 8px;
  overflow: hidden;
}

.modern-table {
  border-radius: 8px;
  overflow: hidden;
}

.modern-table thead th {
  background: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  color: #37474f;
  border-bottom: 2px solid #e0e0e0;
}

.modern-table tbody tr:hover {
  background-color: #f8f9fa;
}

.opacity-80 {
  opacity: 0.8;
}

.bg-primary {
  background: linear-gradient(135deg, #84B24D 0%, #75AF7E 50%, #4E9C4C 100%);
}
</style>