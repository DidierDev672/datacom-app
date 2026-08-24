<template>
  <div class="step-container">
    <div class="step-title">Información del servicio</div>
    <p class="text-subtitle2 text-grey-7 q-mb-md">Seleccione los servicios que requiere para su viaje</p>
    
    <div class="row justify-center q-pt-md">
      <q-btn-toggle
        v-model="store.form.tipoSolicitud"
        toggle-color="primary"
        toggle-text-color="positive"
        flat
        bordered
        unelevated
        :options="[
          { label: 'Transporte', value: 'TRANSPORTE', icon: 'directions_bus' },
          { label: 'Alojamiento', value: 'ALOJAMIENTO', icon: 'hotel' },
          { label: 'Ambos', value: 'AMBOS', icon: 'all_inclusive' }
        ]"
        class="service-toggle"
      />
    </div>
  </div>
</template>

<script>
import { useSolicitudViajeStore } from '../../store/solicitudViaje.store';

export default {
  name: 'StepTipoServicio',
  setup() {
    const store = useSolicitudViajeStore();
    return { store };
  }
}
</script>

<style scoped>
.step-container {
  padding: 24px;
  text-align: center;
}

.step-title {
  font-size: 18px;
  font-weight: 500;
  color: #111827;
  margin-bottom: 8px;
}

.service-toggle {
  border: 1px solid #D1D5DB;
  border-radius: 12px;
  overflow: hidden;
}

::v-deep .q-btn {
  padding: 24px 32px !important;
  font-weight: 500;
  min-width: 160px;
}

::v-deep .q-btn__content {
  flex-direction: column;
  gap: 8px;
}
</style>
