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
      <q-card style="min-width: 80vw; max-width: 90vw;">
        <q-card-section class="row items-center">
          <div class="text-h6">Detalles de la Orden: {{ selectedOrder && selectedOrder.id }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div v-if="selectedOrder">
            <!-- Información general -->
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-md-6">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-h6 q-mb-md">Información General</div>
                    <div><strong>Subdirección:</strong> {{ selectedOrder.subdireccion }}</div>
                    <div><strong>Descripción:</strong> {{ selectedOrder.description }}</div>
                    <div><strong>Nivel de Aprobación:</strong> {{ selectedOrder.nivelAprobacion }}</div>
                    <div><strong>Observaciones:</strong> {{ selectedOrder.notes }}</div>
                    <div><strong>Garantías:</strong> {{ selectedOrder.warranty }}</div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-12 col-md-6">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-h6 q-mb-md">Dirección de Entrega</div>
                    <div><strong>Contacto:</strong> {{ selectedOrder.shippingAddress.contact }}</div>
                    <div><strong>Teléfono:</strong> {{ selectedOrder.shippingAddress.cellphone }}</div>
                    <div><strong>Dirección:</strong> {{ selectedOrder.shippingAddress.address }}</div>
                    <div><strong>Fecha de Entrega:</strong> {{ formatDate(selectedOrder.shippingAddress.deliveryDate) }}</div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <!-- Detalles de productos -->
            <q-card flat bordered class="q-mb-md">
              <q-card-section>
                <div class="text-h6 q-mb-md">Productos/Servicios</div>
                <q-table
                  :data="selectedOrder.details"
                  :columns="productColumns"
                  row-key="id"
                  flat
                  bordered
                  :pagination="{ rowsPerPage: 0 }"
                >
                  <template v-slot:bottom>
                    <div class="row full-width">
                      <div class="col-12 text-right q-pr-md">
                        <span class="text-weight-bold text-h6">
                          Total: ${{ calculateTotal(selectedOrder.details) }}
                        </span>
                      </div>
                    </div>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>

            <!-- Aprobadores -->
            <q-card flat bordered class="q-mb-md">
              <q-card-section>
                <div class="text-h6 q-mb-md">Aprobadores</div>
                <q-table
                  :data="selectedOrder.approvers"
                  :columns="approverColumns"
                  row-key="id"
                  flat
                  bordered
                  :pagination="{ rowsPerPage: 0 }"
                >
                  <template v-slot:body-cell-approved="props">
                    <q-td :props="props">
                      <q-chip
                        :color="props.row.approved ? 'positive' : 'negative'"
                        text-color="white"
                        size="sm"
                      >
                        {{ props.row.approved ? 'Aprobado' : 'Pendiente' }}
                      </q-chip>
                    </q-td>
                  </template>
                  <template v-slot:body-cell-approvalDate="props">
                    <q-td :props="props">
                      {{ props.row.approvalDate ? formatDate(props.row.approvalDate) : 'Pendiente' }}
                    </q-td>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>

            <!-- Proyectos -->
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6 q-mb-md">Proyectos</div>
                <q-table
                  :data="selectedOrder.projects"
                  :columns="projectColumns"
                  row-key="id"
                  flat
                  bordered
                  :pagination="{ rowsPerPage: 0 }"
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
          field: 'projectId'
        },
        {
          name: 'percentage',
          label: 'Porcentaje',
          align: 'right',
          field: 'percentage',
          format: val => `${val}%`
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
          name: 'id',
          required: true,
          label: 'ID',
          align: 'left',
          field: 'id',
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
          await this.fetchUserOrders('enarvaez')
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
</style> 