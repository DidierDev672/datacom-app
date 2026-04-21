<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Motivo -->
      <div class="col-12">
        <label class="sta-label q-mb-xs block">Motivo del viaje</label>
        <q-input
          v-model="store.solicitudActual.justificacion.motivoViaje"
          outlined
          type="textarea"
          placeholder="Describa el motivo detallado del viaje (mínimo 20 caracteres)"
          :rules="[
            val => !!val || 'El motivo es requerido',
            val => val.length >= 20 || 'Debe tener al menos 20 caracteres'
          ]"
          class="sta-input-area"
        />
      </div>

      <!-- Relación con proyecto -->
      <div class="col-12">
        <label class="sta-label q-mb-xs block">Relación con el proyecto</label>
        <q-input
          v-model="store.solicitudActual.justificacion.relacionProyecto"
          outlined
          type="textarea"
          placeholder="¿Cómo se relaciona este viaje con los objetivos del proyecto?"
          :rules="[val => !!val || 'La relación con el proyecto es requerida']"
          class="sta-input-area"
        />
      </div>

      <!-- Jefe Inmediato -->
      <div class="col-12 col-sm-6">
        <label class="sta-label q-mb-xs block">Jefe inmediato (Aprobador)</label>
        <q-input
          v-model="store.solicitudActual.aprobaciones.jefeInmediato"
          outlined
          dense
          placeholder="Nombre del jefe inmediato"
          :rules="[val => !!val || 'El nombre del jefe es requerido']"
          class="sta-input"
        />
      </div>

      <!-- Área Administrativa -->
      <div class="col-12 col-sm-6">
        <label class="sta-label q-mb-xs block">Área administrativa (Opcional)</label>
        <q-input
          v-model="store.solicitudActual.aprobaciones.areaAdministrativa"
          outlined
          dense
          placeholder="Nombre del responsable administrativo"
          class="sta-input"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useSolicitudTransporteStore } from '../../../store/solicitudTransporte.store';

export default {
  name: 'StepJustificacion',
  setup() {
    const store = useSolicitudTransporteStore();
    return { store };
  }
}
</script>

<style scoped>
.sta-label {
  font-size: var(--text-label);
  font-weight: var(--weight-label);
  color: var(--color-label);
}
.sta-input :deep(.q-field__control) {
  height: var(--input-height);
  border-radius: var(--input-border-radius);
}
.sta-input-area :deep(.q-field__control) {
  border-radius: var(--input-border-radius);
}
</style>
