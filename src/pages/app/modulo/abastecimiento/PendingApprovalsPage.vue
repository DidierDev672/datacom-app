<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-icon name="approval" size="md" color="primary" class="q-mr-md" />
      <div>
        <div class="text-h5 text-weight-bold">Órdenes Pendientes de Aprobación</div>
        <div class="text-subtitle2 text-grey-6">
          Gestiona las solicitudes que requieren tu aprobación
        </div>
      </div>
      <q-space />
      <!-- Badge con contador de pendientes -->
      <q-chip 
        v-if="pendingCount > 0"
        color="orange" 
        text-color="white" 
        icon="pending_actions"
        :label="`${pendingCount} pendientes`"
        size="md"
      />
    </div>
    
    <!-- Filtros mejorados para aprobaciones -->
    <div class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-md-3">
        <q-select
          v-model="priorityFilter"
          :options="priorityOptions"
          label="Filtrar por prioridad"
          clearable
          dense
          outlined
          emit-value
          map-options
          icon="priority_high"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-select
          v-model="departmentFilter"
          :options="departmentOptions"
          label="Filtrar por departamento"
          clearable
          dense
          outlined
          emit-value
          map-options
          icon="business"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-input
          v-model="amountFilter"
          label="Monto máximo"
          dense
          outlined
          prefix="$"
          type="number"
          icon="attach_money"
        />
      </div>
      <div class="col-12 col-md-3">
        <q-btn 
          color="primary" 
          icon="refresh" 
          label="Actualizar"
          @click="loadPendingApprovals"
          :loading="loading"
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-center q-pa-md">
      <q-spinner-dots size="50px" color="primary" />
      <span class="q-ml-md">Cargando órdenes pendientes...</span>
    </div>

    <!-- Error -->
    <div v-if="error" class="q-pa-md">
      <q-banner class="bg-negative text-white">
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        Error al cargar las órdenes: {{ error }}
        <template v-slot:action>
          <q-btn flat label="Reintentar" @click="loadPendingApprovals" />
        </template>
      </q-banner>
    </div>

    <!-- Tabla de órdenes pendientes -->
    <div v-if="!loading && !error">
      <q-table
        :data="filteredApprovals"
        :columns="columns"
        row-key="id"
        :pagination="pagination"
        :rows-per-page-options="[5, 10, 20, 50]"
        class="approval-table"
      >

      <!-- Agregar este template en la q-table -->
      <template v-slot:body-cell-id="props">
        <q-td :props="props" class="text-primary">
          <div class="row items-center no-wrap">
            <span class="text-weight-medium">{{ truncateUUID(props.row.id) }}</span>
            <q-btn 
              flat 
              dense 
              round 
              size="sm" 
              icon="content_copy" 
              @click="copyToClipboard(props.row.id)"
              class="q-ml-xs"
            >
              <q-tooltip>
                <div class="text-body2">UUID Completo:</div>
                <div class="text-weight-bold">{{ props.row.id }}</div>
                <div class="text-caption q-mt-xs">Click para copiar</div>
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>

        <!-- Columna de Prioridad -->
        <template v-slot:body-cell-priority="props">
          <q-td :props="props">
            <q-chip
              :color="getPriorityColor(props.row.priority)"
              text-color="white"
              size="sm"
              :icon="getPriorityIcon(props.row.priority)"
            >
              {{ props.row.priority }}
            </q-chip>
          </q-td>
        </template>

        <!-- Columna de Total con formato -->
        <template v-slot:body-cell-total="props">
          <q-td :props="props">
            <div class="text-weight-bold text-primary">
              ${{ calculateTotal(props.row.details) }}
            </div>
          </q-td>
        </template>

        <!-- Columna de Fecha Límite -->
        <template v-slot:body-cell-deadline="props">
          <q-td :props="props">
            <div class="row items-center">
              <q-icon 
                :name="getDeadlineIcon(props.row.shippingAddress.deliveryDate)" 
                :color="getDeadlineColor(props.row.shippingAddress.deliveryDate)" 
                size="xs" 
                class="q-mr-xs" 
              />
              <span :class="getDeadlineTextClass(props.row.shippingAddress.deliveryDate)">
                {{ formatDate(props.row.shippingAddress.deliveryDate) }}
              </span>
            </div>
          </q-td>
        </template>

        <!-- Columna de Acciones -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="row q-gutter-xs">
              <q-btn
                flat
                round
                color="primary"
                icon="visibility"
                size="sm"
                @click="viewOrderDetails(props.row)"
              >
                <q-tooltip>Ver detalles</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="positive"
                icon="check_circle"
                size="sm"
                @click="approveOrder(props.row)"
                :loading="props.row.processing"
              >
                <q-tooltip>Aprobar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="negative"
                icon="cancel"
                size="sm"
                @click="rejectOrder(props.row)"
                :loading="props.row.processing"
              >
                <q-tooltip>Rechazar</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Modal de detalles (reutilizando estructura similar) -->
    <q-dialog v-model="showDetailsDialog" persistent>
      <q-card style="min-width: 85vw; max-width: 95vw; max-height: 90vh;" class="approval-details-card">
        <!-- Header -->
        <q-card-section class="row items-center bg-primary text-white q-pa-lg">
          <q-icon name="approval" size="md" class="q-mr-md" />
          <div>
            <div class="text-h5 text-weight-bold">Revisar Orden de Abastecimiento</div>
            <div class="text-subtitle1 opacity-80">ID: {{ selectedOrder && selectedOrder.id }}</div>
          </div>
          <q-space />
          <q-btn 
            icon="close" 
            flat 
            round 
            dense 
            v-close-popup 
            class="text-white"
            size="md"
          />
        </q-card-section>

        <q-card-section class="q-pa-lg scroll" style="max-height: calc(90vh - 180px);">
          <div v-if="selectedOrder" class="q-px-xl">
            
            <!-- Estado de la orden y prioridad -->
            <div class="row justify-center q-mb-lg">
              <div class="col-auto q-mr-md">
                <q-chip
                  :color="getStatusColor(selectedOrder.status)"
                  text-color="white"
                  size="lg"
                  icon="flag"
                  class="text-weight-bold q-px-lg q-py-sm"
                >
                  {{ selectedOrder.statusDescription || selectedOrder.status }}
                </q-chip>
              </div>
              <div class="col-auto">
                <q-chip
                  :color="getPriorityColor(selectedOrder.priority)"
                  text-color="white"
                  size="lg"
                  :icon="getPriorityIcon(selectedOrder.priority)"
                  class="text-weight-bold q-px-lg q-py-sm"
                >
                  {{ selectedOrder.priority || 'NORMAL' }}
                </q-chip>
              </div>
            </div>

            <!-- Información principal en tarjetas -->
            <div class="row q-col-gutter-lg q-mb-lg">
              <!-- Información General -->
              <div class="col-12 col-md-6">
                <q-card class="full-height shadow-5 rounded-borders">
                  <q-card-section class="bg-blue-1">
                    <div class="row items-center q-mb-md">
                      <q-icon name="info" color="blue-7" size="sm" class="q-mr-sm" />
                      <span class="text-h6 text-blue-8 text-weight-bold">Información de la Solicitud</span>
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
                          <q-item-label caption>Solicitante</q-item-label>
                          <q-item-label class="text-weight-medium">{{ selectedOrder.requesterName || selectedOrder.ownerUserId }}</q-item-label>
                        </q-item-section>
                      </q-item>
                      
                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="business" color="grey-6" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label caption>Departamento</q-item-label>
                          <q-item-label class="text-weight-medium">{{ selectedOrder.department || selectedOrder.subdireccion }}</q-item-label>
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
                          <q-item-label class="text-weight-medium">{{ selectedOrder.warranty || 'N/A' }}</q-item-label>
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
                      <span class="text-h6 text-green-8 text-weight-bold">Información de Entrega</span>
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
                          <q-item-label class="text-weight-medium">{{ (selectedOrder.shippingAddress && selectedOrder.shippingAddress.contact) || 'N/A' }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="phone" color="grey-6" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label caption>Teléfono</q-item-label>
                          <q-item-label class="text-weight-medium">{{ (selectedOrder.shippingAddress && selectedOrder.shippingAddress.cellphone) || 'N/A' }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="location_on" color="grey-6" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label caption>Dirección</q-item-label>
                          <q-item-label class="text-weight-medium">{{ (selectedOrder.shippingAddress && selectedOrder.shippingAddress.address) || 'N/A' }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="event" color="grey-6" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label caption>Fecha de Entrega</q-item-label>
                          <q-item-label class="text-weight-medium">
                            {{ formatDate((selectedOrder.shippingAddress && selectedOrder.shippingAddress.deliveryDate) || selectedOrder.deadline) }}
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
                    <span class="text-h6 text-orange-8 text-weight-bold">Productos/Servicios Solicitados</span>
                  </div>
                  <q-chip 
                    color="orange-7" 
                    text-color="white" 
                    icon="shopping_cart"
                    :label="`${(selectedOrder.details && selectedOrder.details.length) || 0} item${((selectedOrder.details && selectedOrder.details.length) || 0) !== 1 ? 's' : ''}`"
                  />
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <q-table
                  :data="selectedOrder.details || []"
                  :columns="productColumns"
                  row-key="id"
                  flat
                  :pagination="{ rowsPerPage: 0 }"
                  class="modern-table"
                >
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

            <!-- Proyectos Asociados (si existen) -->
            <q-card v-if="selectedOrder.projects && selectedOrder.projects.length > 0" class="shadow-5 rounded-borders">
              <q-card-section class="bg-teal-1">
                <div class="row items-center justify-between">
                  <div class="row items-center">
                    <q-icon name="account_tree" color="teal-7" size="sm" class="q-mr-sm" />
                    <span class="text-h6 text-teal-8 text-weight-bold">Proyectos Asociados</span>
                  </div>
                  <q-chip 
                    color="teal-7" 
                    text-color="white" 
                    icon="work"
                    :label="`${selectedOrder.projects.length} proyecto${selectedOrder.projects.length !== 1 ? 's' : ''}`"
                  />
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <q-table
                  :data="selectedOrder.projects"
                  :columns="projectColumns"
                  row-key="id"
                  flat
                  :pagination="{ rowsPerPage: 0 }"
                  class="modern-table"
                />
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>

        <!-- Acciones de aprobación -->
        <q-card-section class="row q-gutter-md bg-grey-1 q-pa-lg">
          <q-space />
          <q-btn
            flat
            label="Cerrar"
            color="grey"
            v-close-popup
          />
          <q-btn
            color="negative"
            icon="cancel"
            label="Rechazar"
            @click="rejectOrderWithReason"
            :loading="rejecting"
          />
          <q-btn
            color="positive"
            icon="check_circle"
            label="Aprobar"
            @click="approveOrderConfirm"
            :loading="approving"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- Modal de rechazo con razón -->
    <q-dialog v-model="showRejectDialog" persistent>
      <q-card style="min-width: 400px;">
        <q-card-section>
          <div class="text-h6">Rechazar Orden</div>
        </q-card-section>
        <q-card-section>
          <q-input
            v-model="rejectionReason"
            type="textarea"
            label="Motivo del rechazo *"
            rows="4"
            outlined
            :rules="[val => !!val || 'Debe especificar un motivo']"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn 
            color="negative" 
            label="Rechazar" 
            @click="confirmReject"
            :loading="rejecting"
            :disable="!rejectionReason"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { date } from 'quasar'

export default {
  name: 'PendingApprovalsPage',
  data() {
    return {
      priorityFilter: null,
      departmentFilter: null,
      amountFilter: null,
      showDetailsDialog: false,
      showRejectDialog: false,
      selectedOrder: null,
      rejectionReason: '',
      approving: false,
      rejecting: false,
      pagination: {
        rowsPerPage: 10
      },

      priorityOptions: [
        { label: 'Todas las prioridades', value: null },
        { label: 'Urgente', value: 'URGENT' },
        { label: 'Alta', value: 'HIGH' },
        { label: 'Normal', value: 'NORMAL' },
        { label: 'Baja', value: 'LOW' }
      ],
      
      departmentOptions: [
        { label: 'Todos los departamentos', value: null },
        { label: 'Sistemas', value: 'SISTEMAS' },
        { label: 'Recursos Humanos', value: 'RRHH' },
        { label: 'Contabilidad', value: 'CONTABILIDAD' },
        { label: 'Operaciones', value: 'OPERACIONES' }
      ],

      columns: [
        {
          name: 'id',
          required: true,
          label: 'ID',
          align: 'left',
          field: 'id',
          sortable: true,
          style: 'width: 120px' // Limitar el ancho
        },
        {
          name: 'requester',
          label: 'Solicitante',
          align: 'left',
          field: 'ownerUserId',
          sortable: true
        },
        {
          name: 'description',
          label: 'Descripción',
          align: 'left',
          field: 'description',
          sortable: true
        },
        {
          name: 'nivelAprobacion',
          label: 'Nivel de Aprobación',
          align: 'center',
          field: 'nivelAprobacion',
          sortable: true
        },
        {
          name: 'total',
          label: 'Total',
          align: 'right',
          field: 'total',
          sortable: true
        },
        {
          name: 'deadline',
          label: 'Fecha Límite',
          align: 'center',
          field: row => row.shippingAddress.deliveryDate,
          sortable: true
        },
        {
          name: 'actions',
          label: 'Acciones',
          align: 'center',
          field: 'actions'
        }
      ],
      
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
      
      projectColumns: [
        {
          name: 'projectId',
          label: 'ID Proyecto',
          align: 'left',
          field: 'projectId'
        },
        {
          name: 'percentage',
          label: 'Porcentaje',
          align: 'right',
          field: 'percentage',
          format: val => `${val}%`
        }
      ]
    }
  },

  async created() {
    await this.loadPendingApprovals()
  },

  computed: {
    ...mapGetters("auth", ["getUser"]),
    ...mapGetters('orderSupply', ['getPendingApprovals', 'getLoading', 'getError']),
    
    loading() {
      return this.getLoading
    },
    
    error() {
      return this.getError
    },
    
    pendingApprovals() {
      return this.getPendingApprovals || []
    },
    
    pendingCount() {
      return this.pendingApprovals.length
    },
    
    filteredApprovals() {
      let filtered = [...this.pendingApprovals]
      
      if (this.priorityFilter) {
        filtered = filtered.filter(order => order.priority === this.priorityFilter)
      }
      
      if (this.departmentFilter) {
        filtered = filtered.filter(order => order.department === this.departmentFilter)
      }
      
      if (this.amountFilter) {
        filtered = filtered.filter(order => {
          const total = this.calculateTotalNumeric(order.details)
          return total <= parseFloat(this.amountFilter)
        })
      }
      
      return filtered
    }
  },

  methods: {
    ...mapActions('orderSupply', ['fetchPendingApprovals', 'approveOrderAction', 'rejectOrderAction']),
    
    async loadPendingApprovals() {
      try {
        const user = this.getUser
        if (user) {
          // El usuario es directamente el string del nombre de usuario
          const userId = user
          await this.fetchPendingApprovals(userId)
        } else {
          // Fallback con usuario por defecto
          await this.fetchPendingApprovals('enarvaez')
        }
      } catch (error) {
        console.error('Error cargando aprobaciones pendientes:', error)
      }
    },

    getStatusColor(status) {
      switch (status) {
        case 'APPROVED':
          return 'positive'
        case 'REJECTED':
          return 'negative'
        case 'IN_PROGRESS':
          return 'warning'
        default:
          return 'grey'
      }
    },

    getPriorityColor(priority) {
      switch (priority) {
        case 'URGENT': return 'red'
        case 'HIGH': return 'orange'
        case 'NORMAL': return 'blue'
        case 'LOW': return 'green'
        default: return 'grey'
      }
    },

    getPriorityIcon(priority) {
      switch (priority) {
        case 'URGENT': return 'warning'
        case 'HIGH': return 'priority_high'
        case 'NORMAL': return 'flag'
        case 'LOW': return 'low_priority'
        default: return 'flag'
      }
    },

    getDeadlineColor(deadline) {
      if (!deadline) return 'grey'
      const today = new Date()
      const deadlineDate = new Date(deadline)
      const diffDays = (deadlineDate - today) / (1000 * 60 * 60 * 24)
      
      if (diffDays < 0) return 'red'
      if (diffDays <= 2) return 'orange'
      if (diffDays <= 7) return 'amber'
      return 'green'
    },

    getDeadlineIcon(deadline) {
      if (!deadline) return 'schedule'
      const today = new Date()
      const deadlineDate = new Date(deadline)
      const diffDays = (deadlineDate - today) / (1000 * 60 * 60 * 24)
      
      if (diffDays < 0) return 'error'
      if (diffDays <= 2) return 'warning'
      return 'schedule'
    },

    getDeadlineTextClass(deadline) {
      const color = this.getDeadlineColor(deadline)
      return `text-${color}`
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A'
      return date.formatDate(new Date(dateString), 'DD/MM/YYYY')
    },

    calculateTotal(details) {
      if (!details || !Array.isArray(details)) return '0'
      const total = this.calculateTotalNumeric(details)
      return total.toLocaleString()
    },

    calculateTotalNumeric(details) {
      if (!details || !Array.isArray(details)) return 0
      return details.reduce((total, item) => {
        if (!item || typeof item.quantity !== 'number' || typeof item.unitPrice !== 'number') {
          return total
        }
        return total + (item.quantity * item.unitPrice)
      }, 0)
    },

    viewOrderDetails(order) {
      this.selectedOrder = order
      this.showDetailsDialog = true
    },

    async approveOrder(order) {

      try {
        this.$set(order, 'processing', true)

        let approverObject = order.approvers.find(approver => approver.userId === this.getUser)


      if (!approverObject) {
        this.$q.notify({
          type: 'negative',
          message: 'No tienes permisos para aprobar esta orden',
          icon: 'error'
        });
        return;
      }

        await this.approveOrderAction({
          orderId: order.id,
          approverId: approverObject.id,
        })
        
        this.$q.notify({
          type: 'positive',
          message: `Orden ${order.id} aprobada exitosamente`,
          icon: 'check_circle'
        })
        
        await this.loadPendingApprovals()
      } catch (error) {
        console.error('Error aprobando orden:', error)
        this.$q.notify({
          type: 'negative',
          message: 'Error al aprobar la orden',
          icon: 'error'
        })
      } finally {
        this.$set(order, 'processing', false)
      }
    },

    rejectOrder(order) {
      this.selectedOrder = order
      this.rejectionReason = ''
      this.showRejectDialog = true
    },

    async confirmReject() {
      try {
        this.rejecting = true
        let approverObject = this.selectedOrder.approvers.find(approver => approver.userId === this.getUser);
        await this.rejectOrderAction({
          orderId: this.selectedOrder.id,
          rejectionReason: this.rejectionReason,
          approverId: approverObject.id
        })
        
        this.$q.notify({
          type: 'positive',
          message: `Orden ${this.selectedOrder.id} rechazada`,
          icon: 'cancel'
        })
        
        this.showRejectDialog = false
        await this.loadPendingApprovals()
      } catch (error) {
        console.error('Error rechazando orden:', error)
        this.$q.notify({
          type: 'negative',
          message: 'Error al rechazar la orden',
          icon: 'error'
        })
      } finally {
        this.rejecting = false
      }
    },

    async approveOrderConfirm() {
      await this.approveOrder(this.selectedOrder)
      this.showDetailsDialog = false
    },

    async rejectOrderWithReason() {
      this.showDetailsDialog = false
      this.rejectOrder(this.selectedOrder)
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
  }
  }
}
</script>

<style scoped>
.approval-table {
  border-radius: 8px;
  overflow: hidden;
}

.approval-table thead th {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  font-weight: 600;
  color: #495057;
}

.approval-table tbody tr:hover {
  background-color: #f8f9fa;
  transition: background-color 0.2s ease;
}

.approval-details-card {
  border-radius: 12px;
  overflow: hidden;
}

.opacity-80 {
  opacity: 0.8;
}

.q-chip {
  transition: all 0.2s ease;
}

.q-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.q-btn {
  transition: all 0.2s ease;
}

.q-btn:hover {
  transform: translateY(-1px);
}
</style> 