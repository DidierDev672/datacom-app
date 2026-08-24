<template>
  <div class="solicitud-form-container">
    <q-stepper
      v-model="store.pasoActual"
      ref="stepper"
      color="primary"
      animated
      flat
      header-nav
      class="sta-stepper"
    >
      <!-- Paso 1 -->
      <q-step
        :name="1"
        title="Identificación"
        icon="assignment_ind"
        :done="store.pasoActual > 1"
      >
        <StepIdentificacion />
      </q-step>

      <!-- Paso 2 -->
      <q-step
        :name="2"
        title="Viaje"
        icon="flight_takeoff"
        :done="store.pasoActual > 2"
      >
        <StepViaje />
      </q-step>

      <!-- Paso 3 -->
      <q-step
        :name="3"
        title="Pasajeros"
        icon="people"
        :done="store.pasoActual > 3"
      >
        <StepPasajeros />
      </q-step>

      <!-- Paso 4 -->
      <q-step
        :name="4"
        title="Preferencias"
        icon="star_border"
        caption="Opcional"
        :done="store.pasoActual > 4"
      >
        <StepPreferencias />
      </q-step>

      <!-- Paso 5 -->
      <q-step
        :name="5"
        title="Justificación"
        icon="gavel"
        :done="store.pasoActual > 5"
      >
        <StepJustificacion />
      </q-step>

      <!-- Paso 6 -->
      <q-step
        :name="6"
        title="Revisión"
        icon="checklist"
      >
        <StepRevision @edit-step="goToStep" />
      </q-step>

      <!-- Navegación -->
      <template v-slot:navigation>
        <q-stepper-navigation class="row justify-between q-pa-md border-top">
          <q-btn
            v-if="store.pasoActual > 1"
            flat
            color="primary"
            @click="store.setPaso(store.pasoActual - 1)"
            label="Atrás"
            class="q-mr-sm sta-btn-nav"
          />
          <div v-else></div>

          <q-btn
            @click="onNext"
            color="primary"
            unelevated
            :label="store.pasoActual === 6 ? 'Enviar solicitud' : 'Siguiente'"
            :loading="store.isLoading"
            class="sta-btn-nav"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>

    <!-- Overlay Loading -->
    <q-inner-loading :showing="store.isLoading">
      <q-spinner-dots size="50px" color="primary" />
      <div class="q-mt-sm sta-label">Enviando solicitud...</div>
    </q-inner-loading>
  </div>
</template>

<script>
import { useSolicitudTransporteStore } from '../../store/solicitudTransporte.store';
import StepIdentificacion from './steps/StepIdentificacion.vue';
import StepViaje from './steps/StepViaje.vue';
import StepPasajeros from './steps/StepPasajeros.vue';
import StepPreferencias from './steps/StepPreferencias.vue';
import StepJustificacion from './steps/StepJustificacion.vue';
import StepRevision from './steps/StepRevision.vue';

export default {
  name: 'SolicitudForm',
  components: {
    StepIdentificacion,
    StepViaje,
    StepPasajeros,
    StepPreferencias,
    StepJustificacion,
    StepRevision
  },
  setup(props, { emit }) {
    const store = useSolicitudTransporteStore();

    const onNext = async () => {
      if (store.pasoActual === 3) {
        if (store.solicitudActual.pasajeros.length === 0) {
          return alert('Debe agregar al menos un pasajero');
        }
      }

      if (store.pasoActual < 6) {
        store.setPaso(store.pasoActual + 1);
      } else {
        await enviarSolicitud();
      }
    };

    const enviarSolicitud = async () => {
      try {
        const result = await store.create(store.solicitudActual);
        emit('success', result);
      } catch (err) {
        // El error ya se maneja en el store
      }
    };

    const goToStep = (paso) => {
      store.setPaso(paso);
    };

    return {
      store,
      onNext,
      goToStep
    };
  }
}
</script>

<style scoped>
.solicitud-form-container {
  width: 100%;
  margin: 20px 0px;
  padding: 20px;
}
.sta-stepper {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}
.border-top {
  border-top: 1px solid #f0f0f0;
}
.sta-btn-nav {
  min-width: 120px;
  height: 44px;
  font-weight: 600;
}
.sta-label {
  font-size: var(--text-label);
  color: var(--color-label);
}
</style>
