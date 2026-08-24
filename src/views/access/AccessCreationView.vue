<template>
  <!--
    AccessCreationView — Vista contenedora del wizard de creación de acceso.

    UX rationale (Guided Permission Management):
      - QStepper de Quasar v1 maneja la transición entre los 4 pasos
        (horizontal en desktop, vertical en mobile).
      - Cada paso es un componente independiente, con su propia validación.
      - Los botones de navegación viven en la vista, no en cada paso, para
        mantener una sola fuente de verdad del flujo.
      - Banner de error global, persistente pero descartable, para errores de red.
  -->
  <q-page class="ac-page">
    <div class="ac-container q-pa-md">

      <!-- Encabezado -->
      <div class="ac-header">
        <h1 class="text-h5 text-weight-semibold text-dark q-my-none">
          {{ store.isEditingExistingAccess ? 'Actualizar credenciales' : 'Crear acceso al sistema' }}
        </h1>
        <p class="text-caption text-grey-6 q-mt-xs q-mb-none">
          {{ store.isEditingExistingAccess
            ? 'Restablece el username y la contraseña de un colaborador que ya tiene acceso.'
            : 'Habilita las credenciales y opciones de seguridad para un colaborador.' }}
        </p>
      </div>

      <!-- Banner global de error -->
      <q-banner v-if="store.error" class="bg-red-1 text-red-9 q-mt-md" rounded>
        <template v-slot:avatar>
          <q-icon name="error" color="negative" />
        </template>
        {{ store.error }}
        <template v-slot:action>
          <q-btn flat dense rounded icon="close" @click="store.error = null" />
        </template>
      </q-banner>

      <!-- Stepper principal -->
      <q-card flat bordered class="ac-stepper-card q-mt-md">
        <q-stepper :value="store.currentStep" @input="onStepChange" ref="stepper" color="primary" flat animated
          :vertical="$q.screen.lt.md" header-nav alternative-labels done-color="positive" active-color="primary"
          done-icon="check" inactive-icon="radio_button_unchecked" active-icon="lens">
          <q-step :name="1" title="Colaborador" icon="radio_button_unchecked" active-icon="lens"
            :done="store.currentStep > 1">
            <CollaboratorSearch @selected="onCollaboratorSelected" />
          </q-step>

          <q-step :name="2" title="Credenciales" icon="radio_button_unchecked" active-icon="lens"
            :done="store.currentStep > 2" :disable="!store.canAdvanceFromStep1">
            <AccessCredentialsForm />
          </q-step>

          <q-step :name="3" title="Seguridad" icon="radio_button_unchecked" active-icon="lens"
            :done="store.currentStep > 3" :disable="!store.canAdvanceFromStep2">
            <SecurityOptionsForm />
          </q-step>

          <q-step :name="4" title="Confirmación" icon="radio_button_unchecked" active-icon="lens"
            :disable="!store.canAdvanceFromStep3">
            <AccessSummary @reset="onReset" />
          </q-step>

          <template v-slot:navigation>
            <q-stepper-navigation v-if="!store.isSuccess">
              <div class="row justify-between items-center q-gutter-sm">
                <q-btn v-if="store.currentStep > 1" flat no-caps color="grey-7" icon="arrow_back" label="Anterior"
                  :disable="store.isSaving" @click="onPrev" />
                <q-space />
                <q-btn v-if="store.currentStep < 4" unelevated no-caps rounded color="primary"
                  class="ac-btn-continue" icon-right="arrow_forward" label="Continuar"
                  :disable="!canContinue" @click="onNext" />
                <q-btn v-else unelevated no-caps rounded color="primary" icon="save"
                  :label="submitButtonLabel" :loading="store.isSaving"
                  :disable="!store.canAdvanceFromStep3" @click="onCreate" />
              </div>
            </q-stepper-navigation>
          </template>
        </q-stepper>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import AccessCredentialsForm from 'src/components/access/AccessCredentialsForm';
import AccessSummary from 'src/components/access/AccessSummary';
import CollaboratorSearch from 'src/components/access/CollaboratorSearch';
import SecurityOptionsForm from 'src/components/access/SecurityOptionsForm';
import { useAccessStore } from 'src/stores/accessStore';

