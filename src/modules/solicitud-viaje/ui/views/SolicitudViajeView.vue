<template>
  <div class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div class="col title-main">
        Solicitud de Viaje
      </div>
    </div>

    <q-stepper
      v-model="store.currentStep"
      ref="stepper"
      color="primary"
      animated
      flat
      bordered
      class="wizard-stepper"
    >
      <!-- PASO 1: Identificación -->
      <q-step :name="1" title="Identificación" icon="person" :done="store.currentStep > 1">
        <StepIdentificacion />
      </q-step>

      <!-- PASO 2: Tipo de Servicio -->
      <q-step :name="2" title="Tipo de Servicio" icon="settings" :done="store.currentStep > 2">
        <StepTipoServicio />
      </q-step>

      <!-- PASO 3: Transporte -->
      <q-step :name="3" title="Transporte" icon="directions_bus" :done="store.currentStep > 3">
        <StepTransporte />
      </q-step>

      <!-- PASO 4: Alojamiento -->
      <q-step :name="4" title="Alojamiento" icon="hotel" :done="store.currentStep > 4">
        <StepAlojamiento />
      </q-step>

      <!-- PASO 5: Personas -->
      <q-step :name="5" title="Personas" icon="groups" :done="store.currentStep > 5">
        <StepPersonas />
      </q-step>

      <!-- PASO 6: Justificación -->
      <q-step :name="6" title="Justificación" icon="description" :done="store.currentStep > 6">
        <StepJustificacion />
      </q-step>

      <!-- PASO 7: Revisión -->
      <q-step :name="7" title="Revisión" icon="preview" :done="store.currentStep > 7">
        <StepRevision />
      </q-step>

      <!-- NAVEGACIÓN -->
      <template v-slot:navigation>
        <q-stepper-navigation class="action-buttons">
          <q-btn
            v-if="store.currentStep < 7"
            @click="next"
            unelevated
            class="btn-primario"
            label="Siguiente"
          />
          <q-btn
            v-else
            @click="submit"
            unelevated
            class="btn-primario"
            label="Enviar Solicitud"
            :loading="store.loading"
          >
            <template v-slot:loading> ⏳ Guardando... </template>
          </q-btn>

          <q-btn
            v-if="store.currentStep > 1"
            unelevated
            class="btn-secundario"
            @click="store.setStep(store.currentStep - 1)"
            label="Anterior"
          />
        </q-stepper-navigation>
        
        <div v-if="store.error" class="text-negative q-mt-md q-px-md">
          {{ store.error }}
        </div>
      </template>
    </q-stepper>
  </div>
</template>

<script>
import { useSolicitudViajeStore } from '../../store/solicitudViaje.store';
import StepIdentificacion from '../components/StepIdentificacion.vue';
import StepTipoServicio from '../components/StepTipoServicio.vue';
import StepTransporte from '../components/StepTransporte.vue';
import StepAlojamiento from '../components/StepAlojamiento.vue';
import StepPersonas from '../components/StepPersonas.vue';
import StepJustificacion from '../components/StepJustificacion.vue';
import StepRevision from '../components/StepRevision.vue';

export default {
  name: 'SolicitudViajeView',
  components: {
    StepIdentificacion,
    StepTipoServicio,
    StepTransporte,
    StepAlojamiento,
    StepPersonas,
    StepJustificacion,
    StepRevision
  },
  setup() {
    const store = useSolicitudViajeStore();
    return { store };
  },
  methods: {
    next() {
      // Aquí se podría añadir validación por paso
      this.store.setStep(this.store.currentStep + 1);
    },
    async submit() {
      try {
        await this.store.createSolicitud();
        this.$q.notify({
          type: 'positive',
          message: 'Solicitud de viaje creada exitosamente'
        });
        this.store.resetForm();
        this.$router.push('/abastecimiento/solicitudes-viaje/lista');
      } catch (err) {
        console.error(err);
      }
    }
  }
}
</script>

<style scoped>
.title-main {
  font-size: 24px !important;
  font-weight: 600 !important;
  color: #111827 !important;
}

.wizard-stepper {
  border-radius: 12px;
}

::v-deep .q-stepper__header {
  border-bottom: 1px solid #E5E7EB;
}

/* --- ESTILOS DE BOTONES (44px) --- */
.action-buttons {
  display: flex;
  flex-direction: row-reverse;
  justify-content: flex-start;
  gap: 12px;
  padding: 24px;
}

::v-deep .btn-primario, 
::v-deep .btn-secundario {
  height: 44px !important;
  padding: 0 16px !important;
  border-radius: 8px !important;
  min-width: 120px !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  text-transform: none !important;
}

::v-deep .btn-primario {
  background: #2563EB !important;
  color: white !important;
}

::v-deep .btn-primario:hover {
  background: #1D4ED8 !important;
}

::v-deep .btn-secundario {
  background: transparent !important;
  border: 1px solid #D1D5DB !important;
  color: #374151 !important;
}

::v-deep .btn-secundario:hover {
  background: #F3F4F6 !important;
}
</style>
