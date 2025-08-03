<template>
  <div class="q-pa-md">
    <div class="text-h5 q-mb-md">Mis Órdenes de Abastecimiento</div>
    
    <!-- Filtros -->
    <div class="row q-mb-md">
      <div class="col-12 col-md-4">
        <q-select
          v-model="statusFilter"
          :options="statusOptions"
          label="Filtrar por estado"
          clearable
          dense
          outlined
          emit-value
          map-options
        />
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex flex-center q-pa-md">
      <q-spinner-dots size="50px" color="primary" />
      <span class="q-ml-md">Cargando órdenes...</span>
    </div>

    <!-- Error -->
    <div v-if="error" class="q-pa-md">
      <q-banner class="bg-negative text-white">
        <template v-slot:avatar>
          <q-icon name="error" />
        </template>
        Error al cargar las órdenes: {{ error }}
        <template v-slot:action>
          <q-btn flat label="Reintentar" @click="loadOrders" />
        </template>
      </q-banner>
    </div>

    <!-- Tabla de órdenes -->
    <div v-if="!loading && !error">
      <q-table
        :data="filteredOrders"
        :columns="columns"
        row-key="id"
        :pagination="pagination"
        :rows-per-page-options="[5, 10, 20, 50]"
        class="my-sticky-header-table"
      >

      


        <!-- Columna de Estado -->
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-chip
              :color="getStatusColor(props.row.status)"
              text-color="white"
              size="sm"
            >
              {{ props.row.statusDescription }}
            </q-chip>
          </q-td>
        </template>

        <!-- Columna de Fecha de Entrega -->
        <template v-slot:body-cell-deliveryDate="props">
          <q-td :props="props">
            {{ formatDate(props.row.shippingAddress.deliveryDate) }}
          </q-td>
        </template>

        <!-- Columna de Total -->
        <template v-slot:body-cell-total="props">
          <q-td :props="props">
            ${{ calculateTotal(props.row.details) }}
          </q-td>
        </template>

        <!-- Columna de Acciones -->
        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <q-btn
              flat
              round
              color="primary"
              icon="visibility"
              @click="viewOrderDetails(props.row)"
            >
              <q-tooltip>Ver detalles</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <!-- Modal de detalles de la orden -->
    <q-dialog v-model="showDetailsDialog" persistent>
      <q-card style="min-width: 85vw; max-width: 95vw; max-height: 90vh;" class="order-details-card">
        <!-- Header con gradiente -->
        <q-card-section class="row items-center bg-primary text-white q-pa-lg">
          <q-icon name="description" size="md" class="q-mr-md" />
          <div>
            <div class="text-h5 text-weight-bold">Detalles de la Orden</div>
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

        <q-card-section class="q-pa-lg scroll" style="max-height: calc(90vh - 120px);">
          <div v-if="selectedOrder" class="q-px-xl">
            
            <!-- Estado de la orden - Badge destacado -->
            <div class="row justify-center q-mb-lg">
              <q-chip
                :color="getStatusColor(selectedOrder.status)"
                text-color="white"
                size="lg"
                icon="flag"
                class="text-weight-bold q-px-lg q-py-sm"
              >
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
                          <q-item-label class="text-weight-medium">{{ selectedOrder.nivelAprobacion }}</q-item-label>
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
                          <q-item-label class="text-weight-medium">{{ selectedOrder.shippingAddress.contact }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="phone" color="grey-6" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label caption>Teléfono</q-item-label>
                          <q-item-label class="text-weight-medium">{{ selectedOrder.shippingAddress.cellphone }}</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item>
                        <q-item-section avatar>
                          <q-icon name="location_on" color="grey-6" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label caption>Dirección</q-item-label>
                          <q-item-label class="text-weight-medium">{{ selectedOrder.shippingAddress.address }}</q-item-label>
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
                  <q-chip 
                    color="orange-7" 
                    text-color="white" 
                    icon="shopping_cart"
                    :label="`${selectedOrder.details.length} item${selectedOrder.details.length !== 1 ? 's' : ''}`"
                  />
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <q-table
                  :data="selectedOrder.details"
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

            <!-- Aprobadores -->
            <q-card class="shadow-5 rounded-borders q-mb-lg">
              <q-card-section class="bg-purple-1">
                <div class="row items-center justify-between">
                  <div class="row items-center">
                    <q-icon name="how_to_reg" color="purple-7" size="sm" class="q-mr-sm" />
                    <span class="text-h6 text-purple-8 text-weight-bold">Proceso de Aprobación</span>
                  </div>
                  <q-chip 
                    :color="getApprovalStatusColor(selectedOrder.approvers)" 
                    text-color="white" 
                    icon="verified_user"
                    :label="getApprovalStatusText(selectedOrder.approvers)"
                  />
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <q-table
                  :data="selectedOrder.approvers"
                  :columns="approverColumns"
                  row-key="id"
                  flat
                  :pagination="{ rowsPerPage: 0 }"
                  class="modern-table"
                >
                  <template v-slot:body-cell-approved="props">
                    <q-td :props="props">
                      <q-chip
                        :color="props.row.approved ? 'positive' : props.row.approvalDate ? 'negative' : 'orange'"
                        text-color="white"
                        size="sm"
                        :icon="props.row.approved ? 'check_circle' : props.row.approvalDate ? 'cancel' : 'schedule'"
                      >
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
                        <q-icon 
                          :name="props.row.approvalDate ? 'event_available' : 'event_busy'" 
                          :color="props.row.approvalDate ? 'positive' : 'grey'" 
                          size="xs" 
                          class="q-mr-xs" 
                        />
                        {{ props.row.approvalDate ? formatDate(props.row.approvalDate) : 'Pendiente' }}                        
                      </div>
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
                  <q-chip 
                    color="teal-7" 
                    text-color="white" 
                    icon="work"
                    :label="`${selectedOrder.planItems.length} proyecto${selectedOrder.planItems.length !== 1 ? 's' : ''}`"
                  />
                </div>
              </q-card-section>
              <q-separator />
              <q-card-section>
                <q-table
                  :data="selectedOrder.planItems"
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
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { date } from 'quasar'

export default {
  name: 'OrdersList',
  data() {
    return {
      statusFilter: null,
      showDetailsDialog: false,
      selectedOrder: null,
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
        }
      ],
      projectColumns: [
        {
          name: 'projectId',
          label: 'ID Proyecto',
          align: 'left',
          field: 'id'
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
        
        {
          name: 'code',
          required: true,
          label: 'Consecutivo',
          align: 'left',
          field: 'code',
          sortable: true
        },
        {
          name: 'subdireccion',
          label: 'Subdirección',
          align: 'left',
          field: 'subdireccion',
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
          name: 'status',
          label: 'Estado',
          align: 'center',
          field: 'status',
          sortable: true
        },
        {
          name: 'deliveryDate',
          label: 'Fecha de Entrega',
          align: 'center',
          field: row => row.shippingAddress && row.shippingAddress.deliveryDate,
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
          name: 'actions',
          label: 'Acciones',
          align: 'center',
          field: 'actions'
        }
      ]
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
    ...mapActions('orderSupply', ['fetchUserOrders']),
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
    viewOrderDetails(order) {
      this.selectedOrder = order
      this.showDetailsDialog = true
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
  }
  }
}
</script>

<style scoped>
.my-sticky-header-table {
  /* height or max-height is important */
  height: 70vh;
}

.my-sticky-header-table .q-table__top,
.my-sticky-header-table .q-table__bottom,
.my-sticky-header-table thead tr:first-child th {
  /* bg color is important for th; just specify one */
  background-color: #fff;
}

.my-sticky-header-table thead tr th {
  position: sticky;
  z-index: 1;
}

.my-sticky-header-table thead tr:first-child th {
  top: 0;
}

/* this is when the loading indicator appears */
.my-sticky-header-table.q-table--loading thead tr:last-child th {
  /* height of all previous header rows */
  top: 48px;
}

/* Estilos adicionales para el modal mejorado */
.order-details-card {
  border-radius: 12px;
  overflow: hidden;
}

.order-details-card .q-card__section--vert {
  padding: 0;
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

.modern-table .q-table__top {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 8px 8px 0 0;
}

.modern-table thead th {
  background: rgba(255, 255, 255, 0.95);
  font-weight: 600;
  color: #37474f;
  border-bottom: 2px solid #e0e0e0;
}

.modern-table tbody tr:hover {
  background-color: #f8f9fa;
  transition: background-color 0.2s ease;
}

.opacity-80 {
  opacity: 0.8;
}

/* Animaciones suaves */
.q-chip {
  transition: all 0.2s ease;
}

.q-chip:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.q-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.q-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

/* Mejoras para q-list */
.q-item {
  border-radius: 4px;
  margin-bottom: 4px;
  transition: background-color 0.2s ease;
}

.q-item:hover {
  background-color: #f5f5f5;
}

.q-item-label {
  font-size: 14px;
  line-height: 1.4;
}

.q-item-label--caption {
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #666;
}

/* Mejoras para iconos */
.q-icon {
  transition: color 0.2s ease;
}

/* Gradiente para el header */
.bg-primary {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
}

/* Efectos de hover para botones */
.q-btn {
  transition: all 0.2s ease;
}

.q-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
</style> 