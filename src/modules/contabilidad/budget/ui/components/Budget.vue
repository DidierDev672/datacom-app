<template>
  <div>
  <q-card flat bordered class="budget-card q-pa-md">
    <!-- Cabecera -->
    <q-card-section class="q-pb-sm">
      <div class="text-h6 text-weight-bold text-dark">Registrar Presupuesto</div>
      <p class="budget-lead q-mb-none q-mt-sm text-body2 text-grey-8">
        Configura un nuevo presupuesto vinculando centro de costo y área responsable.
      </p>
    </q-card-section>

    <q-separator class="q-my-sm" />

    <!-- ── ALERTAS de datos faltantes ────────────────────── -->
    <q-card-section v-if="sinCentrosCosto" class="q-pt-none q-pb-sm">
      <div class="budget-missing-banner q-pa-sm row items-center no-wrap">
        <q-icon name="warning" color="warning" size="20px" class="q-mr-sm" />
        <span class="text-body2 text-grey-9 col">
          No hay centros de costo registrados. Debes crear al menos uno antes de continuar.
        </span>
        <q-btn
          flat dense no-caps
          color="primary"
          icon="add_circle_outline"
          label="Crear centro de costo"
          @click="$router.push('/contabilidad/centro-costo')"
        />
      </div>
    </q-card-section>

    <!-- ── INDICADOR DE CARGA ─────────────────────────────── -->
    <q-card-section v-if="cargandoDatos" class="text-center q-py-xl">
      <q-spinner-dots color="primary" size="40px" />
      <p class="text-body2 text-grey-7 q-mt-sm">Cargando datos de referencia…</p>
    </q-card-section>

    <!-- ── FORMULARIO ─────────────────────────────────────── -->
    <q-card-section v-else>
      <q-form ref="formRef" greedy @submit.prevent="onGuardar">

        <!-- ── NOMBRE DEL PRESUPUESTO ────────────────────── -->
        <div class="text-caption text-weight-medium text-grey-7 q-mb-xs">
          Nombre del presupuesto
        </div>
        <q-input
          id="budget-name"
          v-model.trim="form.name"
          outlined
          hide-bottom-space
          class="budget-input"
          placeholder="Ej: Presupuesto Marketing Q1 2026"
          maxlength="200"
          :rules="[reglaNombreRequerido, reglaNombreLongitud]"
          lazy-rules
        >
          <template v-slot:prepend>
            <q-icon name="description" color="grey-6" size="20px" />
          </template>
        </q-input>

        <!-- ── AÑO FISCAL ────────────────────────────────── -->
        <div class="text-caption text-weight-medium text-grey-7 q-mt-lg q-mb-xs">
          Año fiscal
        </div>
        <q-select
          id="budget-fiscal-year"
          v-model="form.fiscal_year"
          outlined
          hide-bottom-space
          emit-value
          map-options
          class="budget-input"
          :options="aniosFiscales"
          option-value="value"
          option-label="label"
          behavior="menu"
          :rules="[reglaAnioRequerido]"
          lazy-rules
        >
          <template v-slot:prepend>
            <q-icon name="calendar_today" color="grey-6" size="20px" />
          </template>
        </q-select>

        <!-- ── ÁREA RESPONSABLE (Colaboradores) ──────────── -->
        <div class="text-caption text-weight-medium text-grey-7 q-mt-lg q-mb-xs">
          Área responsable
        </div>
        <q-select
          id="budget-responsible-area"
          v-model="form.responsible_area"
          outlined
          hide-bottom-space
          emit-value
          map-options
          use-input
          input-debounce="200"
          class="budget-input"
          :options="colaboradoresFiltrados"
          option-value="value"
          option-label="label"
          behavior="menu"
          :rules="[reglaAreaRequerida]"
          lazy-rules
          @filter="filtrarColaboradores"
        >
          <template v-slot:prepend>
            <q-icon name="person" color="grey-6" size="20px" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">Sin resultados</q-item-section>
            </q-item>
          </template>
        </q-select>

        <!-- ── CENTRO DE COSTO ───────────────────────────── -->
        <div class="text-caption text-weight-medium text-grey-7 q-mt-lg q-mb-xs">
          Centro de costo
        </div>
        <q-select
          id="budget-cost-center"
          v-model="form.cost_center_id"
          outlined
          hide-bottom-space
          emit-value
          map-options
          class="budget-input"
          :options="centrosCostoOpciones"
          option-value="value"
          option-label="label"
          behavior="menu"
          :rules="[reglaCentroRequerido]"
          lazy-rules
          :disable="sinCentrosCosto"
        >
          <template v-slot:prepend>
            <q-icon name="account_tree" color="grey-6" size="20px" />
          </template>
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">
                No hay centros de costo
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <!-- ── ESTADO ────────────────────────────────────── -->
        <div class="text-caption text-weight-medium text-grey-7 q-mt-lg q-mb-xs">
          Estado
        </div>
        <q-select
          id="budget-status"
          v-model="form.status"
          outlined
          hide-bottom-space
          emit-value
          map-options
          class="budget-input"
          :options="estadoOpciones"
          option-value="value"
          option-label="label"
          behavior="menu"
          :rules="[reglaEstadoRequerido]"
          lazy-rules
        >
          <template v-slot:prepend>
            <q-icon name="flag" color="grey-6" size="20px" />
          </template>
        </q-select>

        <!-- ── ERRORES GLOBALES ───────────────────────────── -->
        <div
          v-if="errorGlobal"
          class="budget-error-banner q-mt-md q-pa-sm row items-start gap-sm"
        >
          <q-icon name="error_outline" color="negative" size="18px" class="q-mt-xs" />
          <span class="text-caption text-negative">{{ errorGlobal }}</span>
        </div>

        <!-- ── ACCIONES ───────────────────────────────────── -->
        <div class="row q-gutter-sm justify-end q-mt-xl">
          <q-btn
            flat no-caps color="grey-8" label="Limpiar" type="button"
            :disable="guardando"
            @click="limpiar"
          />
          <q-btn
            unelevated no-caps color="primary" icon="save"
            label="Guardar presupuesto" type="submit"
            :loading="guardando"
            :disable="sinCentrosCosto"
          />
        </div>

      </q-form>
    </q-card-section>
  </q-card>

  <!-- Modal: Detalle del Presupuesto -->
  <q-dialog v-model="isResumenModalOpen" persistent>
    <q-card class="budget-resumen-modal">
      <q-card-section class="budget-resumen-header row items-center justify-between">
        <div class="row items-center q-gutter-sm">
          <div class="text-h6 text-weight-bold">Detalle del Presupuesto</div>
          <q-badge
            v-if="presupuestoGuardado"
            :color="getStatusColor(presupuestoGuardado.status)"
            :label="presupuestoGuardado.status"
          />
        </div>
        <q-btn icon="close" flat round dense color="grey-7" @click="cerrarResumenModal" />
      </q-card-section>

      <q-separator />

      <q-card-section v-if="presupuestoGuardado" class="budget-resumen-body">
        <div class="budget-resumen-card q-mb-md">
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="budget-resumen-label">Nombre</div>
              <div class="budget-resumen-value">{{ presupuestoGuardado.name }}</div>
            </div>
            <div class="col-6">
              <div class="budget-resumen-label">Año fiscal</div>
              <div class="budget-resumen-value">{{ presupuestoGuardado.fiscal_year }}</div>
            </div>
            <div class="col-6">
              <div class="budget-resumen-label">Responsable</div>
              <div class="budget-resumen-value">{{ presupuestoGuardado.responsible_area }}</div>
            </div>
          </div>
        </div>

        <div class="row items-center justify-between q-mb-sm">
          <div class="text-subtitle2 text-weight-medium">Líneas de detalle</div>
          <q-badge
            v-if="detalleRegistrado"
            color="positive"
            outline
            :label="`${detallesPresupuesto.length} registro(s)`"
          />
        </div>

        <div v-if="cargandoDetalles" class="text-center q-py-lg">
          <q-spinner-dots color="primary" size="32px" />
          <p class="text-caption text-grey-7 q-mt-sm">Validando detalle del presupuesto…</p>
        </div>

        <div
          v-else-if="errorCargaDetalles"
          class="budget-sin-detalles budget-sin-detalles--error q-pa-lg text-center"
        >
          <q-icon name="error_outline" size="48px" color="negative" class="q-mb-md" />
          <p class="text-body1 text-grey-8 q-mb-xs">No se pudo verificar el detalle del presupuesto.</p>
          <p class="text-body2 text-grey-6 q-mb-md">{{ errorCargaDetalles }}</p>
          <q-btn
            flat
            no-caps
            color="primary"
            icon="refresh"
            label="Reintentar"
            @click="cargarDetallesPresupuesto"
          />
        </div>

        <template v-else-if="detalleRegistrado">
          <q-table
            :data="detallesPresupuesto"
            :columns="columnasDetalles"
            row-key="id"
            flat
            bordered
            dense
            hide-bottom
            :pagination="{ rowsPerPage: 0 }"
            class="q-mb-md"
          >
            <template v-slot:body-cell-spent_amount="props">
              <q-td :props="props">{{ formatCurrency(props.row.spent_amount) }}</q-td>
            </template>
            <template v-slot:body-cell-order_total="props">
              <q-td :props="props">{{ formatCurrency(props.row.order_total) }}</q-td>
            </template>
          </q-table>
          <div class="row justify-end q-mb-md">
            <q-badge color="primary" class="text-subtitle2 q-px-md q-py-sm" style="border-radius: 8px;">
              Total del pedido: {{ formatCurrency(totalDetallePresupuesto) }}
            </q-badge>
          </div>
        </template>

        <div v-else-if="sinDetalleRegistrado" class="budget-sin-detalles q-pa-lg text-center">
          <q-icon name="inventory_2" size="48px" color="grey-5" class="q-mb-md" />
          <p class="text-body1 text-grey-8 q-mb-xs">
            Debes agregar el detalle del presupuesto para registrar áreas, cantidades y montos.
          </p>
          <p class="text-body2 text-grey-6 q-mb-md">
            Este presupuesto aún no tiene detalle registrado. Puedes crearlo ahora si lo necesitas.
          </p>
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="add"
            label="Agregar detalle del presupuesto"
            @click="abrirCreacionDetalle"
          />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions align="right" class="q-pa-md">
        <q-btn
          v-if="detalleRegistrado"
          flat
          no-caps
          color="primary"
          icon="electrical_services"
          label="Gestionar detalles"
          @click="abrirCreacionDetalle"
        />
        <q-btn
          unelevated
          no-caps
          label="Cerrar"
          color="grey-3"
          text-color="grey-9"
          @click="cerrarResumenModal"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <budget-detail-dialog
    v-model="isDetailDialogOpen"
    :budget="presupuestoGuardado"
    @saved="onDetallesActualizados"
  />
  </div>