export default {
  name: 'AccessCreationView',

  components: {
    CollaboratorSearch,
    AccessCredentialsForm,
    SecurityOptionsForm,
    AccessSummary
  },

  computed: {
    store() {
      return useAccessStore();
    },
    /**
     * Define si el botón "Continuar" debe estar habilitado en el paso actual.
     * Cada paso tiene su propio getter en el store.
     *
     * IMPORTANTE (Vue 2 + Pinia): leer getters del store desde un computed puede
     * no registrar todas las suscripciones a `state` subyacentes. Leyendo explícitamente
     * los campos relevantes garantizamos que al cambiar credenciales se re-evalúe y el
     * botón Continuar reactive correctamente en el Paso 2.
     */
    canContinue() {
      var st = this.store;
      // Dependencias para tracking reactivo (no eliminar estos accesos "vacíos").
      void st.username;
      void st.usernameAvailable;
      void st.password;
      void st.passwordConfirm;
      void st.selectedCollaborator;
      void st.isEditingExistingAccess;

      switch (st.currentStep) {
        case 1: return st.canAdvanceFromStep1;
        case 2: return st.canAdvanceFromStep2;
        case 3: return st.canAdvanceFromStep3;
        default: return false;
      }
    },
    submitButtonLabel() {
      if (this.store.isSaving) {
        return this.store.isEditingExistingAccess
          ? 'Actualizando credenciales...'
          : 'Creando acceso...';
      }
      return this.store.isEditingExistingAccess
        ? 'Actualizar credenciales'
        : 'Crear acceso';
    }
  },

  mounted() {
    // Reset defensivo si el usuario llega con datos previos en el store.
    this.store.resetForm();
  },

  beforeDestroy() {
    // Limpieza al salir del wizard.
    this.store.resetForm();
  },

  methods: {
    onStepChange(step) {
      this.store.goToStep(step);
    },
    onCollaboratorSelected() {
      // Avance automático al paso 2 al seleccionar colaborador.
      this.$nextTick(() => {
        this.store.goToStep(2);
      });
    },
    onPrev() {
      this.store.goToStep(this.store.currentStep - 1);
    },
    onNext() {
      if (!this.canContinue) return;
      this.store.goToStep(this.store.currentStep + 1);
    },
    async onCreate() {
      const result = await this.store.createAccess();
      if (result) {
        this.$q.notify({
          type: 'positive',
          message: this.store.isEditingExistingAccess
            ? 'Credenciales actualizadas correctamente'
            : 'Acceso creado correctamente',
          position: 'top-right',
          icon: 'check_circle',
          timeout: 2000
        });
      }
    },
    onReset() {
      // Tras "Crear otro acceso", volvemos al paso 1.
      this.store.goToStep(1);
    }
  }
};
</script>

<style scoped>
.ac-page {
  background-color: #F8FAFC;
  min-height: 100%;
}

.ac-container {
  max-width: 720px;
  margin: 0 auto;
}

.ac-header {
  margin-bottom: 8px;
}

.ac-stepper-card {
  border-radius: 16px !important;
  background: #fff;
}

/* Más respiración vertical en cada paso */
.ac-stepper-card>>>.q-stepper__content {
  padding: 24px;
}

/* Stepper: 3 estados visuales consistentes (pendiente / activo / completado) */
.ac-stepper-card>>>.q-stepper__tab--done {
  color: #4E9C4C !important;
}

.ac-stepper-card>>>.q-stepper__tab--done .q-stepper__dot span,
.ac-stepper-card>>>.q-stepper__tab--done .q-icon {
  color: #4E9C4C !important;
}

.ac-stepper-card>>>.q-stepper__tab--active {
  color: #1976D2 !important;
}

.ac-stepper-card>>>.q-stepper__tab--active .q-stepper__dot span,
.ac-stepper-card>>>.q-stepper__tab--active .q-icon {
  color: #1976D2 !important;
}

.ac-stepper-card>>>.q-stepper__tab:not(.q-stepper__tab--active):not(.q-stepper__tab--done) {
  color: #94A3B8 !important;
}

.ac-stepper-card>>>.q-stepper__tab:not(.q-stepper__tab--active):not(.q-stepper__tab--done) .q-stepper__dot span,
.ac-stepper-card>>>.q-stepper__tab:not(.q-stepper__tab--active):not(.q-stepper__tab--done) .q-icon {
  color: #94A3B8 !important;
}

/* Continuar: disabled explícito hasta completar el paso actual */
.ac-btn-continue {
  transition: opacity 0.2s ease, box-shadow 0.2s ease, transform 0.2s ease;
}

.ac-btn-continue.disabled,
.ac-btn-continue[disabled] {
  opacity: 0.5 !important;
  cursor: not-allowed !important;
  pointer-events: none;
  box-shadow: none !important;
}
</style>
