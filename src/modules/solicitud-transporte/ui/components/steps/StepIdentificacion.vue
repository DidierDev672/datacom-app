<template>
  <div class="q-pa-md">
    <div class="row q-col-gutter-md">
      <!-- Fecha -->
      <div class="col-12 col-sm-12">
        <label class="sta-label q-mb-xs block">Fecha</label>
        <q-input
          v-model="store.solicitudActual.fecha"
          outlined
          dense
          type="date"
          :rules="[val => !!val || 'La fecha es requerida']"
          class="sta-input"
        />
      </div>

      <!-- Proyecto -->
      <div class="col-12">
        <label class="sta-label q-mb-xs block">Proyecto</label>
        <q-input
          v-model="store.solicitudActual.proyecto"
          outlined
          dense
          placeholder="Nombre del proyecto"
          :rules="[val => !!val || 'El proyecto es requerido']"
          class="sta-input"
        />
      </div>

      <!-- Área -->
      <div class="col-12 col-sm-6">
        <label class="sta-label q-mb-xs block">Área</label>
        <q-input
          v-model="store.solicitudActual.area"
          outlined
          dense
          placeholder="Área solicitante"
          :rules="[val => !!val || 'El área es requerida']"
          class="sta-input"
        />
      </div>

      <!-- Solicitante -->
      <div class="col-12 col-sm-6">
        <label class="sta-label q-mb-xs block">Solicitante</label>
        <q-input
          v-model="store.solicitudActual.solicitante"
          outlined
          dense
          placeholder="Nombre del solicitante"
          :rules="[val => !!val || 'El solicitante es requerido']"
          class="sta-input"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { useSolicitudTransporteStore } from '../../../store/solicitudTransporte.store';

export default {
  name: 'StepIdentificacion',
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
.sta-input :deep(.q-field__native) {
  font-size: var(--text-input);
  font-weight: var(--weight-input);
}
</style>
