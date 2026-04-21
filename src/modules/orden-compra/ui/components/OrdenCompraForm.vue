<template>
  <div>
    <q-stepper
      v-model="step"
      ref="stepper"
      color="primary"
      animated
    >
      <!-- PASO 1: Identificación -->
      <q-step
        :name="1"
        title="Identificación"
        icon="feed"
        :done="step > 1"
      >
        <StepIdentificacion ref="step1" v-model="formData" />
      </q-step>

      <!-- PASO 2: Detalle (Ítems) -->
      <q-step
        :name="2"
        title="Detalle"
        icon="list"
        :done="step > 2"
      >
        <StepDetalle ref="step2" v-model="formData" />
      </q-step>

      <!-- PASO 3: Condiciones -->
      <q-step
        :name="3"
        title="Condiciones"
        icon="local_shipping"
        :done="step > 3"
      >
        <StepCondiciones ref="step3" v-model="formData" />
      </q-step>
      
      <!-- PASO 4: Aprobaciones -->
      <q-step
        :name="4"
        title="Aprobaciones"
        icon="verified_user"
        :done="step > 4"
      >
        <StepAprobaciones ref="step4" v-model="formData" />
      </q-step>

      <!-- NAVEGACIÓN DEFAULT -->
      <template v-slot:navigation>
        <q-stepper-navigation class="action-buttons">
          <q-btn 
            v-if="step < 4" 
            @click="siguientePaso" 
            unelevated
            class="btn-primario"
            label="Siguiente" 
          />
          <q-btn 
            v-else 
            @click="guardarOrden" 
            unelevated
            class="btn-primario"
            label="Crear orden de compra" 
            :loading="isLoading"
          >
            <template v-slot:loading>
              ⏳ Guardando...
            </template>
          </q-btn>
          
          <q-btn 
            v-if="step > 1" 
            unelevated
            class="btn-secundario"
            @click="$refs.stepper.previous()" 
            label="Atrás" 
          />
        </q-stepper-navigation>
        <div v-if="error" class="text-negative q-mt-md">
          {{ error }}
        </div>
      </template>
    </q-stepper>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import StepIdentificacion from './StepIdentificacion.vue';
import StepDetalle from './StepDetalle.vue';
import StepCondiciones from './StepCondiciones.vue';
import StepAprobaciones from './StepAprobaciones.vue';

export default {
  name: 'OrdenCompraForm',
  components: {
    StepIdentificacion,
    StepDetalle,
    StepCondiciones,
    StepAprobaciones
  },
  data() {
    return {
      step: 1,
      formData: {
        numero: '',
        fechaEmision: '',
        empresa: '',
        proyecto: '',
        porcentajeIva: 19,
        proveedor: {
          nombre: '',
          nit: '',
          direccion: '',
          telefono: '',
          email: ''
        },
        items: [],
        condiciones: {
          lugarEntrega: '',
          fechaEntrega: '',
          responsableRecepcion: '',
          formaPago: '',
          plazoPago: '',
          garantias: ''
        },
        observaciones: '',
        recomendaciones: '',
        aprobaciones: {
          elaboradoPor: '',
          revisadoPor: '',
          aprobadoPor: ''
        }
      }
    };
  },
  computed: {
    ...mapState('ordenCompra', ['isLoading', 'error'])
  },
  methods: {
    ...mapActions('ordenCompra', ['createOrden']),
    
    async siguientePaso() {
      // Validar el paso actual
      const stepComponent = this.$refs[`step${this.step}`];
      if (stepComponent && typeof stepComponent.validate === 'function') {
        const isValid = await stepComponent.validate();
        if (!isValid) return; // No avanzar si hay errores de validación
      }
      this.$refs.stepper.next();
    },

    async guardarOrden() {
      const stepComponent = this.$refs.step4;
      if (stepComponent && typeof stepComponent.validate === 'function') {
        const isValid = await stepComponent.validate();
        if (!isValid) return;
      }
      
      try {
        const result = await this.createOrden(this.formData);
        this.$emit('saved', result);
      } catch (err) {
        console.error('Error al guardar:', err);
      }
    }
  }
}
</script>

<style scoped>
/*
  ==========================================
  ESTILOS FRONTEND - ESPECIFICACIÓN UX
  ==========================================
*/

/* --- ENVOLTORIO GENERAL DEL INPUT --- */
/* Input -> Input 16px y espacio para label absoluto */
::v-deep .q-field {
  margin-top: 26px !important; 
  margin-bottom: 16px !important;
  width: 100% !important; /* Ancho 100% */
}

/* --- TAMAÑO IDEAL DEL INPUT Y ESTILO VISUAL --- */
::v-deep .q-field__control {
  height: 48px !important; /* Altura 48px */
  border: 1px solid #D1D5DB !important;
  border-radius: 8px !important; /* Border radius 8px */
  background: #FFFFFF !important; /* Diseño limpio */
  padding: 0 12px !important; /* Padding lateral 12px */
  overflow: visible !important;
  box-shadow: none !important;
}

