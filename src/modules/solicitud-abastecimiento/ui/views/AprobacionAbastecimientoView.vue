<template>
  <div class="q-pa-md">
    <q-card class="shadow-5 rounded-borders">
      <q-card-section class="bg-primary text-white row items-center q-pb-md">
        <q-icon name="fact_check" size="md" class="q-mr-md" />
        <div>
          <div class="text-h5 text-white">Aprobación de Abastecimiento</div>
          <div class="text-subtitle2">Gestión y control de solicitudes de compra</div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-table
          :data="solicitudes"
          :columns="columns"
          row-key="id"
          :loading="loading"
          :filter="filter"
          binary-state-sort
          class="no-shadow"
        >
          <template v-slot:top-right>
            <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar solicitud...">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>

          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <span class="text-weight-bold text-primary">#{{ props.value.substring(0, 8) }}</span>
            </q-td>
          </template>

          <template v-slot:body-cell-total="props">
            <q-td :props="props">
              <span class="text-weight-bold text-secondary">
                {{ formatCurrency(calculateTotal(props.row)) }}
              </span>
            </q-td>
          </template>

          <template v-slot:body-cell-estado="props">
            <q-td :props="props" class="text-center">
              <q-chip
                :color="getStatusColor(props.value)"
                text-color="white"
                dense
                square
                class="text-weight-bold"
              >
                {{ props.value || 'PENDIENTE' }}
              </q-chip>
            </q-td>
          </template>
          
          <template v-slot:body-cell-encargados="props">
            <q-td :props="props" class="text-center">
              <div v-if="props.value && props.value.length">
                <q-chip 
                  v-for="(name, index) in props.value" 
                  :key="index"
                  size="sm"
                  color="grey-3"
                  text-color="primary"
                  dense
                  icon="account_circle"
                >
                  {{ name }}
                </q-chip>
              </div>
              <span v-else class="text-grey-5 italic">No asignado</span>
            </q-td>
          </template>

          <template v-slot:body-cell-acciones="props">
            <q-td :props="props" class="text-center">
              <q-btn flat round color="primary" icon="visibility" @click="verDetalle(props.row)">
                <q-tooltip>Ver Detalle</q-tooltip>
              </q-btn>
              
              <!-- Botón Editar que despliega opciones de aprobación -->
              <q-btn flat round color="secondary" icon="edit">
                <q-tooltip>Decisión de Aprobación</q-tooltip>
                <q-menu>
                  <q-list style="min-width: 100px">
                    <q-item clickable v-close-popup @click="confirmarAprobacion(props.row)">
                      <q-item-section avatar>
                        <q-icon name="check_circle" color="positive" />
                      </q-item-section>
                      <q-item-section>Aceptar</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="confirmarRechazo(props.row)">
                      <q-item-section avatar>
                        <q-icon name="cancel" color="negative" />
                      </q-item-section>
                      <q-item-section>Rechazar</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="confirmarDevolucion(props.row)">
                      <q-item-section avatar>
                        <q-icon name="reply" color="orange" />
                      </q-item-section>
                      <q-item-section>Devolver</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>

              <q-btn flat round color="negative" icon="delete" @click="confirmarEliminacion(props.row)">
                <q-tooltip>Eliminar Solicitud</q-tooltip>
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
          <q-tab name="contacto" label="Contacto" icon="contacts" />
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

          <!-- Pestaña: Contacto -->
          <q-tab-panel name="contacto">
            <div class="row q-col-gutter-md" v-if="!isEditing">
              <div class="col-12">
                <div class="text-subtitle1 text-weight-bold q-mb-sm">Información del Solicitante</div>
                <p><strong>Contacto:</strong> {{ selectedSolicitud.contacto }}</p>
                <p><strong>Teléfono:</strong> {{ selectedSolicitud.telefono }}</p>
                <p><strong>Ubicación:</strong> {{ selectedSolicitud.departamento }}, {{ selectedSolicitud.municipio }}</p>
                <p><strong>Dirección:</strong> {{ selectedSolicitud.direccion }}</p>
                <p><strong>Fecha Límite Solicitada:</strong> {{ selectedSolicitud.fechaEntrega }}</p>
              </div>
            </div>

            <!-- Vista Edición Contacto -->
            <div class="row q-col-gutter-md" v-else>
              <div class="col-12">
                <div class="text-subtitle1 text-weight-bold q-mb-sm">Editar Información del Solicitante</div>
                <q-input v-model="editableSolicitud.contacto" label="Contacto" outlined dense class="q-mb-sm" />
                <q-input v-model="editableSolicitud.telefono" label="Teléfono" outlined dense class="q-mb-sm" />
                <div class="row q-col-gutter-sm q-mb-sm">
                  <q-input v-model="editableSolicitud.departamento" label="Departamento" outlined dense class="col" />
                  <q-input v-model="editableSolicitud.municipio" label="Municipio" outlined dense class="col" />
                </div>
                <q-input v-model="editableSolicitud.direccion" label="Dirección" outlined dense class="q-mb-sm" />
                <q-input v-model="editableSolicitud.fechaEntrega" label="Fecha Límite" outlined dense type="date" stack-label />
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
      columns: [
        { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
        { name: 'solicitante', align: 'left', label: 'SOLICITANTE', field: 'contacto', sortable: true },
        { name: 'descripcion', align: 'left', label: 'DESCRIPCIÓN', field: 'descripcionNecesidad', sortable: true },
        { name: 'nivel', align: 'left', label: 'NIVEL APROBACIÓN', field: 'nivelAprobacion', sortable: true },
        { name: 'total', align: 'right', label: 'TOTAL', field: row => this.calculateTotal(row), sortable: true },
        { name: 'fechaLimite', align: 'center', label: 'FECHA LÍMITE', field: 'fechaEntrega', sortable: true },
        { name: 'encargados', align: 'center', label: 'PERSONAS ENCARGADAS', field: 'encargados' },
        { name: 'estado', align: 'center', label: 'ESTADO', field: 'estado', sortable: true },
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
    loading() {
      return this.store.loading;
    }
  },
  methods: {
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
        await this.store.approveSolicitud(this.selectedSolicitud.id, aprobadores);
        this.$q.notify({ 
          color: 'positive', 
          icon: 'check', 
          message: 'Solicitud aprobada y personal asignado correctamente' 
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
.rounded-borders {
  border-radius: 12px;
}
</style>
