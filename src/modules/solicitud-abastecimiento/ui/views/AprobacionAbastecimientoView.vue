<template>
  <div class="page-wrapper q-pa-md">
    <q-card class="my-card">
      <!-- ── HEADER INSTITUCIONAL ── -->
      <q-card-section class="header-section row justify-between items-center q-pa-lg">
        <div class="row items-center">
          <q-icon name="fact_check" size="md" color="white" class="q-mr-md" />
          <div>
            <div class="text-h5 text-weight-bold text-white">Aprobación de Abastecimiento</div>
            <div class="text-caption text-white opacity-70">Control de niveles y flujo de autorizaciones</div>
          </div>
        </div>
      </q-card-section>

      <!-- ── SUMMARY CARDS (KPIs) ── -->
      <q-card-section class="q-px-lg q-pt-md q-pb-none">
        <div class="row q-col-gutter-md">
          <div class="col-6 col-sm-3">
            <div class="summary-card summary-pendientes" @click="filtroEstado = 'PENDIENTE'" style="cursor:pointer">
              <div class="summary-value">{{ contarPorEstado('PENDIENTE') }}</div>
              <div class="summary-label">🟠 Pendientes</div>
            </div>
          </div>
          <div class="col-6 col-sm-3">
            <div class="summary-card summary-sin-asignar" @click="filtroEstado = 'SIN ASIGNAR'" style="cursor:pointer">
              <div class="summary-value">{{ contarPorEstado('SIN ASIGNAR') }}</div>
              <div class="summary-label">🔴 Sin Asignar</div>
            </div>
          </div>
          <div class="col-6 col-sm-3">
            <div class="summary-card summary-aceptadas" @click="filtroEstado = 'ACEPTADO'" style="cursor:pointer">
              <div class="summary-value">{{ contarPorEstado('ACEPTADO') }}</div>
              <div class="summary-label">🟢 Aceptadas</div>
            </div>
          </div>
          <div class="col-6 col-sm-3">
            <div class="summary-card summary-vencer">
              <div class="summary-value">1</div>
              <div class="summary-label">⚠️ Por Vencer</div>
            </div>
          </div>
        </div>
      </q-card-section>

      <!-- ── BARRA OPERATIVA DE FILTROS ── -->
      <q-card-section class="q-px-lg q-pt-md q-pb-sm">
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-sm-4">
            <q-input dense outlined bg-color="white" v-model="filter" placeholder="Buscar por ID, solicitante o descripción..." clearable>
              <template v-slot:prepend><q-icon name="search" color="grey-5" /></template>
            </q-input>
          </div>
          <div class="col-12 col-sm-2">
            <q-select dense outlined bg-color="white" v-model="filtroEstado" :options="['', 'PENDIENTE', 'ACEPTADO', 'DEVUELTO', 'RECHAZADO']" label="Estado" />
          </div>
          <div class="col-12 col-sm-2">
            <q-input dense outlined bg-color="white" v-model="filtroFecha" label="Fecha" mask="date">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy><q-date v-model="filtroFecha" /></q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <q-btn flat dense color="grey-6" icon="filter_list_off" @click="limpiarFiltros" v-if="filter || filtroEstado || filtroFecha" />
        </div>
      </q-card-section>

      <!-- ── TABLA ESCANEABLE (REDISEÑADA) ── -->
      <q-card-section class="q-pa-none">
        <q-table
          :data="solicitudesFiltradas"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          class="solicitudes-table"
          :pagination="{ rowsPerPage: 10, sortBy: 'estado' }"
        >
          <!-- Header Sticky -->
          <template v-slot:header="props">
            <q-tr :props="props" class="table-header-row">
              <q-th v-for="col in props.cols" :key="col.name" :props="props" class="header-th">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <!-- Celda Master-Detail (Solicitud) -->
          <template v-slot:body-cell-solicitud="props">
            <q-td :props="props">
              <div class="text-weight-bold text-primary font-mono text-xs">#{{ props.row.id.substring(0, 8) }}</div>
              <div class="text-weight-medium text-grey-9">{{ props.row.subdireccion }}</div>
              <div class="text-caption text-grey-6">{{ props.row.nivelAprobacion }}</div>
            </q-td>
          </template>

          <!-- Estado (Pill con fuerte semántica) -->
          <template v-slot:body-cell-estado="props">
            <q-td :props="props" class="text-center">
              <div :class="['status-pill', getStatusClass(props.value)]">
                {{ props.value || 'PENDIENTE' }}
              </div>
            </q-td>
          </template>

          <!-- Responsable Simplificado -->
          <template v-slot:body-cell-encargados="props">
            <q-td :props="props">
              <div v-if="props.value && props.value.length" class="row items-center no-wrap">
                <q-icon name="person" color="grey-6" class="q-mr-xs" />
                <span class="text-body2">{{ props.value[0] }}</span>
                <q-badge v-if="props.value.length > 1" color="blue-1" text-color="blue-8" class="q-ml-xs">
                  +{{ props.value.length - 1 }}
                  <q-tooltip>{{ props.value.join(', ') }}</q-tooltip>
                </q-badge>
              </div>
              <span v-else class="text-grey-4 italic text-xs">Sin asignar</span>
            </q-td>
          </template>

          <!-- Totales (Tabular Nums) -->
          <template v-slot:body-cell-total="props">
            <q-td :props="props" class="text-right font-mono text-weight-bold">
              {{ formatCurrency(calculateTotal(props.row)) }}
            </q-td>
          </template>

          <!-- Acciones (Menú Contextual ⋮) -->
          <template v-slot:body-cell-acciones="props">
            <q-td :props="props" class="text-center">
              <q-btn flat round dense color="grey-7" icon="more_vert">
                <q-menu cover auto-close>
                  <q-list style="min-width: 150px">
                    <q-item clickable @click="verDetalle(props.row)">
                      <q-item-section avatar><q-icon name="visibility" color="blue" /></q-item-section>
                      <q-item-section>Ver Detalle</q-item-section>
                    </q-item>
                    <q-item clickable @click="activarEdicionModal(props.row)">
                      <q-item-section avatar><q-icon name="edit" color="orange" /></q-item-section>
                      <q-item-section>Editar</q-item-section>
                    </q-item>
                    <q-separator />
                    <q-item clickable class="text-negative" @click="confirmarEliminacion(props.row)">
                      <q-item-section avatar><q-icon name="delete" color="negative" /></q-item-section>
                      <q-item-section>Eliminar</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Modal de Detalle Completo -->
    <q-dialog v-model="showDetalle" full-width>
      <q-card v-if="selectedSolicitud">
        <q-card-section class="bg-primary text-white row items-center">
          <div class="text-h6 text-white">Detalle de Solicitud de Abastecimiento</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-separator />

        <q-tabs
          v-model="tab"
          dense
          class="bg-grey-2 text-grey-7"
          active-color="primary"
          indicator-color="primary"
          align="justify"
          narrow-indicator
        >
          <q-tab name="general" label="Información General" icon="info" />
          <q-tab name="proyectos" label="Proyectos" icon="list" />
          <q-tab name="historial" label="Historial" icon="history" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <!-- Pestaña: Información General -->
          <q-tab-panel name="general">
            <div class="row q-col-gutter-md">
              <div class="col-12" v-if="!isEditing">
                <div class="text-subtitle1 text-weight-bold q-mb-sm">Datos de la Necesidad</div>
                <p><strong>Subdirección:</strong> {{ selectedSolicitud.subdireccion }}</p>
                <p><strong>Descripción de Necesidad:</strong> {{ selectedSolicitud.descripcionNecesidad }}</p>
                <p><strong>Nivel Aprobación:</strong> {{ selectedSolicitud.nivelAprobacion }}</p>
                <p>
                  <strong>Estado Actual:</strong> 
                  <q-chip 
                    :color="getStatusColor(selectedSolicitud.estado)" 
                    text-color="white" 
                    dense 
                    square 
                    class="text-weight-bold"
                  >
                    {{ selectedSolicitud.estado || 'PENDIENTE' }}
                  </q-chip>
                </p>
                <div v-if="selectedSolicitud.notaDevolucion" class="q-mt-md q-pa-sm bg-red-1 border-red text-negative">
                  <strong>Nota de Devolución:</strong> {{ selectedSolicitud.notaDevolucion }}
                </div>
              </div>

              <!-- Vista Edición General -->
              <div class="col-12" v-else>
                <div class="text-subtitle1 text-weight-bold q-mb-sm">Editar Datos de la Necesidad</div>
                <q-input v-model="editableSolicitud.subdireccion" label="Subdirección" outlined dense class="q-mb-sm" />
                <q-input v-model="editableSolicitud.descripcionNecesidad" label="Descripción de Necesidad" outlined dense type="textarea" class="q-mb-sm" />
                <q-select 
                  v-model="editableSolicitud.nivelAprobacion" 
                  :options="['Nivel Básico', 'Nivel Gerencial', 'Nivel Director']" 
                  label="Nivel de Aprobación" 
                  outlined 
                  dense 
                />
              </div>
            </div>
          </q-tab-panel>

          <!-- Pestaña: Proyectos -->
          <q-tab-panel name="proyectos">
            <div class="text-subtitle1 text-weight-bold q-mb-sm">{{ isEditing ? 'Editar Proyectos' : 'Proyectos Asociados' }}</div>
            <div v-for="(p, i) in (isEditing ? editableSolicitud.proyectos : selectedSolicitud.proyectos)" :key="i" class="q-mb-lg border-panel q-pa-md bg-white shadow-1">
              <div class="row items-center justify-between q-mb-sm">
                <div class="text-subtitle2 text-primary font-bold">Proyecto: {{ p.planAbastecimiento }}</div>
                <div class="row items-center" v-if="isEditing">
                   <div class="text-caption q-mr-sm">Participación:</div>
                   <q-input v-model.number="p.porcentaje" type="number" suffix="%" outlined dense style="width: 80px" />
                </div>
                <q-badge v-else color="secondary">Participación: {{ p.porcentaje }}%</q-badge>
              </div>
              <div class="text-caption q-mb-sm">Rubro: {{ p.item }}</div>
              
              <!-- Tabla Editable Estilizada -->
              <q-markup-table dense flat bordered class="q-mt-sm">
                <thead>
                  <tr class="bg-grey-1">
                    <th class="text-left">Descripción</th>
                    <th class="text-center" style="width: 100px">Cantidad</th>
                    <th class="text-center" style="width: 100px">Unidad</th>
                    <th class="text-right" style="width: 150px">V. Unitario</th>
                    <th class="text-right" style="width: 150px">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(prod, j) in p.productosServicios" :key="j">
                    <td class="text-left">
                      <q-input v-if="isEditing" v-model="prod.descripcion" dense borderless hide-bottom-space />
                      <span v-else>{{ prod.descripcion }}</span>
                    </td>
                    <td class="text-center">
                      <q-input v-if="isEditing" v-model.number="prod.cantidad" type="number" dense borderless hide-bottom-space class="text-center" />
                      <span v-else>{{ prod.cantidad }}</span>
                    </td>
                    <td class="text-center">
                      <q-input v-if="isEditing" v-model="prod.unidadMedida" dense borderless hide-bottom-space class="text-center" />
                      <span v-else>{{ prod.unidadMedida }}</span>
                    </td>
                    <td class="text-right">
                      <q-input v-if="isEditing" v-model.number="prod.valorUnitario" type="number" dense borderless hide-bottom-space class="text-right" />
                      <span v-else>{{ formatCurrency(prod.valorUnitario) }}</span>
                    </td>
                    <td class="text-right text-weight-bold">
                      {{ formatCurrency(prod.cantidad * prod.valorUnitario) }}
                    </td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr class="bg-grey-2">
                    <td colspan="4" class="text-right text-weight-bold">Total Proyecto:</td>
                    <td class="text-right text-weight-bold text-primary">
                      {{ formatCurrency(p.productosServicios.reduce((acc, curr) => acc + (curr.cantidad * curr.valorUnitario), 0)) }}
                    </td>
                  </tr>
                </tfoot>
              </q-markup-table>
            </div>
          </q-tab-panel>

          <!-- Pestaña: Historial (Vista Directa Estilo Git) -->
          <q-tab-panel name="historial">
            <div class="q-pa-md bg-grey-10 text-white shadow-2 overflow-hidden" style="border-radius: 4px; font-family: 'Roboto Mono', monospace;">
              <div class="row items-center q-mb-md">
                <q-icon name="history" size="sm" class="q-mr-sm" />
                <div class="text-subtitle2">Solicitud Change Log</div>
              </div>
              
              <q-list dark separator>
                <q-item v-for="(h, i) in (selectedSolicitud.historial || [])" :key="i" class="q-py-md">
                  <q-item-section avatar top>
                    <q-avatar 
                      size="32px" 
                      font-size="16px" 
                      :color="getGitIconColor(h.estado)" 
                      text-color="white" 
                      :icon="getGitIcon(h.estado)"
                    />
                  </q-item-section>

                  <q-item-section>
                    <div class="row items-center q-gutter-x-sm">
                      <code class="text-info text-weight-bold" style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 3px;">
                        {{ extractSHA(h.id) }}
                      </code>
                      <q-badge :color="getStatusColor(h.estado)" text-color="white" dense square>
                        {{ h.estado }}
                      </q-badge>
                      <q-space />
                      <div class="text-caption text-grey-5">{{ h.fecha }}</div>
                    </div>
                    <div class="text-body2 q-mt-sm text-grey-3">{{ h.nota }}</div>
                  </q-item-section>
                </q-item>
                
                <q-item v-if="!(selectedSolicitud.historial && selectedSolicitud.historial.length)" class="text-grey-6 text-italic">
                  Sin registros en el historial remoto.
                </q-item>
              </q-list>
            </div>
          </q-tab-panel>
        </q-tab-panels>

        <q-card-actions align="right" class="q-pa-md bg-grey-1">
          <template v-if="!isEditing">
            <q-btn flat label="Cerrar" color="primary" v-close-popup />
            <q-btn flat label="Editar" color="info" icon="edit" @click="activarEdicion" />
            <q-btn v-if="selectedSolicitud.estado !== 'DEVUELTO'" flat label="Devolver" color="orange" @click="confirmarDevolucion(selectedSolicitud)" />
            <q-btn v-if="selectedSolicitud.estado !== 'ACEPTADO'" label="Aceptar aprobación" color="positive" @click="confirmarAprobacion(selectedSolicitud)" />
          </template>
          <template v-else>
            <q-btn flat label="Cancelar" color="grey" @click="cancelarEdicion" />
            <q-btn label="Guardar Cambios" color="primary" icon="save" :loading="loading" @click="guardarEdicion" />
          </template>
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal de Selección de Aprobadores -->
    <approve-solicitud-modal 
      v-model="showApproveModal"
      @confirm="onApproveConfirm"
    />

    <!-- Modal para Nota de Devolución -->
    <q-dialog v-model="showReturnModal" persistent>
      <q-card style="min-width: 400px">
        <q-card-section class="bg-orange text-white row items-center">
          <div class="text-h6 text-white">Devolver Plan de Abastecimiento</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pa-md">
          <p class="text-subtitle2 q-mb-md">
            Por favor, indique el motivo por el cual está devolviendo esta solicitud para corrección.
          </p>
          <q-input
            v-model="returnNote"
            type="textarea"
            label="Nota de Devolución"
            outlined
            rows="5"
            autofocus
            placeholder="Escriba aquí los detalles..."
            :rules="[val => !!val || 'La nota es obligatoria']"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancelar" color="grey" v-close-popup />
          <q-btn
            label="Enviar Devolución"
            color="orange"
            :loading="loading"
            :disable="!returnNote"
            @click="onReturnConfirm"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </div>