/* Ocultar elementos decorativos por defecto de Quasar */
::v-deep .q-field__control:before,
::v-deep .q-field__control:after {
  display: none !important; 
}

/* Quitar padding de Quasar para label flotante (lo manejamos manual) */
::v-deep .q-field__control-container {
  padding: 0 !important;
}

/* --- TEXTO DEL INPUT (Lo que escribe el usuario debe ser lo más visible) --- */
::v-deep .q-field__native,
::v-deep .q-field__input {
  padding: 10px 0 !important; /* Padding V 10px -> total: 10px 12px */
  height: 100% !important;
  font-size: 14px !important; /* Input 14px 400 */
  font-weight: 400 !important;
  color: #111827 !important; /* Muy visible */
  line-height: normal !important;
}

/* --- PLACEHOLDER --- */
::v-deep .q-field__native::placeholder,
::v-deep .q-field__input::placeholder {
  color: #9CA3AF !important;
  opacity: 1 !important;
}

/* --- LABELS (Siempre visible, Nunca dentro del input) --- */
::v-deep .q-field__label {
  position: absolute !important;
  /* Mueve el label 24px hacia arriba, dando ~8px de margen efectivo hasta el borde del input */
  top: -24px !important; 
  left: 0 !important;
  transform: none !important; /* Elimina la animación de float */
  font-size: 14px !important; /* Label 14px 500 */
  font-weight: 500 !important;
  color: #6B7280 !important; /* gris */
  pointer-events: auto !important;
  line-height: 1 !important;
  max-width: 100% !important;
}

/* --- ESTADOS DEL INPUT --- */

/* Focus */
::v-deep .q-field--focused .q-field__control {
  border-color: #2563EB !important;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2) !important; /* Indica claramente dónde está el usuario */
}

/* Error */
::v-deep .q-field--error .q-field__control {
  border-color: #DC2626 !important;
  background: #FEF2F2 !important; /* Error visible sin confundir */
}

/* Disabled */
::v-deep .q-field--disabled .q-field__control {
  background: #F3F4F6 !important;
  cursor: not-allowed !important;
  opacity: 1 !important;
}
::v-deep .q-field--disabled .q-field__native {
  cursor: not-allowed !important;
}

/* Mantener el grid label color aunque haya error (opcional, evita doble rojo) */
::v-deep .q-field--error .q-field__label {
  color: #374151 !important; 
}

/* --- TEXTO DE AYUDA / MENSAJES (Ayuda 12px 400) --- */
::v-deep .q-field__bottom {
  padding: 6px 0 0 0 !important;
  font-size: 12px !important;
  font-weight: 400 !important;
  color: #6B7280 !important;
}
::v-deep .q-field--error .q-field__bottom {
  color: #DC2626 !important;
}
::v-deep .q-field__messages {
  line-height: 1.2 !important;
}

/* --- ESPACIADO DE SECCIONES Y SUBTÍTULOS --- */
/* Sección -> Sección -> 24px */
::v-deep .text-h6 {
  margin-top: 24px !important;
  margin-bottom: 24px !important;
  color: #111827 !important;
  font-weight: 500 !important;
  font-size: 18px !important; /* Subtítulos 18px 500 */
}

/* --- ESTILOS DE BOTONES (UX SPEC) --- */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

::v-deep .btn-primario, 
::v-deep .btn-secundario {
  height: 48px !important;
  padding: 0 16px !important;
  border-radius: 8px !important;
  min-width: 120px !important;
  font-size: 16px !important;
  font-weight: 600 !important;
  text-transform: none !important; /* Texto claro, sin ambigüedad */
}

/* Botón primario */
::v-deep .btn-primario {
  background: #2563EB !important;
  color: white !important;
}

::v-deep .btn-primario:hover:not(.disabled) {
  background: #1D4ED8 !important;
}

::v-deep .btn-primario:focus-visible,
::v-deep .btn-primario:focus {
  box-shadow: 0 0 0 2px rgba(37,99,235,0.3) !important;
}

/* Botón secundario */
::v-deep .btn-secundario {
  background: transparent !important;
  border: 1px solid #D1D5DB !important;
  color: #374151 !important;
}

::v-deep .btn-secundario:hover:not(.disabled) {
  background: #F3F4F6 !important;
}

/* Estado deshabilitado / Loading */
::v-deep .q-btn.disabled,
::v-deep .btn-primario.disabled,
::v-deep .btn-secundario.disabled {
  background: #E5E7EB !important;
  color: #9CA3AF !important;
  border: none !important;
  cursor: not-allowed !important;
  opacity: 1 !important;
}
</style>