</template>

<script>
/**
 * Budget.vue
 *
 * Componente de registro de Presupuestos.
 */
import { budgetApi } from 'src/api/budget.api';
import { costCenterApi } from 'src/api/costCenter.api';
import { colaboradoresApi } from 'src/api/colaboradores.api';
import { GetBudgetDetails } from '../../application/GetBudgetDetails';
import BudgetDetailDialog from './BudgetDetailDialog.vue';

function uuidv4 () {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    var v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function esVacio (valor) {
  return valor === null || valor === undefined || String(valor).trim() === '';
}

function valorDefinido (valor, defecto) {
  return valor !== null && valor !== undefined ? valor : defecto;
}

function generarAniosFiscales () {
  const actual = new Date().getFullYear();
  const opciones = [];
  for (let a = actual - 2; a <= actual + 5; a++) {
    opciones.push({ value: a, label: String(a) });
  }
  return opciones;
}

const ESTADO_OPCIONES = [
  { value: 'Vigente', label: 'Vigente' },
  { value: 'En ejecución', label: 'En ejecución' },
  { value: 'En evaluación', label: 'En evaluación' },
  { value: 'Pendiente', label: 'Pendiente' }
];

export default {
  name: 'Budget',

  components: { BudgetDetailDialog },

  emits: ['saved'],

  data () {
    return {
      form: {
        name: '',
        fiscal_year: new Date().getFullYear(),
        responsible_area: null,
        cost_center_id: null,
        status: 'Pendiente'
      },
      guardando: false,
      cargandoDatos: true,
      errorGlobal: '',
      centrosCostoRaw: [],
      colaboradoresRaw: [],
      colaboradoresFiltrados: [],
      aniosFiscales: generarAniosFiscales(),
      estadoOpciones: ESTADO_OPCIONES,
      isResumenModalOpen: false,
      isDetailDialogOpen: false,
      presupuestoGuardado: null,
      detallesPresupuesto: [],
      cargandoDetalles: false,
      errorCargaDetalles: '',
      columnasDetalles: [
        { name: 'detail_date', label: 'Fecha', field: 'detail_date', align: 'left' },
        { name: 'area_name', label: 'Área', field: 'area_name', align: 'left' },
        { name: 'description', label: 'Descripción', field: 'description', align: 'left' },
        { name: 'quantity', label: 'Cantidad', field: 'quantity', align: 'center' },
        { name: 'spent_amount', label: 'Precio unitario', field: 'spent_amount', align: 'right' },
        { name: 'order_total', label: 'Total pedido', field: 'order_total', align: 'right' }
      ]
    };
  },

  computed: {
    sinCentrosCosto () {
      return !this.cargandoDatos && this.centrosCostoRaw.length === 0;
    },
    centrosCostoOpciones () {
      return this.centrosCostoRaw.map(cc => ({
        value: cc.id,
        label: cc.name + ' (' + cc.code + ')'
      }));
    },
    detalleRegistrado () {
      return !this.cargandoDetalles
        && !this.errorCargaDetalles
        && this.detallesPresupuesto.length > 0;
    },
    sinDetalleRegistrado () {
      return !this.cargandoDetalles
        && !this.errorCargaDetalles
        && this.detallesPresupuesto.length === 0;
    },
    totalDetallePresupuesto () {
      return this.detallesPresupuesto.reduce(
        (sum, row) => sum + (Number(row.order_total) || 0),
        0
      );
    }
  },

  async created () {
    await this.cargarDatosReferencia();
  },

  watch: {
    isDetailDialogOpen (abierto) {
      if (!abierto && this.presupuestoGuardado) {
        this.isResumenModalOpen = true;
      }
    }
  },

  methods: {
    async cargarDatosReferencia () {
      this.cargandoDatos = true;
      try {
        const [centros, colaboradores] = await Promise.all([
          costCenterApi.getAll().catch(() => []),
          colaboradoresApi.getAll().catch(() => [])
        ]);

        this.centrosCostoRaw = Array.isArray(centros) ? centros : [];

        const lista = Array.isArray(colaboradores) ? colaboradores : [];
        this.colaboradoresRaw = lista
          .filter(c => c.estado === 'Activo' || c.estado === 'ACTIVO')
          .map(c => ({
            value: c.nombreCompleto || c.id,
            label: c.nombreCompleto + (c.codigoCargo ? ' — ' + c.codigoCargo : '')
          }));
        this.colaboradoresFiltrados = this.colaboradoresRaw.slice();
      } catch (e) {
        this.errorGlobal = 'Error al cargar datos de referencia. Recarga la página.';
      } finally {
        this.cargandoDatos = false;
      }
    },

    filtrarColaboradores (val, update) {
      update(() => {
        if (!val || !val.trim()) {
          this.colaboradoresFiltrados = this.colaboradoresRaw.slice();
        } else {
          const term = val.toLowerCase().trim();
          this.colaboradoresFiltrados = this.colaboradoresRaw.filter(
            c => c.label.toLowerCase().includes(term)
          );
        }
      });
    },

    reglaNombreRequerido (val) {
      return !esVacio(val) || 'El nombre del presupuesto es obligatorio.';
    },
    reglaNombreLongitud (val) {
      if (esVacio(val)) return true;
      return String(val).trim().length >= 3 || 'El nombre debe tener al menos 3 caracteres.';
    },
    reglaAnioRequerido (val) {
      return (val !== null && val !== undefined) || 'Debes seleccionar un año fiscal.';
    },
    reglaAreaRequerida (val) {
      return !esVacio(val) || 'Debes seleccionar un área responsable.';
    },
    reglaCentroRequerido (val) {
      return !esVacio(val) || 'Debes seleccionar un centro de costo.';
    },
    reglaEstadoRequerido (val) {
      return !esVacio(val) || 'Debes seleccionar un estado.';
    },

    _construirPayload () {
      const errors = [];

      const nombre = (this.form.name || '').trim();
      if (!nombre) errors.push('El nombre del presupuesto es obligatorio.');
      else if (nombre.length < 3) errors.push('El nombre debe tener al menos 3 caracteres.');

      if (this.form.fiscal_year === null || this.form.fiscal_year === undefined) {
        errors.push('Debes seleccionar un año fiscal.');
      }
      if (esVacio(this.form.responsible_area)) {
        errors.push('Debes seleccionar un área responsable.');
      }

      if (esVacio(this.form.cost_center_id)) {
        errors.push('Debes seleccionar un centro de costo.');
      } else {
        const existeCentro = this.centrosCostoRaw.some(cc => cc.id === this.form.cost_center_id);
        if (!existeCentro) {
          errors.push('El centro de costo seleccionado ya no existe en el sistema. Verifica los datos.');
        }
      }

      if (esVacio(this.form.status)) {
        errors.push('Debes seleccionar un estado.');
      }

      if (errors.length) return { ok: false, errors };

      return {
        ok: true,
        payload: {
          id: uuidv4(),
          name: nombre,
          fiscalYear: this.form.fiscal_year,
          responsibleArea: this.form.responsible_area,
          costCenterId: this.form.cost_center_id,
          status: this.form.status
        }
      };
    },

    async onGuardar () {
      this.errorGlobal = '';

      const formularioValido = await this.$refs.formRef.validate();
      if (!formularioValido) return;

      const resultado = this._construirPayload();
      if (!resultado.ok) {
        this.errorGlobal = resultado.errors.join(' · ');
        return;
      }

      this.guardando = true;
      try {
        const creado = await budgetApi.create(resultado.payload);
        this.presupuestoGuardado = this._normalizarPresupuesto(creado, resultado.payload);

        this.$q.notify({
          type: 'positive',
          icon: 'check_circle',
          message: `Presupuesto "${this.presupuestoGuardado.name}" creado correctamente.`,
          caption: `Año fiscal: ${this.presupuestoGuardado.fiscal_year}`,
          position: 'top-right',
          timeout: 3000
        });

        this.limpiar();
        this.isResumenModalOpen = true;
        await this.cargarDetallesPresupuesto();
        this.$emit('saved', this.presupuestoGuardado);
      } catch (e) {
        let mensaje = 'No se pudo guardar el presupuesto. Intenta de nuevo.';
        if (e && Array.isArray(e.fieldErrors) && e.fieldErrors.length) {
          mensaje = e.fieldErrors.map(err => err.message).join(' · ');
        } else if (e && e.message) {
          mensaje = e.message;
        }
        this.errorGlobal = mensaje;
        this.$q.notify({
          type: 'negative',
          icon: 'error_outline',
          message: mensaje,
          position: 'top-right',
          timeout: 5000
        });
      } finally {
        this.guardando = false;
      }
    },

    limpiar () {
      this.form.name = '';
      this.form.fiscal_year = new Date().getFullYear();
      this.form.responsible_area = null;
      this.form.cost_center_id = null;
      this.form.status = 'Pendiente';
      this.errorGlobal = '';
      if (this.$refs.formRef) {
        this.$refs.formRef.resetValidation();
      }
    },

    _normalizarPresupuesto (respuesta, payload) {
      return {
        id: (respuesta && respuesta.id) || payload.id,
        name: (respuesta && respuesta.name) || payload.name,
        fiscal_year: (respuesta && respuesta.fiscal_year) != null
          ? respuesta.fiscal_year
          : payload.fiscalYear,
        responsible_area: (respuesta && respuesta.responsible_area) || payload.responsibleArea,
        cost_center_id: (respuesta && respuesta.cost_center_id) || payload.costCenterId,
        status: (respuesta && respuesta.status) || payload.status
      };
    },

    _normalizarDetalle (row) {
      if (!row) return row;
      return {
        id: row.id,
        area_name: valorDefinido(row.area_name, valorDefinido(row.areaName, '')),
        description: valorDefinido(row.description, ''),
        quantity: valorDefinido(row.quantity, 1),
        spent_amount: valorDefinido(row.spent_amount, valorDefinido(row.spentAmount, 0)),
        order_total: valorDefinido(row.order_total, valorDefinido(row.orderTotal, 0)),
        detail_date: valorDefinido(row.detail_date, valorDefinido(row.detailDate, ''))
      };
    },

    async cargarDetallesPresupuesto () {
      if (!this.presupuestoGuardado || !this.presupuestoGuardado.id) return;
      this.cargandoDetalles = true;
      this.errorCargaDetalles = '';
      try {
        const getDetails = new GetBudgetDetails();
        const lista = await getDetails.execute(this.presupuestoGuardado.id);
        this.detallesPresupuesto = (Array.isArray(lista) ? lista : []).map(this._normalizarDetalle);
      } catch (e) {
        this.detallesPresupuesto = [];
        this.errorCargaDetalles = (e && e.message)
          ? e.message
          : 'Error al consultar el detalle. Verifica tu conexión e intenta de nuevo.';
      } finally {
        this.cargandoDetalles = false;
      }
    },

    abrirCreacionDetalle () {
      if (!this.presupuestoGuardado || !this.presupuestoGuardado.id) {
        this.$q.notify({
          type: 'warning',
          icon: 'warning',
          message: 'No se puede abrir el detalle: el presupuesto no tiene identificador.',
          position: 'top-right',
          timeout: 4000
        });
        return;
      }
      this.isResumenModalOpen = false;
      this.$nextTick(() => {
        this.isDetailDialogOpen = true;
      });
    },

    async onDetallesActualizados () {
      await this.cargarDetallesPresupuesto();
    },

    cerrarResumenModal () {
      this.isResumenModalOpen = false;
      this.presupuestoGuardado = null;
      this.detallesPresupuesto = [];
      this.errorCargaDetalles = '';
    },

    getStatusColor (status) {
      const map = {
        Vigente: 'positive',
        'En ejecución': 'info',
        'En evaluación': 'warning',
        Pendiente: 'grey'
      };
      return map[status] || 'grey';
    },

    formatCurrency (value) {
      return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(value || 0);
    }
  }
};
</script>

<style scoped>
.budget-card {
  border-radius: 16px;
}
.budget-lead {
  line-height: 1.5;
  max-width: 52em;
}
.budget-input >>> .q-field__control {
  min-height: 52px !important;
  border-radius: 12px !important;
  padding-left: 14px !important;
  padding-right: 14px !important;
  font-size: 15px;
}
.budget-input >>> input.q-placeholder,
.budget-input >>> .q-field__native {
  font-size: 15px;
}
.budget-missing-banner {
  background: #fffbeb;
  border: 1px solid #fde68a;
  border-radius: 10px;
}
.budget-error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
}
.budget-resumen-modal {
  min-width: 640px;
  max-width: 92vw;
  border-radius: 12px;
}
.budget-resumen-header {
  background: #f8fafc;
}
.budget-resumen-body {
  background: #f8fafc;
  max-height: 65vh;
  overflow-y: auto;
}
.budget-resumen-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px;
}
.budget-resumen-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #94a3b8;
  margin-bottom: 4px;
}
.budget-resumen-value {
  font-size: 15px;
  font-weight: 500;
  color: #0f172a;
}
.budget-sin-detalles {
  background: #fff;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
}
.budget-sin-detalles--error {
  border-color: #fecaca;
  background: #fef2f2;
}
</style>