</template>

<script>
import { useSolicitudStore } from '../store/useSolicitudStore';
import ApproveSolicitudModal from '../components/ApproveSolicitudModal.vue';

export default {
  name: 'AprobacionAbastecimientoView',
  components: {
    ApproveSolicitudModal
  },
  data() {
    return {
      store: useSolicitudStore(),
      filter: '',
      tab: 'general',
      showDetalle: false,
      isEditing: false,
      editableSolicitud: null,
      showApproveModal: false,
      showReturnModal: false,
      returnNote: '',
      selectedSolicitud: null,
      filtroEstado: '',
      filtroFecha: '',
      columns: [
        { name: 'solicitud', align: 'left', label: 'SOLICITUD / ORIGEN', field: 'subdireccion', sortable: true },
        { name: 'estado', align: 'center', label: 'ESTADO', field: 'estado', sortable: true },
        { name: 'encargados', align: 'left', label: 'RESPONSABLE', field: 'encargados' },
        { name: 'total', align: 'right', label: 'TOTAL', field: row => this.calculateTotal(row), sortable: true },
        { name: 'acciones', align: 'center', label: 'ACCIONES', field: 'id' }
      ],
      productColumns: [
        { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'left' },
        { name: 'cantidad', label: 'Cantidad', field: 'cantidad', align: 'center' },
        { name: 'unidad', label: 'Unidad', field: 'unidadMedida', align: 'center' },
        { name: 'valor', label: 'V. Unitario', field: 'valorUnitario', format: val => this.formatCurrency(val) }
      ]
    };
  },
  computed: {
    solicitudes() {
      return this.store.solicitudes;
    },
    solicitudesFiltradas() {
      if (!this.solicitudes) return [];
      return this.solicitudes.filter(sol => {
        // Filtro por estado
        if (this.filtroEstado && sol.estado !== this.filtroEstado) return false;
        return true;
      });
    },
    loading() {
      return this.store.loading;
    }
  },
  methods: {
    obtenerRubrosAfectados(solicitud) {
      if (!solicitud || !solicitud.proyectos) return [];
      const rubrosMap = {};
      solicitud.proyectos.forEach(function (p) {
        if (p.item && p.porcentaje > 0) {
          if (!rubrosMap[p.item]) {
            rubrosMap[p.item] = 0;
          }
          rubrosMap[p.item] += p.porcentaje;
        }
      });
      return Object.keys(rubrosMap).map(function (nombre) {
        return nombre + ' (' + rubrosMap[nombre].toFixed(1) + '%)';
      });
    },
    async cargarDatos() {
      try {
        await this.store.fetchSolicitudes();
      } catch (e) {
        this.$q.notify({ color: 'negative', message: 'Error al cargar solicitudes' });
      }
    },
    calculateTotal(row) {
      if (!row.proyectos) return 0;
      let total = 0;
      row.proyectos.forEach(p => {
        if (p.productosServicios) {
          p.productosServicios.forEach(prod => {
            total += (prod.cantidad * (prod.valorUnitario || 0));
          });
        }
      });
      return total;
    },
    formatCurrency(val) {
      return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
      }).format(val);
    },
    extractSHA(id) {
      if (!id) return '-------';
      return id.substring(0, 7).toLowerCase();
    },
    getGitIcon(estado) {
      switch (estado) {
        case 'ACEPTADO': return 'check_circle';
        case 'RECHAZADO': return 'cancel';
        case 'DEVUELTO': return 'reply_all';
        case 'PENDIENTE': return 'schedule';
        default: return 'edit';
      }
    },
    getGitIconColor(estado) {
      switch (estado) {
        case 'ACEPTADO': return 'positive';
        case 'RECHAZADO': return 'negative';
        case 'DEVUELTO': return 'orange';
        default: return 'blue-grey';
      }
    },
    getStatusClass(status) {
      if (!status || status === 'SIN ASIGNAR') return 'status--unassigned';
      const s = status.toUpperCase();
      if (s === 'ACEPTADO' || s === 'APROBADO') return 'status--accepted';
      if (s === 'DEVUELTO' || s === 'RECHAZADO') return 'status--rejected';
      return 'status--pending';
    },
    contarPorEstado(estado) {
      if (!this.solicitudes) return 0;
      if (estado === 'SIN ASIGNAR') return this.solicitudes.filter(s => !s.encargados || s.encargados.length === 0).length;
      return this.solicitudes.filter(s => s.estado === estado).length;
    },
    limpiarFiltros() {
      this.filter = '';
      this.filtroEstado = '';
      this.filtroFecha = '';
    },
    getStatusColor(status) {
      if (status === 'ACEPTADO' || status === 'APROBADO') return 'positive'; // Verde
      if (status === 'DEVUELTO' || status === 'RECHAZADO') return 'negative'; // Rojo
      return 'warning'; // Naranjado (por defecto para PENDIENTE)
    },
    getStatusIcon(status) {
      if (status === 'ACEPTADO' || status === 'APROBADO') return 'check_circle';
      if (status === 'DEVUELTO') return 'reply';
      if (status === 'RECHAZADO') return 'cancel';
      return 'pending';
    },
    formatDate(date) {
      if (!date) return '';
      // Formato simple para el historial
      const d = new Date(date);
      return d.toLocaleString();
    },
    verDetalle(row) {
      this.selectedSolicitud = row;
      this.isEditing = false;
      this.showDetalle = true;
    },
    activarEdicionModal(row) {
      this.selectedSolicitud = row;
      this.activarEdicion();
      this.showDetalle = true;
    },
    activarEdicion() {
      // Clonación profunda simple para evitar mutar el estado de Pinia directamente
      this.editableSolicitud = JSON.parse(JSON.stringify(this.selectedSolicitud));
      this.isEditing = true;
    },
    cancelarEdicion() {
      this.isEditing = false;
      this.editableSolicitud = null;
    },
    async guardarEdicion() {
      try {
        const actualizada = await this.store.updateSolicitud(this.editableSolicitud);
        this.$q.notify({
          color: 'positive',
          message: '¡Cambios guardados correctamente!',
          icon: 'check'
        });
        // Actualizar la vista local con la respuesta del servidor (que incluye el historial actualizado)
        this.selectedSolicitud = actualizada;
        this.isEditing = false;
      } catch (e) {
        this.$q.notify({
          color: 'negative',
          message: 'Error al actualizar la solicitud: ' + e.message
        });
      }
    },
    confirmarAprobacion(row) {
      this.selectedSolicitud = row;
      this.showApproveModal = true;
    },
    async onApproveConfirm(aprobadores) {
      try {
        const solicitudAprobada = this.selectedSolicitud;
        await this.store.approveSolicitud(this.selectedSolicitud.id, aprobadores);

        const rubrosAfectados = this.obtenerRubrosAfectados(solicitudAprobada);
        let mensaje = 'Solicitud aprobada y personal asignado correctamente.';
        if (rubrosAfectados.length > 0) {
          mensaje += ' Presupuesto descontado de: ' + rubrosAfectados.join(', ');
        }

        this.$q.notify({ 
          color: 'positive', 
          icon: 'check_circle', 
          message: mensaje,
          timeout: 8000,
        });
        this.showDetalle = false;
      } catch (e) {
        this.$q.notify({ 
          color: 'negative', 
          message: 'Error al procesar la aprobación' 
        });
      }
    },
    confirmarRechazo(row) {
      this.$q.dialog({
        title: 'Confirmar Rechazo',
        message: '¿Está seguro de que desea RECHAZAR esta solicitud?',
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(async () => {
        await this.store.rejectSolicitud(row.id);
        this.$q.notify({ color: 'negative', icon: 'cancel', message: 'Solicitud Rechazada' });
        this.showDetalle = false;
      });
    },
    confirmarDevolucion(row) {
      this.selectedSolicitud = row;
      this.returnNote = '';
      this.showReturnModal = true;
    },
    async onReturnConfirm() {
      if (!this.returnNote) return;
      
      try {
        await this.store.returnSolicitud(this.selectedSolicitud.id, this.returnNote);
        this.$q.notify({ 
          color: 'orange', 
          icon: 'reply', 
          message: 'Solicitud devuelta para corrección' 
        });
        this.showReturnModal = false;
        this.showDetalle = false;
      } catch (e) {
        this.$q.notify({ 
          color: 'negative', 
          message: 'Error al procesar la devolución' 
        });
      }
    },
    confirmarEliminacion(row) {
      this.$q.dialog({
        title: 'Eliminar Registro',
        message: 'Esta acción es irreversible. ¿Desea continuar?',
        cancel: true,
        persistent: true,
        color: 'negative'
      }).onOk(async () => {
        await this.store.deleteSolicitud(row.id);
        this.$q.notify({ color: 'black', icon: 'delete', message: 'Solicitud Eliminada' });
      });
    }
  },
  mounted() {
    this.cargarDatos();
  }
};
</script>

