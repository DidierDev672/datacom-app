<template>
  <q-card flat bordered class="cost-center-card q-pa-md">
    <!-- Cabecera -->
    <q-card-section class="q-pb-sm">
      <div class="text-h6 text-weight-bold text-dark">Registrar Centro de Costo</div>
      <p class="cost-center-lead q-mb-none q-mt-sm text-body2 text-grey-8">
        Completa los datos del centro de costo. Todos los campos son obligatorios.
      </p>
    </q-card-section>

    <q-separator class="q-my-sm" />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onGuardar">

        <!-- ── NOMBRE ───────────────────────────────────────── -->
        <div class="text-caption text-weight-medium text-grey-7 q-mb-xs">
          Nombre del centro de costo
        </div>
        <q-input
          id="cost-center-name"
          v-model.trim="form.name"
          outlined
          hide-bottom-space
          class="cost-center-input"
          placeholder="Ej: Marketing Digital, Desarrollo App Paciente"
          maxlength="150"
          :rules="[reglaNombreRequerido, reglaNombreLongitud]"
          lazy-rules
        >
          <template v-slot:prepend>
            <q-icon name="label" color="grey-6" size="20px" />
          </template>
        </q-input>

        <!-- ── PRESUPUESTO ─────────────────────────────────── -->
        <div class="text-caption text-weight-medium text-grey-7 q-mt-lg q-mb-xs">
          Presupuesto asignado
        </div>
        <q-input
          id="cost-center-budget"
          v-model="budgetDisplay"
          outlined
          hide-bottom-space
          type="text"
          class="cost-center-input"
          placeholder="Ej: 5.000.000,00"
          :rules="[reglaPresupuestoRequerido, reglaPresupuestoPositivo]"
          lazy-rules
          @input="onBudgetInput"
        >
          <template v-slot:prepend>
            <q-icon name="attach_money" color="grey-6" size="20px" />
          </template>
          <template v-slot:hint>
            Ingresa el monto en pesos colombianos (COP)
          </template>
        </q-input>

        <!-- ── ESTADO ──────────────────────────────────────── -->
        <div class="text-caption text-weight-medium text-grey-7 q-mt-lg q-mb-xs">
          Estado
        </div>
        <q-select
          id="cost-center-state"
          v-model="form.state"
          outlined
          hide-bottom-space
          emit-value
          map-options
          class="cost-center-input"
          :options="estadoOpciones"
          option-value="value"
          option-label="label"
          behavior="menu"
          :rules="[reglaEstadoRequerido]"
          lazy-rules
        >
          <template v-slot:prepend>
            <q-icon name="toggle_on" color="grey-6" size="20px" />
          </template>
          <template v-slot:option="{ opt, selected, toggleOption }">
            <q-item
              :key="opt.value"
              clickable
              :active="selected"
              active-class="cost-center-opt-active"
              @click="toggleOption(opt)"
            >
              <q-item-section avatar>
                <q-icon :name="opt.icon" :color="opt.color" size="18px" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ opt.label }}</q-item-label>
                <q-item-label caption>{{ opt.description }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>

        <!-- ── ERRORES GLOBALES ───────────────────────────── -->
        <div
          v-if="errorGlobal"
          class="cost-center-error-banner q-mt-md q-pa-sm row items-start gap-sm"
        >
          <q-icon name="error_outline" color="negative" size="18px" class="q-mt-xs" />
          <span class="text-caption text-negative">{{ errorGlobal }}</span>
        </div>

        <!-- ── ACCIONES ───────────────────────────────────── -->
        <div class="row q-gutter-sm justify-end q-mt-xl">
          <q-btn
            flat
            no-caps
            color="grey-8"
            label="Limpiar"
            type="button"
            :disable="guardando"
            @click="limpiar"
          />
          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="save"
            label="Guardar centro de costo"
            type="submit"
            :loading="guardando"
          />
        </div>

      </q-form>
    </q-card-section>
  </q-card>
</template>

<script>
/**
 * CostCenter.vue
 *
 * Componente de registro de Centros de Costo.
 *
 * Responsabilidad única (SRP): solo gestiona el formulario de creación.
 * La comunicación HTTP está delegada al puerto costCenterApi (Hexagonal).
 *
 * Impacto ético (Heurística del Temor):
 *  - Valida y sanitiza todos los datos antes de enviarlos (fail-safe).
 *  - El campo budget se trata como dato financiero sensible: nunca se
 *    persiste vacío ni con valor negativo, protegiendo la integridad
 *    presupuestaria del usuario.
 *  - El UUID se genera en cliente para garantizar idempotencia.
 */
import { costCenterApi } from 'src/api/costCenter.api';

/**
 * Genera un UUID v4 usando la Web Crypto API nativa.
 * Compatible con todos los navegadores modernos y Node >= 14.17.
 * Sin dependencias externas — principio de Minimalismo Tecnológico (Heurística del Temor).
 */
function uuidv4 () {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback para entornos sin crypto.randomUUID (Node < 14.17)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0;
    var v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ── Opciones de estado con metadatos visuales ────────────────────────────────
const ESTADO_OPCIONES = [
  {
    value: 'ACTIVE',
    label: 'Activo',
    description: 'El centro de costo está operativo',
    icon: 'check_circle',
    color: 'positive'
  },
  {
    value: 'INACTIVE',
    label: 'Inactivo',
    description: 'Temporalmente sin actividad',
    icon: 'pause_circle',
    color: 'warning'
  },
  {
    value: 'COMPLETED',
    label: 'Completado',
    description: 'Ciclo de vida finalizado',
    icon: 'task_alt',
    color: 'info'
  }
];

// ── Generador de código único legible (CC-XXXXXXXX) ──────────────────────────
function generarCode () {
  return 'CC-' + Math.random().toString(36).toUpperCase().slice(2, 10);
}

// ── Validaciones puras (sin dependencia del componente) ──────────────────────
function esVacio (valor) {
  return valor === null || valor === undefined || String(valor).trim() === '';
}

export default {
  name: 'CostCenter',

  emits: ['saved'],

  data () {
    return {
      form: {
        name: '',
        budget: null,
        state: null
      },
      budgetDisplay: '',
      guardando: false,
      errorGlobal: '',
      estadoOpciones: ESTADO_OPCIONES
    };
  },

  methods: {
    // ── Reglas de validación (Quasar q-form) ─────────────────────────────────

    reglaNombreRequerido (val) {
      return !esVacio(val) || 'El nombre del centro de costo es obligatorio.';
    },

    reglaNombreLongitud (val) {
      if (esVacio(val)) return true; // reglaNombreRequerido ya lo captura
      return String(val).trim().length >= 3 ||
        'El nombre debe tener al menos 3 caracteres.';
    },

    getBudgetValue (val) {
      const raw = String(val || '').replace(/[^0-9,\.]/g, '');
      if (!raw) return null;
      const normalized = raw.replace(/\./g, '').replace(/,/g, '.');
      const numberValue = Number(normalized);
      return Number.isNaN(numberValue) ? null : numberValue;
    },

    formatBudgetValue (value) {
      if (value === null || value === undefined || value === '') {
        return '';
      }
      const [integerPart, decimalPart] = String(value).split('.');
      const formattedInteger = Number(integerPart || 0).toLocaleString('es-CO');
      return decimalPart != null ? `${formattedInteger},${decimalPart}` : formattedInteger;
    },

    onBudgetInput (value) {
      const raw = String(value || '').replace(/[^0-9,\.]/g, '');
      if (!raw) {
        this.budgetDisplay = '';
        this.form.budget = null;
        return;
      }

      let integerPart = '';
      let decimalPart = '';

      if (raw.includes(',')) {
        const [left, right] = raw.split(',', 2);
        integerPart = left.replace(/\./g, '').replace(/^0+(?=\d)/, '') || '0';
        decimalPart = String(right || '').replace(/[^0-9]/g, '').slice(0, 2);
      } else {
        integerPart = raw.replace(/\./g, '').replace(/^0+(?=\d)/, '') || '0';
      }

      const normalized = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;
      const numericValue = Number(normalized);

      this.form.budget = Number.isNaN(numericValue) ? null : numericValue;
      this.budgetDisplay = decimalPart
        ? `${Number(integerPart).toLocaleString('es-CO')},${decimalPart}`
        : Number(integerPart).toLocaleString('es-CO');
    },

    reglaPresupuestoRequerido (val) {
      const numero = this.getBudgetValue(val);
      return (numero !== null && numero !== undefined && String(numero).trim() !== '') ||
        'El presupuesto asignado es obligatorio.';
    },

    reglaPresupuestoPositivo (val) {
      const numero = this.getBudgetValue(val);
      if (numero === null || numero === undefined || String(numero).trim() === '') return true;
      return numero > 0 || 'El presupuesto debe ser un valor positivo mayor a cero.';
    },

    reglaEstadoRequerido (val) {
      return !esVacio(val) || 'Debes seleccionar un estado.';
    },

    // ── Validación consolidada antes de enviar ────────────────────────────────
    _construirPayload () {
      const errors = [];

      const nombre = (this.form.name || '').trim();
      if (!nombre) errors.push('El nombre del centro de costo es obligatorio.');
      else if (nombre.length < 3) errors.push('El nombre debe tener al menos 3 caracteres.');

      const presupuesto = this.form.budget;
      if (presupuesto === null || presupuesto === undefined || String(presupuesto).trim() === '') {
        errors.push('El presupuesto asignado es obligatorio.');
      } else {
        const num = Number(presupuesto);
        if (isNaN(num)) errors.push('El presupuesto debe ser un valor numérico válido.');
        else if (num <= 0) errors.push('El presupuesto debe ser un valor positivo mayor a cero.');
      }

      if (esVacio(this.form.state)) {
        errors.push('Debes seleccionar un estado.');
      }

      if (errors.length) return { ok: false, errors };

      return {
        ok: true,
        payload: {
          id: uuidv4(),
          code: generarCode(),
          name: nombre,
          budget: Number(Number(presupuesto).toFixed(2)),
          state: this.form.state
        }
      };
    },

    // ── Flujo de guardado ─────────────────────────────────────────────────────
    async onGuardar () {
      this.errorGlobal = '';

      // Dispara las reglas visuales de Quasar
      const formularioValido = await this.$refs.formRef.validate();
      if (!formularioValido) return;

      // Segunda capa de validación (fail-safe antes del HTTP)
      const resultado = this._construirPayload();
      if (!resultado.ok) {
        this.errorGlobal = resultado.errors.join(' · ');
        return;
      }

      this.guardando = true;
      try {
        await costCenterApi.create(resultado.payload);

        this.$q.notify({
          type: 'positive',
          icon: 'check_circle',
          message: `Centro de costo "${resultado.payload.name}" creado correctamente.`,
          caption: `Código: ${resultado.payload.code}`,
          position: 'top-right',
          timeout: 3000
        });

        this.limpiar();
        this.$emit('saved', resultado.payload);
      } catch (e) {
        const mensaje =
          (e && e.message)
            ? e.message
            : 'No se pudo guardar el centro de costo. Intenta de nuevo.';
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

    // ── Limpieza del formulario ───────────────────────────────────────────────
    limpiar () {
      this.form.name = '';
      this.form.budget = null;
      this.form.state = null;
      this.errorGlobal = '';
      if (this.$refs.formRef) {
        this.$refs.formRef.resetValidation();
      }
    }
  }
};
</script>

<style scoped>
/* ── Tarjeta principal ─────────────────────────────────────────────────────── */
.cost-center-card {
  border-radius: 16px;
}

.cost-center-lead {
  line-height: 1.5;
  max-width: 52em;
}

/* ── Campos de entrada ─────────────────────────────────────────────────────── */
.cost-center-input >>> .q-field__control {
  min-height: 52px !important;
  border-radius: 12px !important;
  padding-left: 14px !important;
  padding-right: 14px !important;
  font-size: 15px;
}

.cost-center-input >>> input.q-placeholder,
.cost-center-input >>> .q-field__native {
  font-size: 15px;
}

/* ── Banner de error global (fail-safe) ───────────────────────────────────── */
.cost-center-error-banner {
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  display: flex;
  align-items: flex-start;
  gap: 8px;
  /* Precaución ética: el banner debe ser visible sin causar ansiedad.
     Se usa color suave pero inequívoco para comunicar el error. */
}

/* ── Opción activa del dropdown ───────────────────────────────────────────── */
.cost-center-opt-active {
  background: #f0fdf4;
  color: #166534;
}
</style>