<style scoped>
.page-wrapper {
  min-height: 100vh;
}

.my-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

/* Header Institucional */
.header-section {
  background: linear-gradient(135deg, #84B24D 0%, #75AF7E 50%, #4E9C4C 100%);
  border-radius: 12px 12px 0 0;
}

/* Summary Cards */
.summary-card {
  padding: 16px;
  border-radius: 10px;
  background: white;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.summary-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1;
}

.summary-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  margin-top: 4px;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.summary-pendientes { border-left: 4px solid #f59e0b; }
.summary-sin-asignar { border-left: 4px solid #ef4444; }
.summary-aceptadas { border-left: 4px solid #10b981; }
.summary-vencer { border-left: 4px solid #3b82f6; }

/* Tabla Escaneable */
.table-header-row {
  background-color: #f1f5f9;
}

.header-th {
  font-weight: 800 !important;
  color: #475569 !important;
  text-transform: uppercase;
  font-size: 11px !important;
  letter-spacing: 0.05em;
  padding: 16px !important;
}

.solicitudes-table ::v-deep tr {
  transition: background-color 0.2s ease;
}

.solicitudes-table ::v-deep tr:hover {
  background-color: #f1f5f9 !important;
}

.solicitudes-table ::v-deep td {
  padding: 18px 16px !important;
  border-bottom: 1px solid #f1f5f9;
}

.solicitudes-table ::v-deep tr:nth-child(even) {
  background-color: #fbfbfc;
}

.solicitudes-table ::v-deep thead tr {
  position: sticky;
  top: 0;
  z-index: 2;
  background: white;
}

/* Badges de Estado */
.status-pill {
  display: inline-flex;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

.status--accepted { background-color: #dcfce7; color: #166534; }
.status--rejected { background-color: #fee2e2; color: #991b1b; }
.status--pending { background-color: #fef3c7; color: #92400e; }
.status--unassigned { background-color: #f1f5f9; color: #475569; }

.font-mono {
  font-family: 'JetBrains Mono', monospace;
}
</style>
